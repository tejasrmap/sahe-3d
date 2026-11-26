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
        background: '#080B12',
        surface: '#111827',
        panel: 'rgba(15, 23, 42, 0.85)',
        accent: {
          DEFAULT: '#22C55E',
          secondary: '#10B981',
          glow: 'rgba(34, 197, 94, 0.25)'
        },
        borderLight: 'rgba(255, 255, 255, 0.08)'
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(34, 197, 94, 0.25)',
        'neon-green': '0 0 15px rgba(34, 197, 94, 0.5)',
      }
    },
  },
  plugins: [],
}
