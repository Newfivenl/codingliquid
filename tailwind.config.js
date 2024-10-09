/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './assets/*.liquid',
      './config/*.json',
      './layout/*.liquid',
      './sections/*.liquid',
      './snippets/*.liquid',
      './templates/*.liquid',
      './templates/*.json',
      './templates/customers/*.liquid'
    ],
    theme: {
      extend: {
        rotate: {
          '-90': '-90deg'
        }
      },
    },
    plugins: [
    ]
  }