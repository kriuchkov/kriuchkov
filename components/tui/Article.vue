<script setup lang="ts">
import type { AiCollectionItem, BlogCollectionItem } from '@nuxt/content'

interface Sibling { title: string, path: string }
interface TocLink { id: string, text: string, children?: TocLink[] }

const props = defineProps<{
  doc: BlogCollectionItem | AiCollectionItem
  section: 'blog' | 'ai'
  siblings: Sibling[]
}>()

const copy = useTuiCopy()
const { data: index } = useTuiIndex()

const listPath = computed(() => (props.section === 'ai' ? '/ai' : '/blog'))
const listLabel = computed(() => (props.section === 'ai' ? 'all notes' : 'all posts'))
const fileName = computed(() => `${stemOf(props.doc.path)}.md`)
const tag = computed(() => firstTag(props.doc.tags, props.section === 'ai' ? 'ai' : 'notes'))
const words = computed(() => countWords(props.doc.body))
const minutes = computed(() => readingMinutes(words.value))
const source = computed(() => ('source' in props.doc ? props.doc.source : undefined))
const renderDoc = computed(() => withoutLeadingTitle(props.doc))

const at = computed(() => props.siblings.findIndex(s => s.path === props.doc.path))
const older = computed(() => (at.value >= 0 ? props.siblings[at.value + 1] : undefined))
const newer = computed(() => (at.value > 0 ? props.siblings[at.value - 1] : undefined))

const related = computed(() => index.value
  .filter(e => e.kind !== 'project' && e.to !== props.doc.path && e.tags.includes(tag.value))
  .slice(0, 3))

const outline = computed(() => {
  const links = ((props.doc.body as { toc?: { links?: TocLink[] } })?.toc?.links) || []
  const rows: { id: string, text: string, branch: string }[] = []
  for (const link of links) {
    rows.push({ id: link.id, text: link.text, branch: '' })
    const children = link.children || []
    children.forEach((child, i) => {
      rows.push({ id: child.id, text: child.text, branch: i === children.length - 1 ? '└─ ' : '├─ ' })
    })
  }
  return rows
})

const activeId = ref(outline.value[0]?.id || '')
const progress = ref(0)
const outlineNav = ref<HTMLElement | null>(null)

function onScroll() {
  const root = document.documentElement
  const max = root.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 100) : 100
  let current = outline.value[0]?.id || ''
  for (const row of outline.value) {
    const el = document.getElementById(row.id)
    if (!el) continue
    if (el.getBoundingClientRect().top < 140) current = row.id
    else break
  }
  activeId.value = current
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

const back = () => { navigateTo(listPath.value) }

useHotkeys({
  'j': () => window.scrollBy({ top: 120 }),
  'k': () => window.scrollBy({ top: -120 }),
  'gg': () => window.scrollTo({ top: 0 }),
  'G': () => window.scrollTo({ top: document.documentElement.scrollHeight }),
  '[': () => { if (older.value) navigateTo(older.value.path) },
  ']': () => { if (newer.value) navigateTo(newer.value.path) },
  'o': () => {
    const nav = outlineNav.value
    if (!nav || !nav.offsetParent) {
      const details = document.querySelector<HTMLDetailsElement>('.tui-outline-inline')
      if (details) {
        details.open = true
        details.querySelector<HTMLElement>('summary')?.focus()
      }
      return
    }
    const target = nav.querySelector<HTMLElement>('a[aria-current]') || nav.querySelector<HTMLElement>('a')
    target?.focus()
  },
  'y': () => copy(window.location.href.split('#')[0] || window.location.href, 'copied link'),
  'q': back,
  'Escape': back
})

useStatusLine(() => ({
  mode: 'READ',
  path: `~/${props.section === 'ai' ? 'ai' : 'writing'}/${fileName.value}`,
  hints: [
    { key: 'j/k', label: 'scroll' },
    { key: '[ ]', label: 'prev/next' },
    { key: 'o', label: 'outline' },
    { key: 'y', label: 'copy link' },
    { key: 'q', label: 'back' }
  ],
  progress: progress.value
}))
</script>

