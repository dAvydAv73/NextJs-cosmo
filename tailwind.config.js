/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.js",
  ],
  theme: {
    extend: {
      keyframes: () => ({
        slideRight: {
          "0%": { opacity: 0, marginLeft: "-600px"},
          "100%": { opacity: 1, marginLeft: "0"}
        },
        slideLeft: {
          "0%": { opacity: 0, marginRight: "-600px"},
          "100%": { opacity: 1, marginRight: "0"}
        }
      }),
      animation: {
        slideRight: "slideRight 1s ease-in",
        slideLeft: "slideLeft 1s ease-in",
      },
     fontFamily: {
      gotham: ['Gotham', 'sans-serif'],
      },
      width: {
        'logo-sm': '200px',
        'logo-md': '230px',
        'logo-lg': '260px',
      },
      letterSpacing: {
      tightest: '-.075em',
      tighter: '-.05em',
      normal: '0',
      wider: '.05em',
      widest: '.25em',
    }
    },
  },
  plugins: [],
};
