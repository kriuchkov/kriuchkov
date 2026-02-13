<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <button
    aria-label="Toggle Dark Mode"
    class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none ring-gray-200 dark:ring-gray-700"
    @click="isDark = !isDark"
  >
    <Icon v-if="isDark" name="heroicons-outline:moon" class="w-5 h-5" />
    <Icon v-else name="heroicons-solid:sun" class="w-5 h-5" />
  </button>
</template>
