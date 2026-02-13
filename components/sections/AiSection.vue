<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <section v-if="items?.length">
    <UiTerminalSectionHeader 
      title="~/ai-productivity"
      to="/ai"
      command="cd /ai"
      color="purple"
    />

    <!-- Cyberpunk Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Main Feature Card (Takes 2 columns) -->
        <NuxtLink 
            :to="items[0].path"
            class="group relative md:col-span-2 min-h-[300px] md:min-h-[400px] rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col"
        >
             <!-- Cyberpunk Grid Background -->
             <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
             
             <div class="absolute top-0 right-0 p-4 opacity-50">
                <div class="flex gap-1 justify-end">
                    <div class="w-16 h-1 bg-purple-500/50"></div>
                    <div class="w-4 h-1 bg-cyan-500/50"></div>
                </div>
             </div>

             <div class="relative z-10 flex flex-col h-full p-8 md:p-10 justify-between">
                 <div>
                     <div class="flex items-center gap-3 text-sm mb-6 font-mono">
                         <span class="inline-flex items-center px-1.5 py-0.5 rounded border border-purple-500/50 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs uppercase tracking-wider">
                            <span class="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-500 rounded-full mr-1.5 animate-pulse"></span>
                            NET.LATEST
                         </span>
                         <time v-if="items[0].date" class="text-gray-500">{{ new Date(items[0].date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.') }}</time>
                     </div>
                     <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 dark:group-hover:from-purple-400 dark:group-hover:to-cyan-400 transition-all font-mono">
                         {{ items[0].title }}
                     </h3>
                     <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl border-l-2 border-purple-200 dark:border-purple-900/50 pl-4">
                         {{ items[0].description }}
                     </p>
                 </div>
                 
                 <div class="mt-8 flex items-center text-cyan-600 dark:text-cyan-400 font-bold font-mono group-hover:translate-x-1 transition-transform uppercase text-sm tracking-wider">
                     [ Read_Sequence ]
                     <span class="ml-2 text-lg">›</span>
                 </div>
             </div>
             
             <!-- Cyber Corner Accents -->
             <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg group-hover:border-cyan-500 dark:group-hover:border-cyan-400 transition-colors"></div>
        </NuxtLink>

        <!-- Side Stack (Takes 1 column) -->
        <div class="flex flex-col gap-6">
            <template v-if="items.length > 1">
                <NuxtLink 
                    v-for="item in items.slice(1, 3)" 
                    :key="item.path"
                    :to="item.path"
                    class="group flex-1 relative rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-cyan-500/50 p-6 md:p-8 flex flex-col justify-center transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                >
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-2">
                             <time v-if="item.date" class="text-xs text-gray-500 font-mono">{{ new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace(/\//g, '.') }}</time>
                             <span class="text-[10px] text-cyan-600 dark:text-cyan-500/50 font-mono uppercase border border-cyan-200 dark:border-cyan-900/50 px-1">Node</span>
                        </div>
                        <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 font-mono">
                            {{ item.title }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-500 line-clamp-2 border-l border-gray-200 dark:border-gray-800 pl-3 group-hover:border-cyan-500/30 transition-colors">
                            {{ item.description }}
                        </p>
                    </div>
                </NuxtLink>
            </template>
            <!-- Placeholder if not enough items -->
            <div v-else class="flex-1 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 font-mono text-sm uppercase tracking-widest">
                [ No_Data ]
            </div>
        </div>

    </div>
  </section>
</template>
