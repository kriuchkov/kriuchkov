<script setup lang="ts">
const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array as PropType<number[]>, default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
  style: { type: [String, Object] as PropType<string | Record<string, string>>, default: null }
})

const copy = useTuiCopy()
</script>

<template>
  <figure class="tui-code">
    <figcaption class="tui-code__label">
      <span>{{ props.filename || props.language || 'text' }}</span>
      <span aria-hidden="true">·</span>
      <button type="button" class="tui-code__copy" @click="copy(props.code, 'copied code')">copy</button>
    </figcaption>
    <pre :class="props.class" :style="props.style"><slot /></pre>
  </figure>
</template>

<style>
pre code .line { display: block; }
</style>
