<script setup lang="ts">
const { data: articles } = await useAsyncData('all-ai', () => {
  return queryCollection('ai').order('date', 'DESC').all()
})

const items = computed(() => {
    return articles.value?.map((article, i) => ({
        ...article,
        // Mock tech data for visual feel
        hash: ((article.title.length * 123456).toString(16).substring(0, 6)).toUpperCase(),
        cpu: (article.description?.length || 100) % 100
    })) || []
})
</script>

<template>
  <div class="space-y-10">
    <UiTerminalSectionHeader 
      title="~/ai-modules"
      to="/ai"
      command="./list_modules.sh --verbose"
      color="purple"
    />

    <div class="flex flex-col gap-4">
        <NuxtLink 
            v-for="(item, i) in items" 
            :key="item.path" 
            :to="item.path"
            class="group relative flex items-stretch min-h-[100px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 overflow-hidden rounded shadow-sm hover:shadow-md"
        >
            <!-- Index / Status Strip -->
            <div class="w-12 sm:w-16 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-800 group-hover:bg-purple-500/10 transition-colors">
                <span class="font-mono text-xs text-gray-400 dark:text-gray-600 group-hover:text-purple-500 transition-colors">#{{ i < 9 ? '0' + (i + 1) : i + 1 }}</span>
                <div class="h-8 w-px bg-gray-300 dark:bg-gray-700 my-2 group-hover:bg-purple-500/50 transition-colors"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            </div>

            <!-- Content Area -->
            <div class="flex-grow p-4 sm:p-5 flex flex-col justify-center gap-2">
                <div class="flex items-center justify-between">
                    <h3 class="font-bold text-gray-900 dark:text-gray-100 font-mono text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {{ item.title }}
                    </h3>
                    <div class="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-black/30 text-[10px] font-mono text-gray-500">
                        <Icon name="heroicons:cpu-chip" class="w-3 h-3" />
                        <span>PID:{{ item.hash }}</span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-1 pr-4">
                     <span class="text-purple-500 dark:text-purple-400 opacity-50 font-mono">></span> {{ item.description }}
                </p>
            </div>

            <!-- Decorative corner accent -->
            <div class="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-gray-200 dark:border-r-gray-800 group-hover:border-r-purple-500 transition-colors"></div>
        </NuxtLink>
    </div>
  </div>
</template>
