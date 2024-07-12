module.exports = {
    content: [
    './views/**/*.{ejs,js}',
      ],
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: ['cupcake'],
      },
}