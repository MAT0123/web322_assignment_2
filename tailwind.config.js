module.exports = {
    content: [
    './views/**/*.{html,js}',
      ],
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: ['cupcake'],
      },
}