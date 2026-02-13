<script setup lang="ts">
const route = useRoute()
const { data: doc } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

const { data: allPosts } = await useAsyncData('blog-nav', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

// Group posts by Year -> Month for sidebar navigation
const groupedNavigation = computed(() => {
  if (!allPosts.value) return {}
  
  const groups: Record<string, any[]> = {}
  
  allPosts.value.forEach(post => {
      if (!post.date) return
      const date = new Date(post.date)
      const year = date.getFullYear()
      // const month = date.toLocaleString('default', { month: '2-digit' })
      const key = `${year}`
      
      if (!groups[key]) groups[key] = []
      groups[key].push(post)
  })
  
  return groups
})

useHead({
  title: doc.value?.title || 'Not Found'
})

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 relative px-4 sm:px-6">
    <!-- Grid Background (Pink Tint) -->
     <div class="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 -z-10"></div>

    <!-- Sidebar Navigation -->
    <aside class="lg:w-60 flex-shrink-0 order-2 lg:order-1">
       <nav class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 thin-scrollbar">
           <!-- Back Link -->
           <div class="mb-8">
               <NuxtLink to="/blog" class="group inline-flex items-center text-sm font-mono text-gray-500 hover:text-pink-400 transition-colors">
                    <span class="mr-2 text-pink-500/50 group-hover:text-pink-400">&lt;</span>
                    cd /var/logs
               </NuxtLink>
           </div>

           <BlogSidebar :navigation="groupedNavigation" />
       </nav>
    </aside>

    <!-- Main Content -->
     <div class="flex-grow order-1 lg:order-2 min-w-0 pb-20">
        <div v-if="doc" class="flex flex-col xl:flex-row gap-12 relative">
           <article class="prose prose-gray dark:prose-invert max-w-none flex-grow 
               prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight 
               prose-h1:text-3xl prose-h1:mb-8 prose-h1:text-gray-900 dark:prose-h1:text-white
               prose-h2:text-xl prose-h2:text-gray-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-pink-500/30 prose-h2:pb-2 prose-h2:mt-12
               prose-h3:text-xl prose-h3:text-gray-900 dark:prose-h3:text-white prose-h3:mt-5 
               prose-a:text-pink-600 dark:prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-pink-500/50
               prose-code:text-pink-600 dark:prose-code:text-pink-300 prose-code:bg-pink-50 dark:prose-code:bg-pink-900/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
               prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800 prose-pre:shadow-none
               prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
               prose-blockquote:border-l-2 prose-blockquote:border-pink-500 prose-blockquote:bg-pink-50 dark:prose-blockquote:bg-pink-900/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
               prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-p:text-gray-600 dark:prose-p:text-gray-400"
           >
            
            <!-- Article Header -->
            <header class="mb-12 not-prose">
                <div class="flex items-center gap-4 text-xs font-mono text-gray-500 mb-6">
                    <span class="px-2 py-1 rounded bg-pink-50 text-pink-600 border border-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-900/30">
                        LOG_ENTRY
                    </span>
                    <span class="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
                    <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                        RECORDING
                    </span>
                    <span class="ml-auto text-gray-400 dark:text-gray-600">
                         {{ new Date(doc.date).toLocaleDateString() }}
                    </span>
                </div>

                <h1 class="text-2xl lg:text-3xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 font-mono uppercase">
                    <span class="text-pink-500 mr-2">></span>{{ doc.title }}<span class="animate-pulse text-pink-500">_</span>
                </h1>
                
                <p class="text-lg text-gray-600 dark:text-gray-400 font-light max-w-3xl leading-relaxed border-l-2 border-pink-500 pl-6 bg-gradient-to-r from-pink-500/5 to-transparent py-2">
                    {{ doc.description }}
                </p>
            </header>
            
            <ContentRenderer :value="doc" />

            <!-- Post Footer -->
            <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center not-prose text-xs font-mono">
                <div class="flex gap-4">
                    <span class="text-gray-500">END_OF_TRANSMISSION</span>
                    <span class="text-pink-500">Hash: <UiContentHash :content="doc.description" /></span>
                </div>

                <button @click="scrollToTop" class="text-gray-500 hover:text-pink-500 transition-colors uppercase">
                    ^ Return to Top
                </button>
            </div>
           </article>
           
           <!-- Floating Table of Contents -->
           <UiFloatingToc 
               :links="doc.body?.toc?.links || []"
               color="pink"
               title="SYSTEM_LOGS"
           />
        </div>

        <div v-else class="py-20 text-center">
             <h1 class="text-6xl font-black text-gray-200 dark:text-gray-800 mb-4 font-mono">404</h1>
             <p class="font-mono text-pink-500">Log entry missing or corrupted.</p>
        </div>
     </div>
  </div>
</template>
