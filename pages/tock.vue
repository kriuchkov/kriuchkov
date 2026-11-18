<script setup lang="ts">
// The demo is tock's demo/demo_svg.sh output (assets/demo_site.svg in the tock repo). It is inlined,
// so the page's font applies and the address drives it: /tock#rem opens on the reminders.
import demoSvg from '~/assets/demos/tock.svg?raw'

const route = useRoute()
const ready = useHydratedFlag()
const copy = useTuiCopy()

const REPO = 'https://github.com/kriuchkov/tock'
const DOCS = `${REPO}/blob/master/docs`

useHead({
  title: 'tock',
  meta: [{
    name: 'description',
    content: 'tock: a time tracker that lives in your terminal. A plaintext log, a keyboard calendar, reminders and a local MCP server for AI clients.'
  }]
})

const installs = [
  { id: 'brew', label: 'brew', cmd: 'brew install tock' },
  { id: 'tap', label: 'brew tap', cmd: 'brew install kriuchkov/tap/tock' },
  { id: 'go', label: 'go', cmd: 'go install github.com/kriuchkov/tock/cmd/tock@latest' },
  { id: 'script', label: 'script', cmd: 'curl -sS https://raw.githubusercontent.com/kriuchkov/tock/master/install.sh | sh' }
]
const method = ref('brew')
const install = computed(() => installs.find(m => m.id === method.value) ?? installs[0]!)

const commands = [
  { cmd: 'tock start -p Backend -d "API implementation"', note: 'stops what runs' },
  { cmd: 'tock add -p Meeting -d "Daily Standup" -s 10:00 -e 10:15' },
  { cmd: 'tock stop' },
  { cmd: 'tock report --week' },
  { cmd: 'tock continue', note: 'the last activity again' },
  { cmd: 'tock calendar', note: 'the TUI above' }
]

// Screens of the demo by the tab their name starts with: cal, cal-prev, rem-week, ...
const captions: Record<string, string> = {
  cal: 'the calendar: today, reminders and the week',
  rem: 'reminders, overdue first',
  list: 'the day\'s activities',
  ana: 'how you really work'
}
const screen = computed(() => (ready.value ? route.hash.slice(1) : ''))
const demoMeta = computed(() => {
  const caption = captions[screen.value.split('-')[0] || '']
  return caption ? `#${screen.value} · ${caption}` : 'the tour'
})

// The demo shows the screen the address names through CSS :target. Hydration sets the demo's
// innerHTML again and the router rewrites the address while it starts, so the browser can lose
// that target on the way. Navigating to the same fragment again restores it, without a reload or
// a new history entry.
const router = useRouter()
function showAddressedScreen() {
  const id = decodeURIComponent(location.hash.slice(1))
  if (id && document.getElementById(id) && document.querySelector(':target')?.id !== id) location.replace(location.href)
}
let stopAfterEach: (() => void) | undefined
onMounted(() => {
  showAddressedScreen()
  stopAfterEach = router.afterEach(() => nextTick(showAddressedScreen))
})
onBeforeUnmount(() => stopAfterEach?.())

const openUrl = (url: string) => { window.open(url, '_blank', 'noopener') }

useHotkeys({
  y: () => { copy(install.value.cmd, 'copied install command') },
  o: () => openUrl(REPO),
  d: () => openUrl(`${DOCS}/commands.md`),
  Escape: () => { navigateTo('/projects?p=tock') }
})

useStatusLine(() => ({
  path: `~/tock${screen.value ? `#${screen.value}` : ''}`,
  hints: [
    { key: 'y', label: 'copy install' },
    { key: 'o', label: 'open repo' },
    { key: 'd', label: 'docs' },
    { key: 'esc', label: 'back' }
  ],
  right: 'GPL-3.0'
}))
</script>

