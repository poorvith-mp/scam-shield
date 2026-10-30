/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0a0f0d', // 60% ground dark
          900: '#111b15', // 30% structural plate dark
          800: '#16231c',
          700: '#1e2e25', // structural borders dark
          600: '#2d4236',
        },
        sage: {
          50: '#f8faf9',  // 60% ground light
          100: '#f0f4f1',
          200: '#e1e8e3', // structural borders light
          300: '#cbd5cd',
          800: '#2d3731',
          900: '#1a221d',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        rose: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
