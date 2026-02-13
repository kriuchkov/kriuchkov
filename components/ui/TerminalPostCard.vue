<script setup lang="ts">
interface Article {
  path: string
  title: string
  description?: string
  date?: string
  externalUrl?: string
}

defineProps<{
  article: Article
}>()
</script>

<template>
  <article 
    class="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-5 transition-all hover:shadow-md overflow-hidden"
    :class="[
      article.externalUrl 
        ? 'hover:border-pink-300 dark:hover:border-pink-500/50 dark:hover:shadow-[0_4px_20px_rgba(236,72,153,0.15)]' 
        : 'hover:border-blue-300 dark:hover:border-blue-500/50 dark:hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]'
    ]"
  >
    <!-- Background Glitch Effect for External (Optional) -->
    <div v-if="article.externalUrl" class="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div class="flex gap-0.5">
            <div class="w-1 h-1 bg-pink-500 rounded-full animate-ping"></div>
            <div class="w-1 h-1 bg-purple-500 rounded-full"></div>
        </div>
    </div>

    <!-- Terminal Header Line -->
    <div class="flex items-center justify-between text-xs font-mono text-gray-400 mb-3 pb-2 border-b border-gray-50 dark:border-gray-800/50">
        <div class="flex items-center gap-3">
            <span class="font-bold" :class="article.externalUrl ? 'text-pink-500' : 'text-blue-500'">➜</span>
            <span v-if="article.date">{{ new Date(article.date).toLocaleDateString('en-GB') }}</span>
            <span class="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <span class="hidden sm:inline font-bold text-gray-500 dark:text-gray-500">kriuchkov</span>
        </div>
        <div class="flex items-center gap-2">
             <span v-if="article.externalUrl" class="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/50">
                CURL
             </span>
             <span class="text-gray-300 dark:text-gray-600 font-mono text-[10px]">{{ article.externalUrl ? 'lrwxrwxrwx' : '-rw-r--r--' }}</span>
             <span class="text-gray-300 dark:text-gray-600">@{{ article.externalUrl ? 'wan' : 'staff' }}</span>
        </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors font-mono tracking-tight flex items-center"
               :class="article.externalUrl ? 'group-hover:text-pink-600 dark:group-hover:text-pink-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'"
           >
             <NuxtLink 
                :to="article.externalUrl || article.path" 
                :target="article.externalUrl ? '_blank' : undefined"
                :external="!!article.externalUrl"
             >
               <span class="text-gray-400 dark:text-gray-600 mr-2 opacity-50">{{ article.externalUrl ? '->' : './' }}</span>{{ article.title }}<span class="opacity-0 group-hover:opacity-100 transition-opacity ml-1" :class="article.externalUrl ? 'text-pink-500' : 'text-blue-500'">{{ article.externalUrl ? '.url' : '.md' }}</span>
             </NuxtLink>
             <Icon v-if="article.externalUrl" name="heroicons:arrow-top-right-on-square" class="hidden sm:inline-block ml-2 w-4 h-4 text-gray-400 transition-colors" :class="article.externalUrl ? 'group-hover:text-pink-500' : 'group-hover:text-blue-500'" />
           </h4>
           <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-1 font-mono">
             <span class="text-gray-300 dark:text-gray-700 mr-2">>></span>{{ article.description }}
           </p>
        </div>
        
        <div class="shrink-0">
           <NuxtLink 
              :to="article.externalUrl || article.path" 
              :target="article.externalUrl ? '_blank' : undefined"
              :external="!!article.externalUrl"
              class="inline-flex items-center text-xs font-mono font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-800 border border-transparent px-3 py-1.5 rounded transition-all"
              :class="article.externalUrl 
                ? 'hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-500/30' 
                : 'hover:text-blue-600 dark:hover:text-blue-400 hover:border-gray-200 dark:hover:border-blue-500/30'"
           >
              {{ article.externalUrl ? 'curl' : 'vim' }} {{ article.externalUrl ? 'remote_host' : article.path.split('/').pop() }}
           </NuxtLink>
        </div>
    </div>
  </article>
</template>
