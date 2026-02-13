<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = useRuntimeConfig().app.baseURL
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return `${_base}${props.src.slice(1)}`
    }
  }
  return props.src
})
</script>

<template>
  <NuxtImg
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    class="rounded-lg shadow-lg my-8"
    loading="lazy"
  />
</template>
