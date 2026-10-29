<script setup lang="ts">
const overlay = useTuiOverlay()
const letters = useTuiLetters()
const dialog = ref<HTMLElement | null>(null)
let returnFocus: HTMLElement | null = null

interface Row { keys: string[], range?: boolean, label: string }

const GROUPS: { title: string, rows: Row[] }[] = [
  {
    title: 'global',
    rows: [
      { keys: ['1', '4'], range: true, label: 'switch tab' },
      { keys: ['/'], label: 'search everything' },
      { keys: ['?'], label: 'this panel' },
      { keys: ['t'], label: 'dark / light' },
      { keys: ['esc'], label: 'close, go back' }
    ]
  },
  {
    title: 'lists',
    rows: [
      { keys: ['j', 'k'], label: 'move down / up' },
      { keys: ['g g', 'G'], label: 'first / last' },
      { keys: ['enter'], label: 'open' },
      { keys: ['o'], label: 'open repo' },
      { keys: ['f'], label: 'focus filters' },
      { keys: ['y'], label: 'copy install or link' }
    ]
  },
  {
    title: 'reading',
    rows: [
      { keys: ['j', 'k'], label: 'scroll' },
      { keys: ['[', ']'], label: 'previous / next post' },
      { keys: ['o'], label: 'jump to outline' },
      { keys: ['y'], label: 'copy link' },
      { keys: ['q'], label: 'back to list' }
    ]
  }
]

function close() {
  overlay.value = 'none'
}

useHotkeys({ 'Escape': close, '?': close }, { priority: 100, modal: true })

onMounted(() => {
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  dialog.value?.focus()
})
onBeforeUnmount(() => { returnFocus?.focus() })
</script>

<template>
  <div class="tui-overlay" @click.self="close">
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tui-keys-title"
      tabindex="-1"
      class="tui-dialog tui-dialog--keys"
    >
      <h2 id="tui-keys-title" class="tui-pane__title tui-dialog__title">keys</h2>
      <button type="button" class="tui-btn tui-btn--quiet tui-dialog__close" @click="close">
        <span class="tui-key">esc</span>close
      </button>
      <div class="tui-keys">
        <div v-for="group in GROUPS" :key="group.title" class="tui-keys__group">
          <h3 class="tui-keys__title">{{ group.title }}</h3>
          <div v-for="row in group.rows" :key="row.label" class="tui-keys__row">
            <span class="tui-keys__caps">
              <template v-for="(k, i) in row.keys" :key="k">
                <span v-if="row.range && i > 0" class="tui-muted" aria-hidden="true">–</span>
                <kbd class="tui-kbd">{{ k }}</kbd>
              </template>
            </span>
            <span>{{ row.label }}</span>
          </div>
        </div>
      </div>
      <div class="tui-keys__foot">
        <label class="tui-check">
          <input v-model="letters" type="checkbox">
          <span>single-letter shortcuts <strong :class="letters ? 'tui-accent' : 'tui-muted'">{{ letters ? 'on' : 'off' }}</strong></span>
        </label>
        <p class="tui-muted">Shortcuts pause while you type in a field. Every key has a clickable twin.</p>
      </div>
    </div>
  </div>
</template>
