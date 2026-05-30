/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Core brand (from logo)
          navy: '#0D1B3E', // deep navy — dark sections / backgrounds
          navyMid: '#0F2554', // mid navy — cards / sections
          primary: '#1565C0', // royal blue — main brand colour / buttons
          primaryLight: '#1976D2', // medium blue — hover states
          accent: '#42A5F5', // electric/sky blue — highlights, water effect
          accentBright: '#2196F3', // bright blue — accents, badge text
          offwhite: '#F0F6FF', // blue-tinted white — light sections
          muted: '#64748B', // muted text on light backgrounds
          mutedBlue: '#90A4AE', // muted blue-gray text on dark backgrounds
          amber: '#F5A623', // rating stars (kept)

          // Legacy aliases so older pages re-theme automatically
          teal: '#42A5F5',
          green: '#1565C0',
          blue: '#1565C0',
          navy2: '#0F2554',
          slate: '#F0F6FF',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.2em',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0D1B3E 0%, #0F2554 40%, #1565C0 100%)',
        'quote-gradient': 'linear-gradient(135deg, #0D1B3E 0%, #0F2554 100%)',
        'dot-grid': 'radial-gradient(rgba(66, 165, 245, 0.18) 1px, transparent 1px)',
      },
      boxShadow: {
        premium: '0 24px 60px rgba(13, 27, 62, 0.18)',
        card: '0 10px 30px rgba(13, 27, 62, 0.08)',
        'card-hover': '0 20px 40px rgba(21, 101, 192, 0.15)',
        'blue-glow': '0 0 40px rgba(21, 101, 192, 0.3)',
        'blue-btn': '0 8px 25px rgba(21, 101, 192, 0.5)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        floatDot: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        scrollWheel: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '40%': { opacity: '1' },
          '80%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll-wheel': 'scrollWheel 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
