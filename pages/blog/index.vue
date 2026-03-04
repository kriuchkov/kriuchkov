<script setup lang="ts">
const { data: articles } = await useAsyncData('all-logs', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})
</script>

<template>
  <div class="space-y-8">
    <UiTerminalSectionHeader 
      title="~/all-posts" to="/blog" command="ls -la" color="blue"
    />

    <div class="space-y-4">
      <UiTerminalPostCard v-for="article in articles" :key="article.path" :article="article" />
    </div>
  </div>
</template>
