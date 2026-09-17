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
        dark: {
          bg: '#08090D',         // Ultra-deep moody void black
          surface: '#0E1118',    // Primary dark panel surface
          card: '#131722',       // 3D card base surface
          elevated: '#1A202E',   // Elevated dropdowns, modals, popovers
          highlight: '#232A3B',  // Hover states & border highlights
          border: 'rgba(255, 255, 255, 0.08)',
          'border-orange': 'rgba(255, 107, 0, 0.25)',
        },
        brand: {
          50: '#fff3ea',
          100: '#ffe4ce',
          200: '#ffc59b',
          300: '#ffa161',
          400: '#ff8533',        // Radiant Ember
          500: '#ff6b00',        // Hero Electric Sunset Orange
          600: '#e65100',        // Deep Blazing Flame
          700: '#c43c00',        // Burnt Orange
          800: '#9e3700',        // Dark Auburn
          900: '#7a2d00',        // Deep Smolder
          950: '#421600',
        },
        fresh: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        '3d-card': '0 15px 35px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        '3d-card-hover': '0 25px 50px -12px rgba(255, 107, 0, 0.15), 0 0 0 1px rgba(255, 133, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        '3d-btn': '0 4px 0 #9E3700, 0 10px 25px -4px rgba(255, 107, 0, 0.4)',
        '3d-btn-active': '0 1px 0 #9E3700, 0 4px 12px -2px rgba(255, 107, 0, 0.3)',
        '3d-dark-btn': '0 4px 0 #08090D, 0 8px 20px -4px rgba(0, 0, 0, 0.6)',
        'glow-orange': '0 0 25px -2px rgba(255, 107, 0, 0.4)',
        'glow-orange-sm': '0 0 12px rgba(255, 107, 0, 0.35)',
        'glass-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
