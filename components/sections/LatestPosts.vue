<script setup lang="ts">
interface Article {
  path: string
  title: string
  description?: string
  date?: string
  externalUrl?: string
}

defineProps<{
  articles: Article[]
}>()
</script>

<template>
  <section v-if="articles?.length">
    <UiTerminalSectionHeader 
      title="~/latest-posts"
      to="/blog"
      command="cd /blog"
      color="blue"
    />

    <div class="grid gap-4">
      <UiTerminalPostCard v-for="article in articles" :key="article.path" :article="article" />
    </div>
    
    <div class="mt-8 flex justify-center">
      <NuxtLink to="/blog" class="group inline-flex items-center text-sm font-mono text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50">
        <span class="text-blue-500 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">$</span> ls -la /blog_archive
      </NuxtLink>
    </div>
  </section>
</template>
