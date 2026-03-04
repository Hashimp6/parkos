// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        animation: {
          float: 'float 15s infinite ease-in-out',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '33%': { transform: 'translateY(-50px) translateX(20px)' },
            '66%': { transform: 'translateY(20px) translateX(-20px)' },
          },
        },
      },
    },
  }