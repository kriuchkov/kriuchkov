<script setup lang="ts">
const { data: items } = await useAsyncData('academy', () => {
  return queryCollection('academy').order('date', 'DESC').all()
})

const locale = ref('ru') // Default to Russian for now or detect

const categories = computed(() => {
  if (!items.value) return []
  
  const categoryMap = new Map()
  
  items.value.forEach(item => {
    // path: /academy/ru/golang/stuff...
    const parts = item.path.split('/').filter(p => p) // ['academy', 'ru', 'golang', ...]
    
    // Check locale
    if (parts[1] !== locale.value) return
    
    const catSlug = parts[2]
    if (!catSlug) return

    if (!categoryMap.has(catSlug)) {
      categoryMap.set(catSlug, {
        slug: catSlug,
        title: catSlug.charAt(0).toUpperCase() + catSlug.slice(1),
        path: `/academy/${locale.value}/${catSlug}`,
        description: `Documentation and guides for ${catSlug}`,
        articleCount: 0
      })
    }
    
    const cat = categoryMap.get(catSlug)
    cat.articleCount++

    // If this item is the "root" of the category (e.g. /academy/ru/golang), use its metadata
    if (parts.length === 3) {
         cat.title = item.title
         cat.description = item.description
    }
  })
  
  return Array.from(categoryMap.values())
})
</script>

<template>
  <div class="space-y-8">
    <UiTerminalSectionHeader 
      title="~/academy"
      to="/academy"
      command="tree -d -L 1"
      color="blue"
      class="mb-8"
    />

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <p class="text-gray-600 dark:text-gray-400 font-mono text-sm border-l-2 border-blue-500 pl-4">
           // Knowledge base, glossaries, and cheat sheets.
        </p>
        
        <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
            <button 
                @click="locale = 'ru'" 
                class="px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all"
                :class="locale === 'ru' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'"
            >
                RU_LANG
            </button>
            <button 
                @click="locale = 'en'" 
                class="px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all"
                :class="locale === 'en' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'"
            >
                EN_LANG
            </button>
        </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <NuxtLink 
        v-for="category in categories" 
        :key="category.slug" 
        :to="category.path"
        class="group relative block p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] overflow-hidden"
      >
        <!-- Background Grid -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>
        
        <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                  <div class="p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon name="heroicons-outline:folder" class="w-6 h-6" />
                  </div>
                  <span class="font-mono text-xs text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                      cd ./{{ category.slug }}
                  </span>
              </div>
              <span class="px-2 py-1 rounded text-[10px] uppercase font-mono tracking-wider border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {{ category.articleCount }} ITEMS
              </span>
            </div>
            
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ category.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 border-l border-gray-200 dark:border-gray-700 pl-3 group-hover:border-blue-500/50 transition-colors">
              {{ category.description }}
            </p>
        </div>
        
        <!-- Corner decorations -->
        <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="absolute bottom-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity">
            <Icon name="heroicons:arrow-right" class="w-5 h-5 text-blue-500 -translate-x-2 group-hover:translate-x-0 transition-transform" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
