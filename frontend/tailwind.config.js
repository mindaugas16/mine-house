// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      xs: { max: '639px' },
      sm: { max: '767px' },
      md: { max: '1023px' },
      lg: { min: '1024px' },
    },
    container: {
      padding: '1rem',
    },
    extend: {
      inset: {
        '10': '10px',
        '20': '20px',
      },
      gridTemplateColumns: {
        main: '250px 1fr',
      },
    },
  },
};
