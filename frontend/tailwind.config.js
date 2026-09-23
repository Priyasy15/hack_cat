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
        // Nordic Slate & Ice Blue Palette
        'nordic-base': '#121418',         // Deep Charcoal Gray
        'nordic-card': '#1E222A',         // Muted Slate
        'nordic-card-hover': '#242933',   // Elevated Slate
        'nordic-border': '#2E3440',       // Soft Ash Border
        'nordic-border-bright': '#434C5E',
        'nordic-text': '#ECEFF4',         // Off-White
        'nordic-muted': '#D8DEE9',        // Secondary Off-White
        'nordic-subtle': '#4C566A',       // Subtle Gray
        'ice-blue': {
          DEFAULT: '#88C0D0',             // Primary Accent / Highlights
          light: '#8FBCBB',
          dark: '#5E81AC'
        },
        'frost-green': {
          DEFAULT: '#A3BE8C',             // Success / Good State
          dark: '#8FA87B'
        },
        'pastel-ochre': {
          DEFAULT: '#EBCB8B',             // Warning / Caution Badges
          dark: '#D08770'
        },
        'coral-red': {
          DEFAULT: '#BF616A',             // Critical Danger / E-Stop / Alerts
          dark: '#A54E56'
        }
      },
      fontFamily: {
        industrial: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      boxShadow: {
        'ice-glow': '0 0 20px rgba(136, 192, 208, 0.25)',
        'danger-glow': '0 0 25px rgba(191, 97, 106, 0.45)',
        'safe-glow': '0 0 25px rgba(163, 190, 140, 0.35)',
        'warning-glow': '0 0 25px rgba(235, 203, 139, 0.35)',
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