<template>
  <div class="tui-grid tui-article-grid">
    <aside class="tui-article__side" aria-label="About this post">
      <TuiPane v-if="outline.length" title="outline" meta="o" list class="tui-article__outline">
        <nav ref="outlineNav" aria-label="On this page" class="tui-outline">
          <a
            v-for="row in outline"
            :key="row.id"
            :href="`#${row.id}`"
            class="tui-outline__link"
            :class="{ 'is-active': row.id === activeId, 'is-child': row.branch }"
            :aria-current="row.id === activeId ? 'location' : undefined"
          ><span class="tui-outline__lead" :class="row.branch ? 'tui-faint' : 'tui-accent'" aria-hidden="true">{{ row.branch ? `  ${row.branch}` : (row.id === activeId ? '▸ ' : '  ') }}</span><span>{{ row.text }}</span></a>
        </nav>
      </TuiPane>

      <TuiPane title="meta">
        <dl class="tui-meta">
          <div v-if="doc.date">
            <dt>date</dt><dd>{{ doc.date }}</dd>
          </div>
          <div>
            <dt>tag</dt><dd><NuxtLink :to="{ path: listPath, query: { tag } }" class="tui-link">#{{ tag }}</NuxtLink></dd>
          </div>
          <div>
            <dt>length</dt><dd>{{ words }} words · {{ minutes }} min</dd>
          </div>
          <div v-if="source">
            <dt>source</dt><dd><a :href="source" target="_blank" rel="noopener noreferrer" class="tui-link">{{ hostOf(source) }}</a></dd>
          </div>
        </dl>
      </TuiPane>

      <TuiPane v-if="related.length" title="related" :meta="`#${tag}`" list>
        <ul class="tui-list">
          <li v-for="item in related" :key="item.id">
            <NuxtLink :to="item.to" class="tui-item tui-item--stack">
              <span class="tui-strong">{{ item.title }}</span>
              <span class="tui-muted">{{ item.date }}</span>
            </NuxtLink>
          </li>
        </ul>
      </TuiPane>
    </aside>

    <TuiPane :title="fileName" heading="div" focused class="tui-article__main">
      <article class="tui-article">
        <header class="tui-article__head">
          <p class="tui-muted tui-small tui-article__metaline">{{ doc.date }} · #{{ tag }} · {{ minutes }} min</p>
          <h1 class="tui-article__title"><span class="tui-accent" aria-hidden="true"># </span>{{ doc.title }}</h1>
          <p class="tui-article__lead">{{ doc.description }}</p>
        </header>

        <details v-if="outline.length" class="tui-outline-inline">
          <summary>outline <span class="tui-muted">{{ outline.length }} sections</span></summary>
          <nav aria-label="On this page" class="tui-outline">
            <a v-for="row in outline" :key="row.id" :href="`#${row.id}`" class="tui-outline__link" :class="{ 'is-child': row.branch }"><span class="tui-outline__lead tui-faint" aria-hidden="true">{{ row.branch ? `  ${row.branch}` : '  ' }}</span><span>{{ row.text }}</span></a>
          </nav>
        </details>

        <ContentRenderer :value="renderDoc" class="tui-prose" />

        <nav aria-label="More posts" class="tui-article__nav">
          <NuxtLink v-if="older" :to="older.path" class="tui-pager">
            <span class="tui-key" aria-hidden="true">[</span>
            <span class="tui-pager__text"><span class="tui-muted tui-small">previous</span>{{ older.title }}</span>
          </NuxtLink>
          <NuxtLink v-if="newer" :to="newer.path" class="tui-pager">
            <span class="tui-pager__text"><span class="tui-muted tui-small">next</span>{{ newer.title }}</span>
            <span class="tui-key" aria-hidden="true">]</span>
          </NuxtLink>
          <NuxtLink :to="listPath" class="tui-pager tui-pager--end">
            <span class="tui-pager__text"><span class="tui-muted tui-small">back to</span>{{ listLabel }}</span>
            <span class="tui-key" aria-hidden="true">q</span>
          </NuxtLink>
        </nav>
      </article>
    </TuiPane>
  </div>
</template>
