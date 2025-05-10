// tailwind.config.js

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          amber: {
            100: '#fef3c7',
            200: '#fde68a',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
        },
      },
    },
    plugins: [],
  };