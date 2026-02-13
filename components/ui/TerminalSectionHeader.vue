<script setup lang="ts">
interface Props {
  title: string
  to: string
  command: string
  color?: 'blue' | 'purple' | 'green' | 'cyan'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const colorClasses = computed(() => {
  const colors = {
    blue: {
      accent: 'text-blue-600 dark:text-blue-500',
      border: 'hover:border-blue-500',
      linkHover: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    purple: {
      accent: 'text-purple-600 dark:text-purple-500',
      border: 'hover:border-purple-500',
      linkHover: 'hover:text-purple-600 dark:hover:text-purple-400'
    },
    green: {
      accent: 'text-green-600 dark:text-green-500',
      border: 'hover:border-green-500',
      linkHover: 'hover:text-green-600 dark:hover:text-green-400'
    },
    cyan: {
      accent: 'text-cyan-600 dark:text-cyan-500',
      border: 'hover:border-cyan-500',
      linkHover: 'hover:text-cyan-600 dark:hover:text-cyan-400'
    }
  }
  return colors[props.color] || colors.blue
})
</script>

<template>
  <div class="flex items-center justify-between mb-8">
    <h3 class="font-mono text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center">
      <span class="mr-2 text-lg" :class="colorClasses.accent">➜</span> 
      <span class="border-b-2 border-transparent transition-colors" :class="colorClasses.border">{{ title }}</span>
      <span class="animate-pulse ml-2" :class="colorClasses.accent">_</span>
    </h3>
    <NuxtLink :to="to" class="text-xs font-mono text-gray-500 dark:text-gray-500 transition-colors" :class="colorClasses.linkHover">
      {{ command }}
    </NuxtLink>
  </div>
</template>
