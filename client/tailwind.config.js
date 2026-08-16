/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#0A0A0B',
        graphite: '#121214',
        charcoal: '#1C1C1E',
        stone: '#3A3A3C',
        silver: '#8E8E93',
        bone: '#E5E5EA',
        chalk: '#F2F2F7',
        metal: '#AEAEB2',
        cognac: '#D4A373',
        'neon-accent': '#E5C158',
        brand: {
          50: '#0A0A0B',
          100: '#121214',
          200: '#1C1C1E',
          300: '#8E8E93',
          400: '#AEAEB2',
          505: '#E5E5EA',
          600: '#F2F2F7',
        },
        accent: {
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#E8E4DF',
          300: '#E5C158',
          400: '#E5C158',
          500: '#E5C158',
          600: '#E5C158',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};
