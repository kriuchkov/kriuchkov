
<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <section v-if="items?.length">
    <UiTerminalSectionHeader 
      title="~/academy-updates"
      to="/academy"
      command="cd /academy"
      color="blue"
    />
    
    <div class="grid gap-6 md:grid-cols-3">
      <NuxtLink 
        v-for="item in items" 
        :key="item.path" 
        :to="item.path"
        class="group relative flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] overflow-hidden"
      >
        <!-- Cyberpunk Grid Background -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>

        <div class="relative z-10 h-full flex flex-col">
          <div class="flex items-center justify-between gap-x-4 text-xs font-mono mb-4">
             <div class="flex items-center text-blue-600 dark:text-blue-400">
               <span class="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full mr-2 animate-pulse"></span>
               ACAD.LOG
             </div>
             <time :datetime="item.date" class="text-gray-400">{{ new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.') }}</time>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-mono">
            {{ item.title }}
          </h3>
          
          <p class="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-3 group-hover:border-blue-500/50 transition-colors mb-6 flex-grow">
             {{ item.description }}
          </p>

          <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
             <span class="text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
               {{ item.category || 'Module' }}
             </span>
             <div class="text-blue-600 dark:text-blue-400 text-xs font-bold font-mono group-hover:translate-x-1 transition-transform">
               [ OPEN_MODULE ]
             </div>
          </div>
        </div>

        <!-- Cyber Corner Accents -->
        <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-blue-500/30 rounded-tl-lg transition-colors"></div>
        <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gray-200 dark:border-gray-800 group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-br-lg transition-colors"></div>
      </NuxtLink>
    </div>
  </section>
</template>