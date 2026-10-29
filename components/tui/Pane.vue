<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  meta?: string | number
  focused?: boolean
  /** list panes keep rows edge to edge */
  list?: boolean
  tone?: 'default' | 'error' | 'key'
  as?: string
  heading?: 'h1' | 'h2' | 'div'
}>(), {
  meta: undefined,
  focused: false,
  list: false,
  tone: 'default',
  as: 'section',
  heading: 'h2'
})
</script>

<template>
  <component
    :is="as"
    class="tui-pane"
    :class="{ 'is-focused': focused, 'tui-pane--list': list, [`tui-pane--${tone}`]: tone !== 'default' }"
  >
    <component :is="heading" class="tui-pane__title">
      {{ title }}<span v-if="meta !== undefined && meta !== ''" class="tui-pane__meta">{{ ` ${meta}` }}</span>
    </component>
    <slot />
  </component>
</template>
