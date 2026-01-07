/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tulip: {
          red: '#C53A3A',
          green: '#2F7D62',
          orange: '#E18B2C',
          ink: '#1A1A1A',
          paper: '#F7F4EF',
        },
      },
      boxShadow: {
        soft: '0 20px 60px -40px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
