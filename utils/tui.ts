/** Last path segment: /projects/herdr-scope -> herdr-scope */
export const stemOf = (path: string) => path.split('/').filter(Boolean).pop() || path

export const stackLine = (stack: string[] | undefined, max = 4, sep = ', ') =>
  (stack || []).slice(0, max).map(s => s.toLowerCase()).join(sep)

/** Main language of a project, used for the projects filter. */
export const langOf = (stack: string[] | undefined) => (stack?.[0] || 'other').toLowerCase()

export const firstTag = (tags: string[] | undefined, fallback = 'notes') => tags?.[0] || fallback

type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

const isElement = (node: unknown): node is [string, Record<string, unknown>, ...MinimarkNode[]] =>
  Array.isArray(node) && typeof node[0] === 'string' && typeof node[1] === 'object' && node[1] !== null && !Array.isArray(node[1])

export function textOf(node: unknown): string {
  if (typeof node === 'string') return node
  if (isElement(node)) return node.slice(2).map(textOf).join('')
  if (Array.isArray(node)) return node.map(textOf).join(' ')
  return ''
}

export function countWords(body: { value?: unknown } | undefined): number {
  const text = textOf(body?.value)
  return text.split(/\s+/).filter(Boolean).length
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200))

/** Drops a leading "# Title" from the body when it repeats the page title. */
export function withoutLeadingTitle<T extends { title?: string, body?: unknown }>(doc: T): T {
  const body = doc.body as { value?: unknown[] } | undefined
  const first = body?.value?.[0]
  if (!isElement(first) || first[0] !== 'h1') return doc
  const same = textOf(first).trim().toLowerCase() === (doc.title || '').trim().toLowerCase()
  return same ? { ...doc, body: { ...body, value: body!.value!.slice(1) } } : doc
}

/** █ and ░ bar of a given width for a 0..100 value. */
export function bar(percent: number, width: number) {
  const filled = Math.max(0, Math.min(width, Math.round(percent / 100 * width)))
  return { filled: '█'.repeat(filled), empty: '░'.repeat(width - filled) }
}

export const hostOf = (url: string) => {
  try {
    const u = new URL(url)
    const first = u.pathname.split('/').filter(Boolean)[0]
    return first ? `${u.host}/${first}` : u.host
  } catch {
    return url
  }
}

export interface TuiTab {
  key: string
  label: string
  to: string
  match: (path: string) => boolean
}

export const TUI_TABS: TuiTab[] = [
  { key: '1', label: 'home', to: '/', match: p => p === '/' },
  { key: '2', label: 'projects', to: '/projects', match: p => p.startsWith('/projects') },
  { key: '3', label: 'writing', to: '/blog', match: p => p.startsWith('/blog') },
  { key: '4', label: 'ai', to: '/ai', match: p => p.startsWith('/ai') }
]
