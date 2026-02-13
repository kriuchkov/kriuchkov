<script setup lang="ts">
const route = useRoute()
const { data: doc } = await useAsyncData(route.path, () => {
  return queryCollection('ai').path(route.path).first()
})

useHead({
  title: doc.value?.title || 'Not Found'
})
</script>

<template>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Grid Background -->
      <div class="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 -z-10"></div>

      <!-- Top Status Bar -->
      <div class="flex items-center justify-between mb-8 py-2 border-b border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-500">
           <div class="flex items-center gap-4">
               <NuxtLink to="/ai" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                   <span>&lt;</span> TERMINATE_SESSION
               </NuxtLink>
           </div>
           
           <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>SYSTEM ONLINE</span>
           </div>
      </div>


     <div v-if="doc" class="lg:grid-cols-[1fr_280px] gap-12 pb-20 relative">
        <!-- Main Terminal Window -->
        <article class="relative bg-white dark:bg-gray-900 overflow-hidden h-fit">
             <!-- Content Area -->
             <div class="pt-6 md:pt-12">
                 <header class="mb-12 not-prose">
                    <div class="flex items-center gap-4 text-xs font-mono text-gray-500 mb-6">
                        <span class="px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30 uppercase">
                            MOD: {{ doc.category || 'GENERAL' }}
                        </span>
                        <span class="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
                        <span class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            ACTIVE_PROCESS
                        </span>
                        <span class="ml-auto text-gray-400 dark:text-gray-600">
                             {{ new Date(doc.date || Date.now()).toLocaleDateString() }}
                        </span>
                    </div>

                    <h1 class="text-2xl lg:text-3xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 font-mono uppercase">
                        <span class="text-blue-600 dark:text-blue-400 mr-2">./</span>{{ doc.title }}<span class="animate-pulse text-blue-500">_</span>
                    </h1>
                    
                    <p class="text-lg text-gray-600 dark:text-gray-400 font-light max-w-3xl leading-relaxed border-l-2 border-blue-500 pl-6 bg-gradient-to-r from-blue-500/5 to-transparent py-2">
                        {{ doc.description }}
                    </p>
                 </header>

                 <div class="prose prose-gray dark:prose-invert max-w-none 
                    prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-blue-100
                    prose-h1:text-3xl
                    prose-h2:text-xl
                    prose-h3:text-lg
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-700
                    prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                 ">
                     <ContentRenderer :value="doc" />
                 </div>
             </div>
        </article>
        
        <!-- Floating Table of Contents -->
        <UiFloatingToc 
           :links="doc.body?.toc?.links || []"
           color="blue"
           title="JUMP_TO"
        />

     </div>
      <div v-else class="text-center py-20 font-mono text-gray-500">
          DATA_CORRUPTED_OR_MISSING
      </div>
  </div>
</template>
