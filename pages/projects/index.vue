<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const ready = useHydratedFlag()
const copy = useTuiCopy()

useHead({
  title: 'Projects',
  meta: [{ name: 'description', content: 'Open-source tools by Nikita Kriuchkov: terminal apps, macOS utilities and backend infrastructure.' }]
})

const { data } = await useAsyncData('projects-all', () => queryCollection('projects').order('sort', 'ASC').all())

const all = computed(() => (data.value || []).map(p => ({
  id: stemOf(p.path),
  title: p.title,
  lang: langOf(p.stack),
  stack: stackLine(p.stack),
  stackFull: stackLine(p.stack, 99),
  license: p.license || '',
  link: p.link || '',
  image: p.image || '',
  description: p.description || '',
  features: p.features || [],
  install: p.install || (p.link ? `git clone ${p.link}` : '')
})))

const filters = computed(() => {
  const langs = [...new Set(all.value.map(p => p.lang))]
  return [
    { id: 'all', count: all.value.length },
    ...langs.map(lang => ({ id: lang, count: all.value.filter(p => p.lang === lang).length }))
  ]
})

const filter = computed(() => {
  const wanted = ready.value ? queryString(route.query.lang) : undefined
  return wanted && filters.value.some(f => f.id === wanted) ? wanted : 'all'
})
const list = computed(() => filter.value === 'all' ? all.value : all.value.filter(p => p.lang === filter.value))
const current = computed(() => {
  const wanted = ready.value ? queryString(route.query.p) : undefined
  return list.value.find(p => p.id === wanted) || list.value[0]
})
const pos = computed(() => current.value ? list.value.indexOf(current.value) + 1 : 0)

const filterGroup = ref<HTMLElement | null>(null)

function setQuery(next: { lang?: string, p?: string }) {
  const query: Record<string, string> = {}
  const lang = next.lang ?? queryString(route.query.lang)
  const p = next.p ?? queryString(route.query.p)
  if (lang && lang !== 'all') query.lang = lang
  if (p) query.p = p
  router.replace({ query })
}

function select(id: string, reveal = false) {
  setQuery({ p: id })
  if (reveal && window.matchMedia('(max-width: 1099px)').matches) {
    nextTick(() => document.getElementById('project-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

function step(delta: number) {
  const n = list.value.length
  if (!n) return
  const next = list.value[(pos.value - 1 + delta + n) % n]
  if (next) select(next.id)
}

const openUrl = (url: string) => { if (url) window.open(url, '_blank', 'noopener') }

useHotkeys({
  j: () => step(1),
  k: () => step(-1),
  gg: () => { const first = list.value[0]; if (first) select(first.id) },
  G: () => { const last = list.value[list.value.length - 1]; if (last) select(last.id) },
  o: () => openUrl(current.value?.link || ''),
  r: () => openUrl(current.value?.link ? `${current.value.link}#readme` : ''),
  y: () => { if (current.value?.install) copy(current.value.install, 'copied install command') },
  f: () => { filterGroup.value?.querySelector('button')?.focus() },
  Escape: () => {
    if (filter.value !== 'all') setQuery({ lang: 'all' })
    else navigateTo('/')
  }
})

useStatusLine(() => ({
  path: `~/projects/${current.value?.id || ''}`,
  hints: [
    { key: 'j/k', label: 'move' },
    { key: 'o', label: 'open repo' },
    { key: 'y', label: 'copy install' },
    { key: 'esc', label: 'back' }
  ],
  right: `${pos.value}/${list.value.length}`
}))
</script>

<template>
  <div class="tui-grid">
    <TuiPane title="projects" :meta="`(${all.length})`" heading="h1" list focused class="tui-projects__list">
      <div ref="filterGroup" role="group" aria-label="Filter by language" class="tui-filters">
        <span class="tui-muted">filter</span>
        <button
          v-for="f in filters"
          :key="f.id"
          type="button"
          class="tui-chip"
          :class="{ 'is-active': f.id === filter }"
          :aria-pressed="f.id === filter"
          @click="setQuery({ lang: f.id })"
        >
          {{ f.id }} <span class="tui-chip__count">{{ f.count }}</span>
        </button>
      </div>
      <div class="tui-colhead" aria-hidden="true">
        <span class="tui-item__marker" />
        <span class="tui-item__name">NAME</span>
        <span class="tui-item__grow">STACK</span>
        <span>LICENSE</span>
      </div>
      <ul class="tui-list">
        <li v-for="p in list" :key="p.id">
          <button
            type="button"
            class="tui-item tui-item--tall tui-item--project"
            :class="{ 'is-selected': p === current }"
            :aria-pressed="p === current"
            @click="select(p.id, true)"
          >
            <span class="tui-item__marker" aria-hidden="true">{{ p === current ? '▸' : '' }}</span>
            <span class="tui-item__name tui-strong">{{ p.id }}</span>
            <span class="tui-item__grow tui-soft tui-ellipsis">{{ p.stack }}</span>
            <span class="tui-muted">{{ p.license }}</span>
          </button>
        </li>
      </ul>
      <p class="tui-pane__foot tui-muted">
        Click a row or use <span class="tui-key">j/k</span>. <span class="tui-key">o</span> opens the repo.
      </p>
    </TuiPane>

    <TuiPane v-if="current" id="project-details" title="details" :meta="current.id" class="tui-projects__details">
      <div class="tui-details__head">
        <h2 class="tui-details__name">{{ current.id }}</h2>
        <p class="tui-muted">{{ current.license }} · {{ current.stackFull }}</p>
      </div>
      <img :src="current.image" :alt="`${current.title} screenshot`" class="tui-shot tui-shot--wide" loading="lazy">
      <p class="tui-read">{{ current.description }}</p>
      <div v-if="current.features.length" class="tui-features">
        <p class="tui-muted tui-small">features</p>
        <ul class="tui-list tui-features__list">
          <li v-for="feature in current.features" :key="feature">
            <span class="tui-accent" aria-hidden="true">+</span><span>{{ feature }}</span>
          </li>
        </ul>
      </div>
      <figure v-if="current.install" class="tui-code">
        <figcaption class="tui-code__label">
          <span>shell</span>
          <span aria-hidden="true">·</span>
          <button type="button" class="tui-code__copy" @click="copy(current.install, 'copied install command')">
            <span class="tui-key">y</span> copy
          </button>
        </figcaption>
        <pre><span class="tui-accent" aria-hidden="true">$ </span>{{ current.install }}</pre>
      </figure>
      <div class="tui-actions">
        <a :href="current.link" target="_blank" rel="noopener noreferrer" class="tui-btn tui-btn--primary"><span>o</span>open repo</a>
        <a :href="`${current.link}#readme`" target="_blank" rel="noopener noreferrer" class="tui-btn"><span class="tui-key">r</span>readme</a>
      </div>
    </TuiPane>
  </div>
</template>
