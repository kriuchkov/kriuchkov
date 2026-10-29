<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const overlay = useTuiOverlay()
const { data: index } = await useTuiIndex()

const path = ref<string>(useRequestURL().pathname || '/')
onMounted(() => { path.value = window.location.pathname })

const notFound = computed(() => props.error.statusCode === 404)
const retired = computed(() => path.value.startsWith('/academy'))
const shown = computed(() => path.value.replace(/^\/+|\/+$/g, '') || '404')

const suggestions = computed(() => {
  const writing = (index.value || []).filter(e => e.kind !== 'project')
  if (retired.value) return writing.filter(e => e.tags.includes('golang')).slice(0, 3)
  const words = path.value.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2)
  const scored = writing
    .map(e => ({ e, score: words.filter(w => `${e.title} ${e.to}`.toLowerCase().includes(w)).length }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.e)
  return (scored.length ? scored : writing).slice(0, 3)
})

const selected = ref(0)
const move = (step: number) => {
  const n = suggestions.value.length
  if (n) selected.value = (selected.value + step + n) % n
}

useHotkeys({
  j: () => move(1),
  k: () => move(-1),
  Enter: () => {
    const item = suggestions.value[selected.value]
    if (item) navigateTo(item.to)
  }
})

useStatusLine(() => ({
  mode: 'ERROR',
  path: `~/${shown.value}`,
  hints: [
    { key: 'enter', label: 'open suggestion' },
    { key: '/', label: 'search' },
    { key: '1', label: 'home' }
  ]
}))

useHead({ title: notFound.value ? 'Not found' : 'Error' })
</script>

<template>
  <NuxtLayout>
    <div class="tui-error">
      <TuiPane :title="`error ${error.statusCode}`" tone="error" heading="h1" class="tui-error__pane">
        <div class="tui-error__shell">
          <p><span class="tui-accent">~ $</span> cd ~/{{ shown }}</p>
          <p class="tui-error__msg">
            <template v-if="notFound">cd: no such file or directory: {{ shown }}</template>
            <template v-else>{{ error.statusMessage || error.message || 'something went wrong' }}</template>
          </p>
        </div>
        <p class="tui-error__lead">{{ notFound ? 'This page doesn’t exist anymore.' : 'Something broke on this page.' }}</p>
        <p v-if="retired" class="tui-soft">The academy section was retired. Its Go material lives on in the writing tab.</p>
        <p v-else-if="notFound" class="tui-soft">The link may be old, or the page moved. One of these could be what you were after.</p>

        <div v-if="suggestions.length" class="tui-error__suggest">
          <p class="tui-muted tui-small">did you mean</p>
          <ul class="tui-list">
            <li v-for="(item, i) in suggestions" :key="item.id">
              <NuxtLink
                :to="item.to"
                class="tui-item"
                :class="{ 'is-selected': i === selected }"
                @mouseenter="selected = i"
                @focus="selected = i"
              >
                <span class="tui-item__marker" aria-hidden="true">{{ i === selected ? '▸' : '' }}</span>
                <span class="tui-item__grow tui-strong">{{ item.title }}</span>
                <span class="tui-muted tui-nowrap">~/{{ item.kind === 'note' ? 'ai' : 'writing' }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="tui-actions tui-error__actions">
          <NuxtLink to="/" class="tui-btn"><span class="tui-key">1</span>home</NuxtLink>
          <button type="button" class="tui-btn" @click="overlay = 'search'"><span class="tui-key">/</span>search</button>
          <NuxtLink to="/blog" class="tui-btn"><span class="tui-key">3</span>writing</NuxtLink>
        </div>
      </TuiPane>
    </div>
  </NuxtLayout>
</template>
