/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
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
      },
    },
    plugins: [
        require('daisyui'),
    ],
    prefix: 'tw-',
  }