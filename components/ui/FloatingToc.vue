<script setup lang="ts">
import { computed } from 'vue'

interface TocLink {
  id: string
  text: string
  children?: TocLink[]
}

const props = withDefaults(defineProps<{
  links: TocLink[]
  title?: string
  color?: 'blue' | 'pink' | 'purple'
}>(), {
  title: 'ON THIS PAGE',
  color: 'blue'
})

// Color configuration mapping to ensure Tailwind classes are available
const colorStyles = computed(() => {
  const colors = {
    blue: {
      triggerText: 'dark:text-blue-500/80',
      triggerHover: 'group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:border-blue-500',
      glow: 'bg-blue-500/5',
      dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]',
      linkHover: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    pink: {
      triggerText: 'dark:text-pink-500/80',
      triggerHover: 'group-hover:bg-pink-600 dark:group-hover:bg-pink-600 group-hover:border-pink-500',
      glow: 'bg-pink-500/5',
      dot: 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]',
      linkHover: 'hover:text-pink-600 dark:hover:text-pink-400'
    },
    purple: {
      triggerText: 'dark:text-purple-500/80',
      triggerHover: 'group-hover:bg-purple-600 dark:group-hover:bg-purple-600 group-hover:border-purple-500',
      glow: 'bg-purple-500/5',
      dot: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
      linkHover: 'hover:text-purple-600 dark:hover:text-purple-400'
    }
  }
  return colors[props.color] || colors.blue
})
</script>

<template>
  <div v-if="links?.length" class="hidden xl:block absolute -right-6 top-0 bottom-0 pointer-events-none z-20">
    <div class="sticky top-32 pointer-events-auto flex justify-end group pr-2">
      <!-- Trigger Icon -->
      <div 
        class="p-2.5 bg-gray-900 dark:bg-[#0f172a] border border-gray-700 dark:border-gray-800 rounded-lg text-white shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer group-hover:text-white transition-all duration-300 backdrop-blur-sm z-30"
        :class="[colorStyles.triggerText, colorStyles.triggerHover]"
      >
        <Icon name="heroicons-outline:list-bullet" class="w-6 h-6" />
      </div>

      <!-- Popover Content -->
      <div class="absolute right-full top-0 mr-4 w-80 bg-white dark:bg-[#0B1221] border border-gray-200 dark:border-gray-800/80 rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 z-20">
        <!-- Decorative glow -->
        <div class="absolute inset-0 rounded-xl pointer-events-none" :class="colorStyles.glow"></div>

        <div class="relative">
          <h3 class="font-mono text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full" :class="colorStyles.dot"></span>
            {{ title }}
          </h3>

          <nav class="relative">
            <div class="absolute left-[3px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
            <ul class="space-y-1">
              <li v-for="link in links" :key="link.id" class="pl-5 relative group/item">
                <a 
                  :href="`#${link.id}`" 
                  class="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors py-1 leading-relaxed"
                  :class="colorStyles.linkHover"
                >
                  {{ link.text }}
                </a>

                <ul v-if="link.children" class="mt-1 space-y-1 border-l border-gray-200 dark:border-gray-800/50 pl-3 ml-[-0.5rem]">
                  <li v-for="child in link.children" :key="child.id">
                    <a 
                      :href="`#${child.id}`"
                      class="block text-xs text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors py-0.5"
                    >
                      {{ child.text }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
