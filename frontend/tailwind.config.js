/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f8',
          500: '#0e8cee',
          600: '#026fcc',
          700: '#0358a6',
          800: '#074a87',
          900: '#0c3f70',
          950: '#08284a',
        },
        lumen: {
          bg: '#f8fafc',
          surface: '#ffffff',
          input: '#f1f5f9',
          border: '#e2e8f0',
          primary: '#0f172a',
          'primary-dark': '#020817',
          'primary-light': '#1e293b',
          accent: '#2563eb',
          muted: '#64748b',
        },
        dark: {
          bg: '#0b0f19',
          surface: '#111827',
          card: '#151e2e',
          border: '#1f293d',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'glow-brand': '0 0 20px -3px rgba(37, 99, 235, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
