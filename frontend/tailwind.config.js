module.exports = {
  content: [
     './views/Pimpinan/*.{html,js,ejs}',
     './views/Ktu/*.{html,js,ejs}',
     './views/*.{html,j.ejs}',
     './views/Pegawai/*.{html,ejs,js}',
      'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins','sans-serif'],
      },
    },
  },
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