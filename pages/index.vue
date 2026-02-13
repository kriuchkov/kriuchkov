<script setup lang="ts">
const appConfig = useAppConfig()

useHead({
  title: `${appConfig.profile.name} - ${appConfig.profile.title}`,
  meta: [
    {
      name: 'description',
      content: appConfig.profile.shortDescription || appConfig.profile.description.replace(/<br><br>/g, ' ')
    },
    {
      name: 'keywords',
      content: appConfig.seo.keywords
    }
  ]
})

const { data: articles } = await useAsyncData('latest-logs', () => {
  return queryCollection('blog').order('date', 'DESC').limit(5).all()
}, { default: () => [] })

const { data: projects } = await useAsyncData('featured-projects', () => {
  return queryCollection('projects').order('sort', 'ASC').limit(4).all()
}, { default: () => [] })

const { data: academyUpdates } = await useAsyncData('latest-academy', () => {
  return queryCollection('academy')
    .order('date', 'DESC')
    .limit(3)
    .all()
}, { default: () => [] })

const { data: aiUpdates } = await useAsyncData('latest-ai', () => {
  return queryCollection('ai')
    .order('date', 'DESC')
    .limit(3)
    .all()
}, { default: () => [] })
</script>

<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <SectionsHeroSection />

    <!-- FeaturedProjects -->
    <SectionsFeaturedProjects :projects="projects" />

    <!-- AI Productivity -->
    <SectionsAiSection :items="aiUpdates" />

    <!-- Academy Updates -->
    <SectionsAcademyUpdates :items="academyUpdates" />

    <!-- Latest Posts -->
    <SectionsLatestPosts :articles="articles" />
  </div>
</template>
