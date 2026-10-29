<script setup lang="ts">
const route = useRoute()
const slug = [route.params.slug].flat().filter(Boolean).join('/')
const path = `/ai/${slug}`

const { data: doc } = await useAsyncData(path, () => queryCollection('ai').path(path).first())
if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Note not found', fatal: true })
}

const { data: siblings } = await useAsyncData('ai-siblings', () =>
  queryCollection('ai').order('date', 'DESC').select('title', 'path').all()
)

useHead({
  title: () => doc.value?.title || 'Not Found',
  meta: [{ name: 'description', content: () => doc.value?.description || '' }]
})
</script>

<template>
  <TuiArticle v-if="doc" :doc="doc" section="ai" :siblings="siblings || []" />
</template>
