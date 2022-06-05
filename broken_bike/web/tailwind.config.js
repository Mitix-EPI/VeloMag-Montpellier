module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'regal-dark': '#273036',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
