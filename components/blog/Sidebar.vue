<script setup lang="ts">
defineProps<{
  navigation: Record<string, any[]>
}>()

const route = useRoute()
</script>

<template>
  <div class="space-y-8">
    <div v-for="(posts, year) in navigation" :key="year" class="relative">
      <!-- Category Header -->
      <div class="flex items-center gap-2 mb-4 text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">
        <Icon name="heroicons-outline:archive-box" class="w-4 h-4 opacity-50" />
        LOGS_{{ year }}
      </div>

      <ul class="space-y-1 relative">
        <!-- Vertical line -->
        <div class="absolute left-1.5 top-0 bottom-0 w-px bg-pink-500/20 -z-10"></div>

        <li v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path" class="group relative flex items-center py-1.5 transition-all text-sm font-mono pl-6"
            :class="[
              post.path === route.path
                ? 'text-pink-500 font-bold'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            ]">
            <!-- Active Indicator -->
            <span v-if="post.path === route.path"
              class="absolute left-0 w-1 h-1 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
            <!-- Branch decorative line -->
            <span
              class="absolute left-1.5 top-1/2 w-3 h-px bg-pink-500/20 group-hover:bg-pink-500/50 transition-colors"></span>

            <span class="truncate relative z-10">
              {{ post.title }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
