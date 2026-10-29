<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} // KRIUCKOV.COM` : 'KRIUCKOV.COM'
  }
})

// Shared by the search panel, the 404 page and the home counters.
await useTuiIndex()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
