<script setup lang="ts">
defineProps<{
  project: any
  index: number
}>()

const getStatusColor = (index: number) => {
  const colors = ['text-green-500', 'text-amber-500', 'text-cyan-500']
  return colors[index % colors.length]
}

const getStatusText = (index: number) => {
    const statuses = ['ONLINE', 'DEPLOYING', 'MONITORING']
    return statuses[index % statuses.length]
}
</script>

<template>
  <div class="group relative">
       <!-- Connector Lines (Decorative) -->
       <div class="absolute -left-4 top-8 w-4 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-green-500/50 transition-colors hidden lg:block"></div>
       <div class="absolute -left-4 top-[2.1rem] w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full hidden lg:block"></div>
       
       <!-- start: сard Frame -->
       <div class="relative bg-white dark:bg-[#0B1221] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-green-500/50 dark:hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col h-full">
          
          <!-- Terminal Title Bar -->
          <div class="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-gray-800 text-[10px] font-mono select-none">
              <div class="flex items-center gap-2">
                  <span class="text-gray-400">PID:{{ 8472 + index * 123 }}</span>
                  <span class="text-gray-300 dark:text-gray-600">|</span>
                  <span class="text-gray-500 dark:text-gray-400">USER: root</span>
              </div>
              <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full" :class="index % 2 === 0 ? 'bg-green-500 animate-pulse' : 'bg-amber-500'"></span>
                  <span :class="getStatusColor(index)">{{ getStatusText(index) }}</span>
              </div>
          </div>

          <!-- Main Content Layout -->
          <div class="flex-grow flex flex-col sm:flex-row h-full">
               <!-- Image / Viewport Area -->
               <div class="relative w-full sm:w-2/5 min-h-[200px] bg-black group overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800">
                   <!-- Image -->
                   <img 
                      v-if="project.image" 
                      :src="project.image" 
                      :alt="project.title" 
                      class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 filter grayscale group-hover:grayscale-0" 
                   />
                   
                   <!-- CRT Overlay -->
                   <div class="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none mix-blend-overlay"></div>
                   <div class="absolute inset-0 bg-[url('/images/scanlines.png')] opacity-10 pointer-events-none"></div>
                   
                   <!-- Viewport Overlay Info -->
                   <div class="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 border border-green-500/30 rounded text-[10px] font-mono text-green-400">
                      VIEWPORT_0{{ index + 1 }}
                   </div>
               </div>

               <!-- Details Area -->
               <div class="p-6 sm:w-3/5 flex flex-col">
                   <div class="flex-grow">
                       <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                           <span class="text-green-500 mr-2">></span>{{ project.title }}
                       </h3>
                       <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-mono border-l-2 border-gray-200 dark:border-gray-800 pl-3">
                           {{ project.description }}
                       </p>
                   </div>

                   <!-- Tech Stack aka "Loaded Modules" -->
                   <div class="space-y-3">
                       <div class="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                           <Icon name="heroicons-outline:cpu-chip" class="w-3 h-3" />
                           Loaded Modules
                       </div>
                       <div class="flex flex-wrap gap-1.5">
                           <span v-for="tech in project.stack" :key="tech" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-mono rounded border border-gray-200 dark:border-gray-700 group-hover:border-green-500/30 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                               {{ tech }}
                           </span>
                       </div>
                   </div>
               </div>
          </div>

          <!-- Footer Action Bar -->
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center group-hover:bg-green-50 dark:group-hover:bg-green-900/10 transition-colors">
              <div class="text-[10px] font-mono text-gray-400">
                  MEM: {{ Math.floor(Math.random() * 500) + 128 }}MB
              </div>
              <NuxtLink :to="project.link || project.path" target="_blank" class="inline-flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 border border-gray-200 dark:border-gray-700 rounded text-xs font-mono font-bold transition-all text-gray-700 dark:text-gray-300">
                  <span>INIT_SEQUENCE</span>
                  <Icon name="heroicons-outline:command-line" class="w-3 h-3" />
              </NuxtLink>
          </div>
       </div>
  </div>
</template>