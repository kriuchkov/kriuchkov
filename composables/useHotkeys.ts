/** Return false to pass the key on to the next layer. */
export type HotkeyHandler = (e: KeyboardEvent) => unknown

export interface HotkeyLayer {
  keys: Record<string, HotkeyHandler>
  /** Higher runs first. Global keys use 0, pages 10, overlays 100. */
  priority: number
  /** A modal layer swallows every key it does not handle. */
  modal: boolean
}

const layers: HotkeyLayer[] = []

export const hotkeyLayers = () => layers

/**
 * Registers keyboard shortcuts while the calling component is mounted.
 * Key names follow KeyboardEvent.key, plus "gg" for a double g.
 * A handler that returns false passes the key on to the next layer.
 */
export function useHotkeys(keys: Record<string, HotkeyHandler>, opts: { priority?: number, modal?: boolean } = {}) {
  const layer: HotkeyLayer = { keys, priority: opts.priority ?? 10, modal: opts.modal ?? false }
  onMounted(() => { layers.push(layer) })
  onBeforeUnmount(() => {
    const i = layers.indexOf(layer)
    if (i >= 0) layers.splice(i, 1)
  })
}

export function dispatchHotkey(key: string, e: KeyboardEvent): boolean {
  const ordered = layers
    .map((layer, i) => ({ layer, i }))
    .sort((a, b) => (b.layer.priority - a.layer.priority) || (b.i - a.i))
  for (const { layer } of ordered) {
    const handler = layer.keys[key]
    if (handler && handler(e) !== false) return true
    if (layer.modal) return false
  }
  return false
}
