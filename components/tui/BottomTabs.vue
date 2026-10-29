<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <nav aria-label="Tabs" class="tui-bottomtabs">
    <NuxtLink
      v-for="tab in TUI_TABS"
      :key="tab.key"
      :to="tab.to"
      class="tui-bottomtab"
      :class="{ 'is-active': tab.match(route.path) }"
      :aria-current="tab.match(route.path) ? 'page' : undefined"
    >
      <span class="tui-bottomtab__key" aria-hidden="true">{{ tab.key }}</span>{{ tab.label }}
    </NuxtLink>
  </nav>
</template>
