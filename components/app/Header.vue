<template>
  <header class="bg-white/80 dark:bg-[#0c0c0c]/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 font-mono">
    <div class="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      
      <!-- Terminal Logo -->
      <NuxtLink to="/" class="group flex items-center text-lg md:text-xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
         <span class="text-blue-500 mr-2 group-hover:animate-pulse">➜</span> 
         <span class="text-gray-500 dark:text-gray-400">~</span>
         <span class="text-gray-300 dark:text-gray-600 mx-0.5">/</span>
         <span class="group-hover:underline decoration-2 underline-offset-4 decoration-blue-500 transition-all">kriuchkov</span>
         <span class="w-2.5 h-5 bg-blue-500 ml-1 animate-pulse hidden group-hover:block"></span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-1">
        <NuxtLink to="/" class="group px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
          <span class="text-gray-300 dark:text-gray-600 group-hover:text-gray-400">./</span>home
        </NuxtLink>

        <NuxtLink to="/projects" class="group px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
          <span class="text-gray-300 dark:text-gray-600 group-hover:text-blue-400/50">./</span>projects
        </NuxtLink>

        <NuxtLink to="/blog" class="group px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
          <span class="text-gray-300 dark:text-gray-600 group-hover:text-gray-400">./</span>blog
        </NuxtLink>

        <NuxtLink to="/ai" class="group px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
           <span class="text-gray-300 dark:text-gray-600 group-hover:text-purple-400/50">./</span>ai
        </NuxtLink>

        <NuxtLink to="/academy" class="group px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all">
           <span class="text-gray-300 dark:text-gray-600 group-hover:text-teal-400/50">./</span>academy
        </NuxtLink>

        <div class="pl-4 ml-4 border-l border-gray-200 dark:border-gray-800 flex items-center">
           <UiThemeToggle />
        </div>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-4 md:hidden">
        <UiThemeToggle />
        <button class="md:hidden text-gray-900 dark:text-gray-100 p-2" @click="mobileMenuOpen = !mobileMenuOpen">
          <Icon :name="mobileMenuOpen ? 'heroicons-outline:x-mark' : 'heroicons-outline:bars-3-bottom-right'" class="w-6 h-6" />
        </button>
    </div>
  </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] p-4 font-mono">
      <nav class="flex flex-col space-y-2">
        <NuxtLink to="/" class="block px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5" @click="mobileMenuOpen = false">
          <span class="text-blue-500 mr-2">➜</span> cd /home
        </NuxtLink>
        <NuxtLink to="/projects" class="block px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400" @click="mobileMenuOpen = false">
          <span class="text-blue-500 mr-2">➜</span> cd /projects
        </NuxtLink>
        <NuxtLink to="/blog" class="block px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5" @click="mobileMenuOpen = false">
          <span class="text-blue-500 mr-2">➜</span> cd /blog
        </NuxtLink>
        <NuxtLink to="/ai" class="block px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400" @click="mobileMenuOpen = false">
          <span class="text-blue-500 mr-2">➜</span> cd /ai
        </NuxtLink>
        <NuxtLink to="/academy" class="block px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/10 hover:text-teal-600 dark:hover:text-teal-400" @click="mobileMenuOpen = false">
          <span class="text-blue-500 mr-2">➜</span> cd /academy
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>
