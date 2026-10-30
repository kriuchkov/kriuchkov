<script setup lang="ts">
defineProps<{
  src: string
  name: string
  meta?: string
}>()
</script>

<template>
  <div class="tui-logo">
    <img :src="src" alt="" class="tui-logo__mark" width="112" height="112">
    <p class="tui-logo__name">{{ name }}</p>
    <p v-if="meta" class="tui-muted">{{ meta }}</p>
  </div>
</template>
