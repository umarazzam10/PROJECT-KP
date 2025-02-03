module.exports = {
  content: [
     './views/Pimpinan/*.{html,js}',
      'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
      require('preline/plugin'),
  ],
}