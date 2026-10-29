export type TuiMode = 'NORMAL' | 'READ' | 'SEARCH' | 'ERROR'

export interface TuiHint {
  key: string
  label: string
}

export interface TuiStatus {
  mode: TuiMode
  path: string
  hints: TuiHint[]
  right: string
  /** 0..100 while reading, null otherwise */
  progress: number | null
}

export type TuiOverlay = 'none' | 'search' | 'help'

const emptyStatus = (): TuiStatus => ({ mode: 'NORMAL', path: '~', hints: [], right: '', progress: null })

export const useTuiStatus = () => useState<TuiStatus>('tui-status', emptyStatus)

/** A page describes its status line; the layout renders it. */
export function useStatusLine(source: () => Partial<TuiStatus>) {
  const status = useTuiStatus()
  watchEffect(() => {
    status.value = { ...emptyStatus(), ...source() }
  })
}

/**
 * Pages fill the status line after their data loads, which on the server is
 * later than the layout renders it. Until the status line has mounted, it
 * shows only what the route alone tells, so server and client markup match.
 */
export function useMountedFlag() {
  const mounted = ref(false)
  onMounted(() => { mounted.value = true })
  return mounted
}

export const modeForPath = (path: string): TuiMode => (/^\/(blog|ai)\/.+/.test(path) ? 'READ' : 'NORMAL')

export const useTuiOverlay = () => useState<TuiOverlay>('tui-overlay', () => 'none')

/** Single-character shortcuts can be switched off in the keys panel. */
export const useTuiLetters = () => useState<boolean>('tui-letters', () => true)

/** Short message shown in the status line, e.g. after copying. */
export const useTuiFlash = () => useState<string>('tui-flash', () => '')

export const useTuiSearchQuery = () => useState<string>('tui-search-q', () => '')

let flashTimer: ReturnType<typeof setTimeout> | undefined

export function useTuiCopy() {
  const flash = useTuiFlash()
  return async (text: string, label = 'copied') => {
    try {
      await navigator.clipboard.writeText(text)
      flash.value = label
    } catch {
      flash.value = 'copy failed'
    }
    clearTimeout(flashTimer)
    flashTimer = setTimeout(() => { flash.value = '' }, 1600)
  }
}

export function useTuiTheme() {
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value !== 'light')
  const toggle = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }
  return { isDark, toggle }
}

/**
 * Query-driven UI state on a prerendered site: the HTML is built without a
 * query string, so query values are applied only after hydration.
 */
export function useHydratedFlag() {
  const nuxtApp = useNuxtApp()
  const ready = ref(import.meta.client && !nuxtApp.isHydrating)
  onMounted(() => { ready.value = true })
  return ready
}

export const queryString = (v: unknown): string | undefined => {
  const first = Array.isArray(v) ? v[0] : v
  return typeof first === 'string' && first ? first : undefined
}
