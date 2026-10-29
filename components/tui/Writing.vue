<script setup lang="ts">
const props = defineProps<{ section: 'blog' | 'ai' }>()

const route = useRoute()
const router = useRouter()
const ready = useHydratedFlag()
const copy = useTuiCopy()

type Source = 'all' | 'posts' | 'ai'

const TAG_ORDER = ['golang', 'architecture', 'design', 'tools', 'ai']

const { data } = await useAsyncData('writing-all', async () => {
  const [posts, notes] = await Promise.all([
    queryCollection('blog').order('date', 'DESC').select('title', 'path', 'date', 'description', 'tags', 'externalUrl').all(),
    queryCollection('ai').order('date', 'DESC').select('title', 'path', 'date', 'description', 'tags').all()
  ])
  return { posts, notes }
})

const items = computed(() => [
  ...(data.value?.posts || []).map(p => ({
    id: p.path,
    src: 'posts' as const,
    date: p.date,
    tags: p.tags || [],
    tag: firstTag(p.tags),
    title: p.title,
    description: p.description,
    to: p.externalUrl || p.path,
    external: !!p.externalUrl
  })),
  ...(data.value?.notes || []).map(n => ({
    id: n.path,
    src: 'ai' as const,
    date: n.date || '',
    tags: n.tags || ['ai'],
    tag: firstTag(n.tags, 'ai'),
    title: n.title,
    description: n.description,
    to: n.path,
    external: false
  }))
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)))

const src = computed<Source>(() => {
  if (props.section === 'ai') return 'ai'
  return ready.value && queryString(route.query.src) === 'posts' ? 'posts' : 'all'
})
const inSource = computed(() => items.value.filter(i => src.value === 'all' || i.src === src.value))

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const item of inSource.value) for (const t of item.tags) counts.set(t, (counts.get(t) || 0) + 1)
  const rank = (t: string) => (TAG_ORDER.indexOf(t) + 1) || 99
  return [...counts.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([id, count]) => ({ id, count }))
})

const tag = computed(() => {
  const wanted = ready.value ? queryString(route.query.tag) : undefined
  return wanted && tags.value.some(t => t.id === wanted) ? wanted : 'all'
})

const list = computed(() => inSource.value.filter(i => tag.value === 'all' || i.tags.includes(tag.value)))

const selectedId = ref<string | null>(null)
const current = computed(() => list.value.find(i => i.id === selectedId.value) || list.value[0])
const pos = computed(() => current.value ? list.value.indexOf(current.value) + 1 : 0)

const groups = computed(() => {
  const years: { year: string, items: typeof list.value }[] = []
  for (const item of list.value) {
    const year = item.date.slice(0, 4) || 'undated'
    let group = years.find(g => g.year === year)
    if (!group) {
      group = { year, items: [] }
      years.push(group)
    }
    group.items.push(item)
  }
  return years
})

const tagQuery = computed(() => (tag.value === 'all' ? {} : { tag: tag.value }))
const sources = computed(() => [
  { id: 'all', label: 'all', count: items.value.length, to: { path: '/blog', query: tagQuery.value } },
  { id: 'posts', label: 'posts', count: items.value.filter(i => i.src === 'posts').length, to: { path: '/blog', query: { ...tagQuery.value, src: 'posts' } } },
  { id: 'ai', label: 'ai notes', count: items.value.filter(i => i.src === 'ai').length, to: { path: '/ai', query: tagQuery.value } }
])

function setTag(id: string) {
  const query: Record<string, string> = {}
  if (src.value === 'posts') query.src = 'posts'
  if (id !== 'all') query.tag = id
  router.replace({ query })
}

const listTitle = computed(() => (src.value === 'ai' ? 'ai notes' : src.value === 'posts' ? 'posts' : 'writing'))
const filterPane = ref<HTMLElement | null>(null)

function step(delta: number) {
  const n = list.value.length
  if (!n) return
  const next = list.value[(pos.value - 1 + delta + n) % n]
  if (next) {
    selectedId.value = next.id
    nextTick(() => document.getElementById(`w-${next.id}`)?.scrollIntoView({ block: 'nearest' }))
  }
}

function openCurrent() {
  const item = current.value
  if (!item) return
  if (item.external) window.open(item.to, '_blank', 'noopener')
  else navigateTo(item.to)
}

