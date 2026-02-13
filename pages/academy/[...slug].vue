<script setup lang="ts">
const route = useRoute()

// Fetch current document
const { data: doc } = await useAsyncData(route.path, () => {
  return queryCollection('academy').path(route.path).first()
})

// Fetch navigation tree
const { data: navigation } = await useAsyncData('academy-nav', () => {
  return queryCollection('academy').all()
})

// Process flat list into a tree-like structure specifically for the current category if possible,
// or just grouping by category/folder for sidebar.
const groupedNavigation = computed(() => {
  if (!navigation.value) return {}
  
  const groups: Record<string, any[]> = {}
  
  // Extract locale from current path (e.g. /academy/ru/...)
  const currentPathParts = route.path.split('/').filter(p => p !== '')
  // index 0: academy, index 1: locale (ru/en), index 2: category
  const currentLocale = currentPathParts[1] || 'ru' 
  const currentCategory = currentPathParts[2]

  navigation.value.forEach(item => {
    const itemParts = item.path.split('/').filter(p => p !== '')
    const itemLocale = itemParts[1]
    
    // Only show items for the current locale
    if (itemLocale !== currentLocale) return

    // Extract top-level folder as category (after locale)
    const category = itemParts[2] || 'General'
    
    // Only show items for the current category if defined
    if (currentCategory && category !== currentCategory) return

    if (!groups[category]) groups[category] = []
    groups[category].push(item)
  })

  // Sort items: Main page (index) first, then alphabetical
  Object.keys(groups).forEach(key => {
    const list = groups[key]
    if (list) {
      list.sort((a, b) => {
        // Check if item is the main page for the category (path ends with category name)
        // e.g. /academy/ru/golang matches category 'golang'
        const aIsMain = a.path.endsWith('/' + key)
        const bIsMain = b.path.endsWith('/' + key)
        
        if (aIsMain && !bIsMain) return -1
        if (!aIsMain && bIsMain) return 1
        
        // Sort alphabetically by path to ensure nested items (e.g. folder/file) appear after/grouped with parents
        return (a.path || '').localeCompare(b.path || '')
      })
    }
  })
  
  return groups
})


useHead({
  title: doc.value?.title || 'Not Found'
})