<template>
  <div class="tui-landing">
    <nav class="tui-landing__crumbs tui-only-desktop" aria-label="Breadcrumb">
      <NuxtLink to="/projects?p=tock">projects</NuxtLink>
      <span class="tui-faint" aria-hidden="true">/</span>
      <span class="tui-strong" aria-current="page">tock</span>
    </nav>

    <TuiPane title="tock" meta="GPL-3.0" heading="div" focused class="tui-landing__hero">
      <div class="tui-landing__intro">
        <img src="/images/projects/logos/tock.svg" alt="" width="48" height="48" class="tui-landing__mark">
        <div class="tui-landing__lead">
          <h1 class="tui-landing__title">
            A time tracker that lives in your terminal<span class="tui-accent tui-cursor" aria-hidden="true">_</span>
          </h1>
          <p class="tui-soft">
            A plaintext log you can grep and keep in git, a keyboard calendar, reminders and a local MCP server for AI
            clients.
          </p>
          <div class="tui-landing__links">
            <a :href="REPO" target="_blank" rel="noopener noreferrer" class="tui-btn tui-btn--quiet"><span class="tui-key">o</span>github</a>
            <a :href="`${REPO}/releases`" target="_blank" rel="noopener noreferrer" class="tui-btn tui-btn--quiet">releases</a>
            <a :href="`${DOCS}/commands.md`" target="_blank" rel="noopener noreferrer" class="tui-btn tui-btn--quiet"><span class="tui-key">d</span>docs</a>
            <span class="tui-muted">Go · single binary</span>
          </div>
        </div>
      </div>

      <div class="tui-landing__install">
        <div role="group" aria-label="Install with" class="tui-landing__methods">
          <button
            v-for="m in installs"
            :key="m.id"
            type="button"
            class="tui-chip"
            :class="{ 'is-active': m.id === method }"
            :aria-pressed="m.id === method"
            @click="method = m.id"
          >
            {{ m.label }}
          </button>
        </div>
        <figure class="tui-code">
          <figcaption class="tui-code__label">
            <span>shell</span>
            <span aria-hidden="true">·</span>
            <button type="button" class="tui-code__copy" @click="copy(install.cmd, 'copied install command')">
              <span class="tui-key">y</span> copy
            </button>
          </figcaption>
          <pre><span class="tui-accent" aria-hidden="true">$ </span>{{ install.cmd }}</pre>
        </figure>
      </div>
    </TuiPane>

    <TuiPane id="demo" title="demo" :meta="demoMeta">
      <!-- eslint-disable-next-line vue/no-v-html -- tock's own demo, checked in -->
      <div class="tui-landing__demo" v-html="demoSvg" />
      <p class="tui-pane__foot tui-landing__foot tui-muted">
        <span>click a tab or an underlined key</span>
        <span><a href="#tour" class="tui-link">▶ play the tour</a> · recorded on sample data</span>
      </p>
    </TuiPane>

    <TuiPane title="quick start">
      <div class="tui-landing__cmds">
        <div v-for="c in commands" :key="c.cmd">
          <span class="tui-accent" aria-hidden="true">$ </span><span class="tui-strong">{{ c.cmd }}</span><span v-if="c.note" class="tui-muted">  # {{ c.note }}</span>
        </div>
      </div>
      <p class="tui-pane__foot tui-muted">
        every command and flag: <a :href="`${DOCS}/commands.md`" target="_blank" rel="noopener noreferrer" class="tui-link">docs/commands.md</a>
      </p>
    </TuiPane>

    <div class="tui-landing__grid">
      <TuiPane title="plaintext" meta="default">
        <p class="tui-soft">One line per activity, compatible with Bartib. Fix it in any editor, grep it, keep it in git.</p>
        <pre class="tui-landing__snippet">2026-11-18 10:00 - 2026-11-18 12:45 | Project Alpha | Implementation
2026-11-18 15:05 | Project Alpha | Release notes</pre>
      </TuiPane>

      <TuiPane title="backends" meta="4">
        <dl class="tui-landing__table">
          <dt class="tui-strong">file</dt><dd class="tui-soft">Bartib plaintext</dd>
          <dt class="tui-strong">todotxt</dt><dd class="tui-soft">todo.txt-compatible lines</dd>
          <dt class="tui-strong">timewarrior</dt><dd class="tui-soft">reads and writes its data files</dd>
          <dt class="tui-strong">sqlite</dt><dd class="tui-soft">one database file</dd>
        </dl>
        <p class="tui-muted tui-small">notes and tags on every backend</p>
      </TuiPane>

      <TuiPane title="reminders">
        <p class="tui-soft">One-off or repeating, on a day or at a time. They show in the calendar and the menu bar and start tracking in one keypress.</p>
        <pre class="tui-landing__snippet"><span class="tui-accent">$</span> tock remind add "Team sync" -p Work \
    --at 17:30 --every weekly:mon,thu</pre>
      </TuiPane>

      <TuiPane title="menu bar" meta="macOS">
        <p class="tui-soft">A live timer with start and stop, today's reminders and a banner when one is due.</p>
        <pre class="tui-landing__snippet"><span class="tui-accent">$</span> tock tray install   <span class="tui-muted"># always on, from login</span></pre>
      </TuiPane>

      <TuiPane title="reports">
        <p class="tui-soft">A day, a week, a month or a year by project. Export as text, CSV or JSON, write an .ics file or sync to the macOS calendar.</p>
        <pre class="tui-landing__snippet"><span class="tui-accent">$</span> tock list weekly
<span class="tui-accent">$</span> tock report --week</pre>
      </TuiPane>

      <TuiPane title="analyze">
        <p class="tui-soft">Deep work score, chronotype and peak hour, context switching and session lengths, from the same log.</p>
        <pre class="tui-landing__snippet"><span class="tui-accent">$</span> tock analyze</pre>
      </TuiPane>
    </div>

    <TuiPane id="mcp" title="mcp server" meta="off by default" tone="key" class="tui-landing__mcp">
      <div class="tui-landing__mcp-text">
        <p class="tui-landing__claim">Ask Claude Code or opencode about your time.</p>
        <p class="tui-soft">
          What did I do yesterday? Draft my standup. Start the review I paused on Monday. The server runs on your machine
          over stdio, uses the same file and rules as the CLI, and sends nothing anywhere by itself.
        </p>
        <pre class="tui-landing__snippet"><span class="tui-muted"># ~/.config/tock/tock.yaml</span>
<span class="tui-landing__k">mcp</span>:
  <span class="tui-landing__k">enabled</span>: <span class="tui-landing__v">true</span></pre>
        <pre class="tui-landing__snippet"><span class="tui-accent">$</span> tock mcp install --client claude-code   <span class="tui-muted"># or opencode</span></pre>
      </div>
      <dl class="tui-landing__table tui-landing__tools tui-small">
        <dt class="tui-muted">read</dt><dd>current · list · report · recent · analyze · reminders</dd>
        <dt class="tui-muted">write</dt><dd>start · stop · continue · add · edit · note · tag · remind_add · remind_done · remind_snooze · remind_track</dd>
        <dt class="tui-landing__danger">asks first</dt><dd>remove · remind_remove</dd>
        <dt class="tui-muted">prompts</dt><dd>standup · weekly-review</dd>
        <dt /><dd><a :href="`${DOCS}/mcp.md`" target="_blank" rel="noopener noreferrer" class="tui-link">docs/mcp.md</a></dd>
      </dl>
    </TuiPane>
  </div>
</template>
