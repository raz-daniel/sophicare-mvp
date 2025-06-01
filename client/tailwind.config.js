/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: '#8B7355',
        fire: '#DC2626',
        earth: '#D4A574',
        metal: '#F8FAFC',
        water: '#DBEAFE',
        success: '#059669',
        warning: '#D97706',
        text: '#374151',
        background: '#FEFFFE',
      },
      fontFamily: {
        'medical': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse 2s ease-in-out infinite',
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
} 