<script setup lang="ts">
import stats from '~/assets/stats.json'

const appConfig = useAppConfig()
const profile = appConfig.profile
const socials = appConfig.socials

useHead({
  title: `${profile.name} - ${profile.title}`,
  meta: [
    {
      name: 'description',
      content: profile.shortDescription || profile.description.replace(/<br><br>/g, ' ')
    },
    {
      name: 'keywords',
      content: appConfig.seo.keywords
    }
  ]
})

const { data } = await useAsyncData('home', async () => {
  const [projects, posts, notes] = await Promise.all([
    queryCollection('projects').order('sort', 'ASC').all(),
    queryCollection('blog').order('date', 'DESC').limit(5).all(),
    queryCollection('ai').order('date', 'DESC').limit(3).all()
  ])
  return { projects, posts, notes }
})

const { data: index } = useTuiIndex()
const counts = computed(() => ({
  projects: index.value.filter(e => e.kind === 'project').length,
  posts: index.value.filter(e => e.kind === 'post').length,
  notes: index.value.filter(e => e.kind === 'note').length
}))

const projects = computed(() => (data.value?.projects || []).map(p => ({
  id: stemOf(p.path),
  title: p.title,
  stack: stackLine(p.stack),
  license: p.license || '',
  link: p.link || '',
  image: p.image || '',
  description: p.description || ''
})))
const posts = computed(() => data.value?.posts || [])
const notes = computed(() => data.value?.notes || [])

const selected = ref(0)
const current = computed(() => projects.value[selected.value] || projects.value[0])

const nameLines = profile.name.split(' ')

const leaders = [
  { label: 'stars earned', value: String(stats.stars) },
  { label: 'pull requests', value: String(stats.pullRequests) },
  { label: 'commits, last year', value: String(stats.commits) },
  { label: 'contributed to', value: `${stats.contributedTo} repos` }
]

const languages = computed(() => {
  const top = stats.languages.slice(0, 3)
  const rest = Math.max(0, 100 - top.reduce((sum, l) => sum + l.percent, 0))
  return [...top, { name: 'other', percent: Math.round(rest * 10) / 10 }].map((l, i) => ({
    label: l.name.padEnd(8),
    percent: `${l.percent.toFixed(1)}%`,
    lead: i === 0,
    ...bar(l.percent, 18)
  }))
})

