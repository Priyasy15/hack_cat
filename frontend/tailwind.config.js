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
        'cat-yellow': {
          DEFAULT: '#FFCD11',
          hover: '#FFD700',
          dark: '#D4A600',
          light: '#FFF0A0'
        },
        'cat-amber': '#F59E0B',
        'cab-black': '#0F0F11',
        'cab-dark': '#16161B',
        'cab-card': '#202026',
        'cab-card-hover': '#282830',
        'cab-border': '#363640',
        'cab-border-bright': '#4E4E5A',
        'cab-muted': '#8E8E9B',
      },
      fontFamily: {
        industrial: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      boxShadow: {
        'cat-glow': '0 0 20px rgba(255, 205, 17, 0.25)',
        'danger-glow': '0 0 25px rgba(239, 68, 68, 0.4)',
        'safe-glow': '0 0 25px rgba(34, 197, 94, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