const linkOf = (to: string) => (/^https?:\/\//.test(to) ? to : `${window.location.origin}${to}`)

useHotkeys({
  j: () => step(1),
  k: () => step(-1),
  gg: () => { selectedId.value = list.value[0]?.id ?? null },
  G: () => { selectedId.value = list.value[list.value.length - 1]?.id ?? null },
  Enter: openCurrent,
  y: () => { if (current.value) copy(linkOf(current.value.to), 'copied link') },
  f: () => { filterPane.value?.querySelector<HTMLElement>('a, button')?.focus() },
  Escape: () => {
    if (tag.value === 'all' && src.value !== 'posts') return false
    if (props.section === 'ai') router.replace({ query: {} })
    else navigateTo('/blog')
  }
})

useStatusLine(() => ({
  path: `~/writing${src.value === 'all' ? '' : `/${src.value}`}${tag.value === 'all' ? '' : ` #${tag.value}`}`,
  hints: [
    { key: 'j/k', label: 'move' },
    { key: 'enter', label: 'read' },
    { key: 'f', label: 'filter' },
    { key: 'esc', label: 'clear' }
  ],
  right: `${pos.value}/${list.value.length}`
}))
</script>

<template>
  <div class="tui-grid">
    <TuiPane title="filter" class="tui-writing__filters" list>
      <div ref="filterPane" class="tui-filterpane">
        <div role="group" aria-label="Source" class="tui-filterpane__group">
          <p class="tui-filterpane__label">source</p>
          <NuxtLink
            v-for="s in sources"
            :key="s.id"
            :to="s.to"
            class="tui-item tui-item--filter"
            :class="{ 'is-selected': s.id === src }"
            :aria-current="s.id === src ? 'true' : undefined"
          >
            <span>{{ s.label }}</span><span class="tui-chip__count">{{ s.count }}</span>
          </NuxtLink>
        </div>
        <div role="group" aria-label="Tag" class="tui-filterpane__group">
          <p class="tui-filterpane__label">tag</p>
          <button
            type="button"
            class="tui-item tui-item--filter"
            :class="{ 'is-selected': tag === 'all' }"
            :aria-pressed="tag === 'all'"
            @click="setTag('all')"
          >
            <span>all</span><span class="tui-chip__count">{{ inSource.length }}</span>
          </button>
          <button
            v-for="t in tags"
            :key="t.id"
            type="button"
            class="tui-item tui-item--filter"
            :class="{ 'is-selected': tag === t.id }"
            :aria-pressed="tag === t.id"
            @click="setTag(t.id)"
          >
            <span>#{{ t.id }}</span><span class="tui-chip__count">{{ t.count }}</span>
          </button>
        </div>
      </div>
    </TuiPane>

    <TuiPane :title="listTitle" :meta="`(${list.length})`" heading="h1" list focused class="tui-writing__list">
      <template v-if="list.length">
        <div v-for="group in groups" :key="group.year" class="tui-yeargroup">
          <p class="tui-yeargroup__label">{{ group.year }}</p>
          <ul class="tui-list">
            <li v-for="item in group.items" :key="item.id">
              <NuxtLink
                :id="`w-${item.id}`"
                :to="item.to"
                :target="item.external ? '_blank' : undefined"
                class="tui-item tui-item--post"
                :class="{ 'is-selected': item === current }"
                @mouseenter="selectedId = item.id"
                @focus="selectedId = item.id"
              >
                <span class="tui-muted tui-item__date">{{ item.date.slice(5) }}</span>
                <span class="tui-item__grow tui-strong">{{ item.title }}</span>
                <span class="tui-muted tui-nowrap tui-item__tag">#{{ item.tag }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </template>
      <div v-else class="tui-empty">
        <p class="tui-strong">No matches for this filter.</p>
        <NuxtLink :to="section === 'ai' ? '/ai' : '/blog'" class="tui-btn"><span class="tui-key">esc</span> clear filters</NuxtLink>
      </div>
    </TuiPane>

    <TuiPane title="preview" class="tui-writing__preview">
      <template v-if="current">
        <p class="tui-muted tui-small">{{ current.date }} · #{{ current.tag }} · {{ current.src === 'ai' ? 'ai notes' : 'posts' }}</p>
        <h2 class="tui-preview__title">{{ current.title }}</h2>
        <p class="tui-read">{{ current.description }}</p>
        <div class="tui-actions">
          <NuxtLink :to="current.to" :target="current.external ? '_blank' : undefined" class="tui-btn tui-btn--primary"><span>enter</span>read</NuxtLink>
          <button type="button" class="tui-btn" @click="copy(linkOf(current.to), 'copied link')"><span class="tui-key">y</span>copy link</button>
        </div>
      </template>
      <p v-else class="tui-muted">Nothing selected.</p>
    </TuiPane>
  </div>
</template>
