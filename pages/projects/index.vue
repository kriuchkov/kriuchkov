<script setup lang="ts">
const { data: projects } = await useAsyncData('all-projects', () => {
  return queryCollection('projects').order('sort', 'ASC').all()
})
</script>

<template>
  <div class="relative min-h-screen">
      <div class="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 -z-10"></div>

    <div class="max-w-7xl mx-auto pb-20">
      <UiTerminalSectionHeader 
        title="~/deployments"
        to="/projects"
        command="docker ps --format 'table {{.Names}}\t{{.Status}}'"
        color="green"
        class="mb-12"
      />
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <UiProjectCard 
          v-for="(project, index) in projects" 
          :key="project.path" 
          :project="project" 
          :index="index" 
        />
      </div>

    </div>
  </div>
</template>

