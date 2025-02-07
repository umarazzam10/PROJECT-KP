module.exports = {
  content: [
     './views/Pimpinan/*.{html,js}',
     './views/KTU/*.{html,js}',
     './views/*.{html,js}',
     './views/Pegawai/*.{html,ejs,js}',
     './views/Pimpinan/*.{html,ejs,js}',
      'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
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