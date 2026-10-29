<script setup lang="ts">
const route = useRoute()
const status = useTuiStatus()
const hydrated = useMountedFlag()
const mode = computed(() => (hydrated.value ? status.value.mode : modeForPath(route.path)))
const overlay = useTuiOverlay()
const { toggle: toggleTheme } = useTuiTheme()

watch(() => route.fullPath, () => { overlay.value = 'none' })

useHotkeys({
  '1': () => { navigateTo('/') },
  '2': () => { navigateTo('/projects') },
  '3': () => { navigateTo('/blog') },
  '4': () => { navigateTo('/ai') },
  '/': () => { overlay.value = 'search' },
  '?': () => { overlay.value = 'help' },
  't': () => { toggleTheme() },
  'Escape': () => {
    if (overlay.value === 'none') return false
    overlay.value = 'none'
  }
}, { priority: 0 })
</script>

<template>
  <div class="tui" :data-mode="mode">
    <a href="#main" class="tui-skip">skip to content</a>
    <TuiTabBar />
    <main id="main" class="tui-main">
      <slot />
    </main>
    <TuiStatusLine />
    <TuiBottomTabs />
    <TuiSearch v-if="overlay === 'search'" />
    <TuiHelp v-else-if="overlay === 'help'" />
  </div>
</template>
