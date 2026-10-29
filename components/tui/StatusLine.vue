<script setup lang="ts">
const route = useRoute()
const hydrated = useMountedFlag()
const status = useTuiStatus()
const overlay = useTuiOverlay()
const flash = useTuiFlash()
const query = useTuiSearchQuery()

const view = computed(() => {
  if (!hydrated.value) {
    return { mode: modeForPath(route.path), path: '', hints: [] as TuiHint[], note: '', right: '', progress: null as number | null }
  }
  if (overlay.value === 'search') {
    return {
      mode: 'SEARCH',
      path: `/${query.value}`,
      hints: [] as TuiHint[],
      note: 'single-letter shortcuts paused while typing',
      right: '',
      progress: null as number | null
    }
  }
  if (overlay.value === 'help') {
    return { ...status.value, hints: [{ key: 'esc', label: 'close' }], note: '' }
  }
  return { ...status.value, note: '' }
})

const meter = computed(() => view.value.progress === null ? null : bar(view.value.progress, 10))
</script>

<template>
  <footer class="tui-status" :data-mode="view.mode">
    <span class="tui-status__mode">{{ view.mode }}</span>
    <span v-if="view.path" class="tui-status__path">{{ view.path }}</span>
    <span class="tui-status__hints" aria-live="polite">
      <span v-if="flash" class="tui-status__flash">{{ flash }}</span>
      <span v-else-if="view.note">{{ view.note }}</span>
      <template v-else>
        <span v-for="hint in view.hints" :key="hint.key + hint.label"><span class="tui-key">{{ hint.key }}</span> {{ hint.label }}</span>
      </template>
    </span>
    <span v-if="meter" class="tui-status__right">
      <span aria-hidden="true"><span class="tui-accent">{{ meter.filled }}</span><span class="tui-faint">{{ meter.empty }}</span></span>{{ view.progress }}%
    </span>
    <span v-else-if="view.right" class="tui-status__right">{{ view.right }}</span>
  </footer>
</template>
