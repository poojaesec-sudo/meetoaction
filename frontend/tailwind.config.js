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
        obsidian: {
          950: '#050505', // Deep Obsidian
          900: '#0B0D0F', // Charcoal
          850: '#111418', // Graphite
          800: '#171B20', // Elevated Graphite
          750: '#1F242C', // Border subtle
          700: '#2A313C', // Border high
          600: '#3E4756',
        },
        lime: {
          DEFAULT: '#B8FF00', // Electric Lime primary accent
          300: '#D4FF4D',
          400: '#C5FF1A',
          500: '#B8FF00',
          600: '#9FE000',
        },
        magenta: {
          DEFAULT: '#FF2DA6', // Hot Magenta secondary accent
          300: '#FF6BC0',
          400: '#FF47B2',
          500: '#FF2DA6',
          600: '#D91285',
        },
        orange: {
          DEFAULT: '#FF7A00', // Solar Orange secondary accent
          300: '#FFA04D',
          400: '#FF8C26',
          500: '#FF7A00',
          600: '#D96500',
        },
        gold: {
          DEFAULT: '#FFD166', // Cyber Gold
          300: '#FFE199',
          400: '#FFD980',
          500: '#FFD166',
          600: '#E6B647',
        },
        coral: {
          DEFAULT: '#FF4D5A', // Coral Red
          300: '#FF7A84',
          400: '#FF616C',
          500: '#FF4D5A',
          600: '#D9323F',
        },
        techcyan: {
          DEFAULT: '#00E5FF', // Supporting Tech Cyan
          400: '#33EBFF',
          500: '#00E5FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-lime': '0 0 25px -3px rgba(184, 255, 0, 0.45)',
        'neon-magenta': '0 0 25px -3px rgba(255, 45, 166, 0.45)',
        'neon-orange': '0 0 25px -3px rgba(255, 122, 0, 0.45)',
        'neon-gold': '0 0 25px -3px rgba(255, 209, 102, 0.45)',
        'neon-coral': '0 0 25px -3px rgba(255, 77, 90, 0.45)',
        'command-card': '0 8px 32px 0 rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spinReverse 16s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
