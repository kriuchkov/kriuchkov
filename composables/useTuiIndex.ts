export type TuiKind = 'project' | 'post' | 'note'

export interface TuiEntry {
  kind: TuiKind
  id: string
  title: string
  to: string
  description: string
  date: string
  tags: string[]
  stack: string[]
}

async function loadIndex(): Promise<TuiEntry[]> {
  const [projects, posts, notes] = await Promise.all([
    queryCollection('projects').order('sort', 'ASC').select('title', 'path', 'description', 'stack').all(),
    queryCollection('blog').order('date', 'DESC').select('title', 'path', 'description', 'date', 'tags', 'externalUrl').all(),
    queryCollection('ai').order('date', 'DESC').select('title', 'path', 'description', 'date', 'tags').all()
  ])
  return [
    ...projects.map((p): TuiEntry => ({
      kind: 'project',
      id: stemOf(p.path),
      title: stemOf(p.path),
      to: `/projects?p=${stemOf(p.path)}`,
      description: p.description || '',
      date: '',
      tags: [],
      stack: p.stack || []
    })),
    ...posts.map((p): TuiEntry => ({
      kind: 'post',
      id: p.path,
      title: p.title,
      to: p.externalUrl || p.path,
      description: p.description,
      date: p.date,
      tags: p.tags || [],
      stack: []
    })),
    ...notes.map((n): TuiEntry => ({
      kind: 'note',
      id: n.path,
      title: n.title,
      to: n.path,
      description: n.description,
      date: n.date || '',
      tags: n.tags || ['ai'],
      stack: []
    }))
  ]
}

const emptyIndex = (): TuiEntry[] => []

/** Everything the search panel, 404 page and home counters need, fetched once. */
export const useTuiIndex = () => useAsyncData('tui-index', loadIndex, { default: emptyIndex })