const openUrl = (url: string) => {
  if (url) window.open(url, url.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
}
const move = (step: number) => {
  const n = projects.value.length
  if (n) selected.value = (selected.value + step + n) % n
}

useHotkeys({
  j: () => move(1),
  k: () => move(-1),
  Enter: () => { if (current.value) navigateTo(`/projects?p=${current.value.id}`) },
  o: () => openUrl(current.value?.link || ''),
  g: () => openUrl(socials.github || ''),
  l: () => openUrl(socials.linkedin || ''),
  m: () => openUrl(socials.email ? `mailto:${socials.email}` : '')
})

useStatusLine(() => ({
  path: '~/home',
  hints: [
    { key: 'j/k', label: 'move' },
    { key: 'enter', label: 'open' },
    { key: 'o', label: 'repo' },
    { key: '?', label: 'all keys' }
  ],
  right: `${counts.value.projects} projects · ${counts.value.posts} posts · ${counts.value.notes} notes`
}))
</script>

<template>
  <div class="tui-grid">
    <div class="tui-col-side">
      <TuiPane title="whoami" class="tui-whoami">
        <h1 class="tui-whoami__name">
          <template v-for="(word, i) in nameLines" :key="word">
            <br v-if="i > 0">{{ word }}
          </template><span class="tui-accent tui-cursor" aria-hidden="true">▍</span>
        </h1>
        <p class="tui-accent">{{ profile.role }} · {{ profile.experience }}</p>
        <p class="tui-soft">{{ profile.bio }}</p>
        <p class="tui-muted">prev: {{ profile.previously.join(' · ') }}</p>
        <ul class="tui-list tui-contacts">
          <li v-if="socials.github">
            <a :href="socials.github" target="_blank" rel="noopener noreferrer" class="tui-contact"><span class="tui-key">[g]</span>github.com/{{ profile.handle }}</a>
          </li>
          <li v-if="socials.linkedin">
            <a :href="socials.linkedin" target="_blank" rel="noopener noreferrer" class="tui-contact"><span class="tui-key">[l]</span>linkedin.com/in/nkriuchkov</a>
          </li>
          <li v-if="socials.email">
            <a :href="`mailto:${socials.email}`" class="tui-contact"><span class="tui-key">[m]</span>{{ socials.email }}</a>
          </li>
        </ul>
      </TuiPane>

      <TuiPane title="gh stats" meta="github" class="tui-stats">
        <div v-for="row in leaders" :key="row.label" class="tui-leader">
          <span>{{ row.label }}</span>
          <span class="tui-leader__dots" aria-hidden="true" />
          <span class="tui-leader__value">{{ row.value }}</span>
        </div>
        <div class="tui-bars" role="list" aria-label="Most used languages">
          <div v-for="lang in languages" :key="lang.label" role="listitem">
            <span>{{ lang.label }}</span>
            <span aria-hidden="true"><span :class="lang.lead ? 'tui-accent' : 'tui-soft'">{{ lang.filled }}</span><span class="tui-faint">{{ lang.empty }}</span></span>
            {{ lang.percent }}
          </div>
        </div>
      </TuiPane>
    </div>

    <div class="tui-col-main">
      <div class="tui-split">
        <TuiPane title="projects" :meta="`(${projects.length})`" list focused class="tui-w3">
          <ul class="tui-list">
            <li v-for="(p, i) in projects" :key="p.id">
              <NuxtLink
                :to="`/projects?p=${p.id}`"
                class="tui-item tui-item--project"
                :class="{ 'is-selected': i === selected }"
                @mouseenter="selected = i"
                @focus="selected = i"
              >
                <span class="tui-item__marker" aria-hidden="true">{{ i === selected ? '▸' : '' }}</span>
                <span class="tui-item__name tui-strong">{{ p.id }}</span>
                <span class="tui-item__grow tui-soft tui-ellipsis">{{ p.stack }}</span>
                <span class="tui-muted">{{ p.license }}</span>
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink to="/projects" class="tui-more"><span class="tui-key">2</span>all projects</NuxtLink>
        </TuiPane>

        <TuiPane v-if="current" title="preview" :meta="current.id" class="tui-w2">
          <img :src="current.image" :alt="`${current.title} screenshot`" class="tui-shot" loading="lazy">
          <p class="tui-soft">{{ current.description }}</p>
          <div class="tui-actions">
            <a :href="current.link" target="_blank" rel="noopener noreferrer" class="tui-action"><span class="tui-key">[o]</span>open repo</a>
            <NuxtLink :to="`/projects?p=${current.id}`" class="tui-action"><span class="tui-key">[enter]</span>details</NuxtLink>
          </div>
        </TuiPane>
      </div>

      <div class="tui-split tui-split--stretch">
        <TuiPane title="writing" :meta="`(${counts.posts})`" list class="tui-w3">
          <ul class="tui-list">
            <li v-for="post in posts" :key="post.path">
              <NuxtLink :to="post.externalUrl || post.path" class="tui-item tui-item--wrap">
                <span class="tui-muted tui-nowrap">{{ post.date }}</span>
                <span class="tui-strong">{{ post.title }}</span>
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink to="/blog" class="tui-more"><span class="tui-key">3</span>all posts</NuxtLink>
        </TuiPane>

        <TuiPane title="ai notes" :meta="`(${counts.notes})`" list class="tui-w2">
          <ul class="tui-list">
            <li v-for="note in notes" :key="note.path">
              <NuxtLink :to="note.path" class="tui-item tui-item--stack">
                <span class="tui-strong">{{ note.title }}</span>
                <span class="tui-muted tui-ellipsis">{{ note.date }} · {{ note.description }}</span>
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink to="/ai" class="tui-more"><span class="tui-key">4</span>all notes</NuxtLink>
        </TuiPane>
      </div>
    </div>
  </div>
</template>
