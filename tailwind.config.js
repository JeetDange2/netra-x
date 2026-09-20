/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mine: {
          darkest: '#060911',
          bg: '#0A0F1D',
          surface: '#0F172A',
          card: '#141E34',
          hover: '#1B2845',
          border: '#1E2D4D',
          borderLight: '#2D4370',
          muted: '#64748B',
          text: '#F1F5F9',
          subtext: '#94A3B8',
        },
        status: {
          safe: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          critical: '#DC2626',
          survivor: '#F97316',
          rover: '#38BDF8',
          thermal: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
