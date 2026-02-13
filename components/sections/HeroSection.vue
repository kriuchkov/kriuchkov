<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <section class="relative pt-8">
    <div class="flex flex-col-reverse md:flex-row items-center md:items-start gap-12">
      <!-- Info Column -->
      <div class="flex-1 space-y-6">

        <!-- Terminal Command -->
        <div class="flex items-center space-x-2 font-mono text-sm select-none">
          <span class="text-green-500 font-bold">➜</span>
          <span class="text-blue-500 font-bold">~</span>
          <span class="text-gray-500 typing-effect">whoami</span>
        </div>

        <!-- Name and Title -->
        <div>
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
            {{ appConfig.profile.name }}
          </h1>
          <div class="inline-flex items-center px-4 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-mono text-sm border border-gray-200 dark:border-gray-700/50">
             <span class="text-purple-600 dark:text-purple-400 mr-2">const</span> 
             currentRole = 
             <span class="text-green-600 dark:text-green-400 ml-2">"{{ appConfig.profile.title }}"</span>;
          </div>
        </div>

        <div class="prose prose-lg text-gray-600 dark:text-gray-400 leading-relaxed dark:prose-invert max-w-none pl-4 border-l-2 border-gray-100 dark:border-gray-800">
           <p v-html="appConfig.profile.description"></p>
        </div>
        
        <!-- Socials -->
        <div class="pt-2">
            <div class="font-mono text-xs text-gray-400 mb-4 flex items-center gap-2">
                <span class="text-gray-300 dark:text-gray-600">//</span> 
                connect with me
                <div class="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-2"></div>
            </div>
            <UiSocialLinks class="md:justify-start" /> 
        </div>
      </div>
      
      <!-- Avatar Column -->
      <div class="relative shrink-0 group">
        <!-- Abstract decorative blob -->
        <div class="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full opacity-30 blur-xl dark:opacity-40 group-hover:opacity-50 transition-opacity duration-1000"></div>
        
        <div class="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white dark:border-[#0c0c0c] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
          <NuxtImg 
            :src="appConfig.profile.avatar" 
            :alt="appConfig.profile.name" 
            class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
          />
        </div>
        
        <!-- start: status Badge -->
        <div class="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full px-3 py-1 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-2 transform transition-transform group-hover:translate-y-1">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono">Online</span>
        </div>
        <!-- end: status Badge -->
      </div>

    </div>
  </section>
</template>
