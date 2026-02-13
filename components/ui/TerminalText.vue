<template>
  <component :is="tag" class="terminal-cursor inline-block">
    {{ displayedText }}
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: 'h1'
  },
  speed: {
    type: Number,
    default: 50
  },
  delay: {
    type: Number,
    default: 0
  }
})

const displayedText = ref('')

onMounted(() => {
  setTimeout(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < props.text.length) {
        displayedText.value += props.text.charAt(i)
        i++
      } else {
        clearInterval(interval)
      }
    }, props.speed)
  }, props.delay)
})
</script>
