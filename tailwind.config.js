/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0D1B3D',
          blue: '#1D4ED8',
          green: '#22C55E',
          slate: '#F3F5FA',
        },
      },
      boxShadow: {
        premium: '0 20px 50px rgba(13, 27, 61, 0.16)',
      },
      backgroundImage: {
        'hero-pattern':
          'linear-gradient(135deg, rgba(13, 27, 61, 0.92), rgba(29, 78, 216, 0.82)), url("https://images.unsplash.com/photo-1597750636974-5f29182ee942?auto=format&fit=crop&w=2000&q=80")',
      },
    },
  },
  plugins: [],
}

