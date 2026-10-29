const INTERACTIVE = 'a[href], button, input, select, textarea, summary, [role="button"], [contenteditable="true"]'
const TYPING = /^(INPUT|TEXTAREA|SELECT)$/

export default defineNuxtPlugin(() => {
  const letters = useTuiLetters()

  try {
    if (localStorage.getItem('tui-letters') === 'off') letters.value = false
  } catch { /* storage blocked */ }
  watch(letters, (on) => {
    try { localStorage.setItem('tui-letters', on ? 'on' : 'off') } catch { /* storage blocked */ }
  })

  let lastG = 0

  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return

    const target = e.target instanceof HTMLElement ? e.target : null
    const typing = !!target && (target.isContentEditable || TYPING.test(target.tagName))
    if (typing && e.key !== 'Escape') return

    // Let links and buttons keep their native Enter and Space behaviour.
    if ((e.key === 'Enter' || e.key === ' ') && target?.closest(INTERACTIVE)) return
    if (e.key === 'Tab') return

    if (e.key.length === 1 && !letters.value) return

    if (e.key === 'g') {
      const now = Date.now()
      if (now - lastG < 600) {
        lastG = 0
        if (dispatchHotkey('gg', e)) {
          e.preventDefault()
          return
        }
      } else {
        lastG = now
      }
    }

    if (dispatchHotkey(e.key, e)) e.preventDefault()
  })
})
