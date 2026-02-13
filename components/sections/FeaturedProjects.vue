<script setup lang="ts">
interface Project {
  title: string
  path: string
  license?: string
  description?: string
  image?: string
  link?: string
  stack?: string[]
}

defineProps<{ projects: Project[] }>()
</script>

<template>
  <section v-if="projects?.length">
    <UiTerminalSectionHeader 
      title="~/my-projects"
      to="/projects"
      command="cd /projects"
      color="blue"
    />

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink 
        v-for="project in projects.slice(0, 3)" :key="project.path" :to="project.link" target="_blank"
        class="group relative h-96 rounded-2xl overflow-hidden isolate shadow-lg ring-1 ring-black/5"
      >
        <!-- Background Image with Zoom Effect -->
        <div class="absolute inset-0">
            <img 
                v-if="project.image"
                :src="project.image" 
                :alt="project.title"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div v-else class="h-full w-full bg-gray-800 flex items-center justify-center">
                 <Icon name="heroicons-outline:code-bracket" class="w-20 h-20 text-gray-700" />
            </div>
        </div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90 transition-opacity duration-300" />

        <!-- Content Layout -->
        <div class="relative h-full flex flex-col justify-between p-6">
            
            <!-- Top Section: Badges -->
            <div class="flex justify-between items-start">
                <div class="flex flex-wrap gap-1.5 max-w-[70%]">
                    <span v-for="tech in project.stack?.slice(0, 2)" :key="tech" class="backdrop-blur-md bg-white/10 text-white border border-white/20 px-2 py-1 rounded text-[10px] font-medium tracking-wide">
                        {{ tech }}
                    </span>
                    <span v-if="project.stack && project.stack.length > 2" class="backdrop-blur-md bg-white/10 text-gray-300 border border-white/20 px-2 py-1 rounded text-[10px]">
                        +{{ project.stack.length - 2 }}
                    </span>
                </div>
                
                <span v-if="project.license" class="backdrop-blur-md bg-black/40 text-gray-300 border border-white/10 px-2 py-1 rounded-full text-[10px] font-mono">
                    {{ project.license }}
                </span>
            </div>

            <!-- Bottom Section: Info -->
            <div>
                <h4 class="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors leading-tight">
                    {{ project.title }}
                </h4>
                <p class="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4 opacity-90">
                    {{ project.description }}
                </p>
                
                <div class="flex items-center text-blue-300 text-sm font-bold font-mono group-hover:translate-x-2 transition-transform duration-300">
                    <span>./view_project.sh</span>
                    <Icon name="heroicons-outline:arrow-right" class="w-4 h-4 ml-2" />
                </div>
            </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
