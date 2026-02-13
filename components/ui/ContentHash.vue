<script setup lang="ts">
const props = withDefaults(defineProps<{
  content?: string
  algorithm?: 'SHA-256' | 'SHA-1'
  truncate?: number
}>(), {
  algorithm: 'SHA-256',
  truncate: 16
})

const hash = ref('')

// Simple FNV-1a implementation for SSR/fallback
const fnv1a = (str: string) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

// Compute hash
const computeHash = async (text: string) => {
  if (!text) return ''
  
  // SSR or no crypto support - fallback to FNV-1a
  if (import.meta.server || !window.crypto || !window.crypto.subtle) {
    return fnv1a(text)
  }

  try {
    const msgBuffer = new TextEncoder().encode(text)
    const hashBuffer = await window.crypto.subtle.digest(props.algorithm, msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return props.truncate ? hashHex.substring(0, props.truncate) : hashHex
  } catch (e) {
    return fnv1a(text)
  }
}

watch(() => props.content, async (newContent) => {
  if (newContent) {
    hash.value = await computeHash(newContent)
  }
}, { immediate: true })
</script>

<template>
  <span :title="content ? 'Hash of content' : ''">
    {{ hash || '...' }}
  </span>
</template>