// Helper to determine nesting level for sidebar items
const getItemDepth = (path: string) => {
  const parts = path.split('/').filter(p => p !== '')
  // Base depth is 3 (academy/locale/category), result is 0-based
  return Math.max(0, parts.length - 3)
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 relative px-4 sm:px-6">
    <!-- Grid Background -->
    <div class="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 -z-10"></div>

    <!-- Sidebar Navigation -->
    <aside class="lg:w-60 flex-shrink-0 order-2 lg:order-1">
       <nav class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 thin-scrollbar">
           <!-- Back Link -->
           <div class="mb-8">
               <NuxtLink to="/academy" class="group inline-flex items-center text-sm font-mono text-gray-500 hover:text-blue-400 transition-colors">
                    <span class="mr-2 text-blue-500/50 group-hover:text-blue-400">&lt;</span>
                    cd ..
               </NuxtLink>
           </div>

           <div class="space-y-10">
               <div v-for="(items, category) in groupedNavigation" :key="category" class="relative">
                    <!-- Category Header -->
                    <div class="flex items-center gap-2 mb-4 text-xs font-mono text-gray-500 uppercase tracking-widest pl-1">
                        <Icon name="heroicons-outline:folder" class="w-4 h-4 opacity-50" />
                        {{ category }}
                    </div>
                    
                    <ul class="space-y-1 relative">
                        <!-- Vertical line for the folder -->
                        <div class="absolute left-1.5 top-0 bottom-0 w-px bg-gray-800/50 -z-10"></div>
                        
                        <li v-for="item in items" :key="item.path">
                            <NuxtLink 
                                :to="item.path" 
                                class="group relative flex items-center py-1.5 transition-all text-sm font-mono"
                                :style="{ paddingLeft: `${1 + (getItemDepth(item.path) * 1)}rem` }"
                                :class="[
                                    item.path === route.path 
                                        ? 'text-blue-400' 
                                        : 'text-gray-500 hover:text-gray-300'
                                ]"
                            >
                                <!-- Active Indicator -->
                                <span v-if="item.path === route.path" class="absolute left-0 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                                <!-- Hover Line -->
                                <span class="absolute left-0 w-0.5 h-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors"></span>
                                
                                <span class="truncate relative z-10">
                                    {{ item.title }}
                                </span>
                            </NuxtLink>
                        </li>
                    </ul>
               </div>
           </div>
       </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-grow order-1 lg:order-2 min-w-0 pb-20">
        <div v-if="doc" class="flex flex-col xl:flex-row gap-12 relative">
           <article class="prose prose-gray dark:prose-invert max-w-none flex-grow 
               prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight 
               prose-h1:text-3xl prose-h1:mb-8 prose-h1:text-gray-900 dark:prose-h1:text-white
               prose-h2:text-xl prose-h2:text-gray-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800 prose-h2:pb-2 prose-h2:mt-12
               prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-blue-500/50
               prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
               prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:shadow-none
               prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
               prose-blockquote:border-l-2 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
               prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-p:text-gray-600 dark:prose-p:text-gray-400"
           >
            
            <!-- Article Header -->
            <header class="mb-12 not-prose">
                <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 mb-6">
                    <span class="px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                        {{ doc.category || 'DOCS' }}
                    </span>
                    <span class="flex items-center gap-1">
                        <span class="text-gray-400 dark:text-gray-600">LANG:</span>
                        <div class="flex gap-1" v-if="route.path.includes('/ru/') || route.path.includes('/en/')">
                             <NuxtLink 
                                v-if="route.path.includes('/ru/')"
                                :to="route.path.replace('/ru/', '/en/')"
                                class="hover:text-gray-900 dark:hover:text-white transition-colors"
                             >EN</NuxtLink>
                             <span v-else class="text-gray-900 dark:text-white">EN</span>
                             
                             <span class="text-gray-300 dark:text-gray-700">|</span>
                             
                             <NuxtLink 
                                v-if="route.path.includes('/en/')"
                                :to="route.path.replace('/en/', '/ru/')"
                                class="hover:text-gray-900 dark:hover:text-white transition-colors"
                             >RU</NuxtLink>
                             <span v-else class="text-gray-900 dark:text-white">RU</span>
                        </div>
                    </span>
                    <span class="text-gray-400 dark:text-gray-600 ml-auto">
                        <!-- Reading time or date could go here -->
                        {{ new Date().toLocaleDateString() }}
                    </span>
                </div>

                <h1 class="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 font-sans">
                    <span class="text-blue-500 font-mono mr-2">></span>{{ doc.title }}<span class="animate-pulse text-blue-500">_</span>
                </h1>
                
                <p class="text-lg text-gray-600 dark:text-gray-400 font-light max-w-3xl leading-relaxed border-l-2 border-gray-200 dark:border-gray-800 pl-6">
                    {{ doc.description }}
                </p>
                
                <!-- Helper TOC for Mobile -->
                <div v-if="doc.body?.toc?.links?.length" class="xl:hidden mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg backdrop-blur-sm">
                    <p class="text-xs font-mono font-bold text-gray-500 uppercase mb-3">Contents</p>
                    <ul class="space-y-2">
                        <li v-for="link in doc.body.toc.links" :key="link.id">
                           <a :href="`#${link.id}`" class="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate">
                             > {{ link.text }}
                           </a>
                        </li>
                    </ul>
                </div>
            </header>
            
            <ContentRenderer :value="doc" />

            <!-- Post Footer -->
            <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center not-prose">
                <NuxtLink to="/academy" class="text-sm font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    $ cd ../
                </NuxtLink>
                <button @click="scrollToTop" class="text-sm font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    ^ TOP
                </button>
            </div>
           </article>
           
           <!-- Floating Table of Contents -->
           <UiFloatingToc 
               :links="doc.body?.toc?.links || []"
               color="blue"
               title="ON THIS PAGE"
           />
        </div>

        <div v-else class="py-20 text-center">
            <h1 class="text-6xl font-black text-gray-800 dark:text-gray-800 mb-4 font-mono">404</h1>
            <p class="text-xl text-gray-500 dark:text-gray-400 mb-8 font-mono">Module not found.</p>
            <NuxtLink to="/academy" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-mono text-sm transition-colors">
                Return to Base
            </NuxtLink>
        </div>
    </div>
  </div>
</template>
