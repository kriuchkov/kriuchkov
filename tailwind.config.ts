import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default <Config>{
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827', // Gray 900
        secondary: '#4b5563', // Gray 600
        accent: '#2563eb', // Blue 600
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: [ typography],
}
