<script setup lang="ts">
const route = useRoute()
const overlay = useTuiOverlay()
const { toggle: toggleTheme } = useTuiTheme()

const back = computed(() => {
  const p = route.path
  if (/^\/blog\/.+/.test(p)) return { to: '/blog', label: 'writing' }
  if (/^\/ai\/.+/.test(p)) return { to: '/ai', label: 'ai' }
  return null
})
</script>

<template>
  <header class="tui-tabbar">
    <div class="tui-tabbar__left">
      <NuxtLink v-if="back" :to="back.to" class="tui-tabbar__back tui-only-mobile">
        <span class="tui-accent" aria-hidden="true">‹</span>{{ back.label }}
      </NuxtLink>
      <NuxtLink to="/" class="tui-tabbar__logo" :class="{ 'tui-only-desktop': back }">
        kriuchkov<span class="tui-muted">@web</span>
      </NuxtLink>
      <nav aria-label="Tabs" class="tui-tabbar__tabs">
        <NuxtLink
          v-for="tab in TUI_TABS"
          :key="tab.key"
          :to="tab.to"
          class="tui-tab"
          :class="{ 'is-active': tab.match(route.path) }"
          :aria-current="tab.match(route.path) ? 'page' : undefined"
        >
          <span class="tui-tab__key">{{ tab.key }}</span>{{ tab.label }}
        </NuxtLink>
      </nav>
    </div>
    <div class="tui-tabbar__right">
      <button type="button" class="tui-tabbar__action" aria-label="Search" @click="overlay = 'search'">
        <span class="tui-key tui-only-desktop" aria-hidden="true">/</span>
        <span class="tui-only-desktop" aria-hidden="true">search</span>
        <svg class="tui-only-mobile" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      </button>
      <button type="button" class="tui-tabbar__action" aria-label="Toggle theme" @click="toggleTheme">
        <span class="tui-key tui-only-desktop" aria-hidden="true">t</span>
        <span class="tui-only-desktop" aria-hidden="true">theme</span>
        <svg class="tui-only-mobile" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      </button>
      <button type="button" class="tui-tabbar__action tui-only-desktop" aria-label="Keyboard shortcuts" @click="overlay = 'help'">
        <span class="tui-key" aria-hidden="true">?</span><span aria-hidden="true">keys</span>
      </button>
    </div>
  </header>
</template>
