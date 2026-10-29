<script setup lang="ts">
const route = useRoute()
const slug = [route.params.slug].flat().filter(Boolean).join('/')
const path = `/blog/${slug}`

const { data: doc } = await useAsyncData(path, () => queryCollection('blog').path(path).first())
if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: siblings } = await useAsyncData('blog-siblings', () =>
  queryCollection('blog').order('date', 'DESC').select('title', 'path').all()
)

useHead({
  title: () => doc.value?.title || 'Not Found',
  meta: [{ name: 'description', content: () => doc.value?.description || '' }]
})
</script>

<template>
  <TuiArticle v-if="doc" :doc="doc" section="blog" :siblings="siblings || []" />
</template>
