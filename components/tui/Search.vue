<script setup lang="ts">
const overlay = useTuiOverlay()
const query = useTuiSearchQuery()
const { data: index } = useTuiIndex()

const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLElement | null>(null)
const active = ref(0)
let returnFocus: HTMLElement | null = null

const GROUPS: { kind: TuiKind, label: string }[] = [
  { kind: 'project', label: 'projects' },
  { kind: 'post', label: 'posts' },
  { kind: 'note', label: 'ai notes' }
]

const groups = computed(() => {
  const needle = query.value.trim().toLowerCase()
  let n = 0
  return GROUPS.map((group) => {
    const items = index.value
      .filter(e => e.kind === group.kind)
      .filter(e => !needle || [e.title, e.description, e.tags.join(' '), e.stack.join(' ')].join(' ').toLowerCase().includes(needle))
      .map((e) => {
        const at = needle ? e.title.toLowerCase().indexOf(needle) : -1
        return {
          ...e,
          n: n++,
          pre: at >= 0 ? e.title.slice(0, at) : e.title,
          mid: at >= 0 ? e.title.slice(at, at + needle.length) : '',
          post: at >= 0 ? e.title.slice(at + needle.length) : '',
          sub: e.kind === 'project' ? stackLine(e.stack, 3, ' · ') : `${e.date} #${firstTag(e.tags)}`
        }
      })
    return { ...group, items }
  }).filter(group => group.items.length > 0)
})

const flat = computed(() => groups.value.flatMap(group => group.items))

watch(query, () => { active.value = 0 })

function close() {
  overlay.value = 'none'
}

function open(i = active.value) {
  const item = flat.value[i]
  if (!item) return
  close()
  if (/^https?:\/\//.test(item.to)) window.open(item.to, '_blank', 'noopener')
  else navigateTo(item.to)
}

function move(to: number) {
  if (!flat.value.length) return
  active.value = Math.max(0, Math.min(flat.value.length - 1, to))
  nextTick(() => {
    list.value?.querySelector(`#tui-search-opt-${active.value}`)?.scrollIntoView({ block: 'nearest' })
  })
}

function nextGroup(dir: 1 | -1) {
  const starts = groups.value.map(group => group.items[0]?.n ?? 0)
  const current = starts.filter(s => s <= active.value).length - 1
  const target = starts[(current + dir + starts.length) % starts.length]
  if (target !== undefined) move(target)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(active.value + 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); move(active.value - 1) }
  else if (e.key === 'Enter') { e.preventDefault(); open() }
  else if (e.key === 'Tab') { e.preventDefault(); nextGroup(e.shiftKey ? -1 : 1) }
}

useHotkeys({ Escape: close }, { priority: 100, modal: true })

onMounted(() => {
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  input.value?.focus()
  input.value?.select()
})
onBeforeUnmount(() => { returnFocus?.focus() })
</script>

<template>
  <div class="tui-overlay" @click.self="close">
    <div role="dialog" aria-modal="true" aria-labelledby="tui-search-title" class="tui-dialog tui-dialog--search">
      <h2 id="tui-search-title" class="tui-pane__title tui-dialog__title">
        search <span class="tui-pane__meta">projects, posts, notes</span>
      </h2>
      <div class="tui-search__bar">
        <span class="tui-search__slash" aria-hidden="true">/</span>
        <input
          ref="input"
          v-model="query"
          type="text"
          class="tui-search__input"
          role="combobox"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls="tui-search-results"
          :aria-activedescendant="flat.length ? `tui-search-opt-${active}` : undefined"
          placeholder="type to search"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKeydown"
        >
        <button type="button" class="tui-btn tui-btn--quiet" @click="close">
          <span class="tui-key">esc</span>close
        </button>
      </div>

      <div id="tui-search-results" ref="list" role="listbox" aria-label="Results" class="tui-search__results">
        <div v-for="group in groups" :key="group.kind" role="group" :aria-label="group.label" class="tui-search__group">
          <p class="tui-search__label">{{ group.label }} <span>{{ group.items.length }}</span></p>
          <NuxtLink
            v-for="item in group.items"
            :id="`tui-search-opt-${item.n}`"
            :key="item.id"
            :to="item.to"
            role="option"
            :aria-selected="item.n === active"
            class="tui-search__item"
            :class="{ 'is-active': item.n === active }"
            :target="/^https?:/.test(item.to) ? '_blank' : undefined"
            @click="close"
            @mousemove="active = item.n"
          >
            <span class="tui-accent tui-search__marker" aria-hidden="true">{{ item.n === active ? '▸' : '' }}</span>
            <span class="tui-search__title tui-ellipsis">{{ item.pre }}<mark>{{ item.mid }}</mark>{{ item.post }}</span>
            <span class="tui-muted tui-search__sub">{{ item.sub }}</span>
          </NuxtLink>
        </div>
        <div v-if="!flat.length" class="tui-search__empty">
          <p class="tui-strong">Nothing matches “{{ query }}”.</p>
          <p class="tui-muted">Try a project name, a language like go or rust, or a topic like mcp.</p>
        </div>
      </div>

      <div class="tui-dialog__foot">
        <span class="tui-dialog__hints">
          <span><span class="tui-key">↑↓</span> move</span>
          <span><span class="tui-key">enter</span> open</span>
          <span><span class="tui-key">tab</span> next group</span>
        </span>
        <span>{{ flat.length }} results</span>
      </div>
    </div>
  </div>
</template>
