/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    container: {
      center: true,
      padding: '20px',
    },
    extend: {
      colors: {
        'bg-dark': 'var(--bg-dark)',
        'bg-dark-soft': 'var(--bg-dark-soft)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-color': 'var(--border-color)',
        'border-color-hover': 'var(--border-color-hover)',
        'glass-bg': 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
      }
    },
  },
  plugins: [],
}
