<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div class="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 font-sans bg-white dark:bg-gray-900 transition-colors duration-300">
    <AppHeader />
    <main class="flex-grow pt-8 pb-16">
      <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
    <footer class="relative mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#050505] overflow-hidden font-mono">
      <!-- Cyberpunk Decorative Top Line -->
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      
      <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Column 1: Identity -->
          <div class="flex flex-col gap-3">
             <div class="flex items-center gap-2 text-gray-900 dark:text-white font-bold uppercase tracking-wider">
                <div class="p-1 px-2 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-500 font-black text-xs">
                    >_
                </div>
                <span>KRIUCKOV</span>
             </div>
             <p class="text-[10px] text-gray-500 dark:text-gray-500 uppercase tracking-widest leading-relaxed max-w-[15rem]">
                Full-Stack Architecture<br>
                Neural Networks<br>
                Digital Infrastructure
             </p>
          </div>

          <!-- Column 2: System Status -->
          <div class="flex flex-col justify-center items-start md:items-center py-4 md:py-0 border-y md:border-y-0 md:border-x border-gray-200 dark:border-gray-800/50">
             <div class="flex flex-col gap-1 w-full max-w-[12rem]">
                 <div class="flex justify-between text-[10px] uppercase text-gray-400">
                     <span>System Status</span>
                     <span class="text-emerald-500 animate-pulse">● Normal</span>
                 </div>
                 <!-- Fake Progress Bar -->
                 <div class="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                     <div class="h-full bg-emerald-500 w-3/4 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 </div>
                 <div class="flex justify-between text-[10px] uppercase text-gray-500 mt-1">
                     <span>Core</span>
                     <span>Operational</span>
                 </div>
             </div>
          </div>

          <!-- Column 3: Links & Copyright -->
          <div class="flex flex-col gap-4 md:items-end justify-between">
              <div class="flex gap-6 text-xs uppercase tracking-wider">
                  <a v-if="appConfig.socials.github" :href="appConfig.socials.github" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-cyan-500 transition-colors">Github</a>
                  <a v-if="appConfig.socials.linkedin" :href="appConfig.socials.linkedin" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-cyan-500 transition-colors">LinkedIn</a>
                  <a v-if="appConfig.socials.email" :href="`mailto:${appConfig.socials.email}`" class="text-gray-500 hover:text-cyan-500 transition-colors">Email</a>
              </div>
            
            <div class="text-right">
                <div class="text-[10px] text-gray-400 dark:text-gray-700 mb-1 font-mono">
                    ID: K-{{ new Date().getFullYear() }}-X
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-500">
                    &copy; {{ new Date().getFullYear() }} KRIUCKOV.COM
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Background Grid Decoration -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
    </footer>
  </div>
</template>
