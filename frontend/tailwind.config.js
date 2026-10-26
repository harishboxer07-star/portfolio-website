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
        navy: {
          950: '#0b1319', // Deep Slate Graphite
          900: '#111f28', // Rich Slate Surface
          850: '#172936', // Glass Card Base
          800: '#1f3749', // Highlight / Elevated Border
          700: '#2b4b63',
          600: '#3b6585'
        },
        brand: {
          mint: '#34d399',
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          purple: '#10b981', // mapped to emerald for cohesive neon palette
          indigo: '#06b6d4', // mapped to cyan for cohesive neon palette
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
