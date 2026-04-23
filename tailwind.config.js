/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#070912',
          card: 'rgba(18, 22, 41, 0.6)',
          'card-hover': 'rgba(25, 30, 53, 0.8)',
        },
        accent: {
          cyan: '#00f0ff',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a8c2',
          muted: '#6b7280',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(0, 240, 255, 0.3)',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        neon: '0 0 20px rgba(0, 240, 255, 0.2)',
      },
      backdropBlur: {
        glass: '12px',
      }
    },
  },
  plugins: [],
}
