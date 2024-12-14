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
    './templates/customers/*.liquid',
  ],
  theme: {
    extend: {},
    fontSize: {
      // Using 62.5% base (10px) with --font-body-scale (1.0)
      // This makes 1.6rem = 16px
      xs: '1.2rem', // 12px
      sm: '1.4rem', // 14px
      base: '1.6rem', // 16px
      lg: '1.8rem', // 18px
      xl: '2rem', // 20px
      '2xl': '2.4rem', // 24px
      '3xl': '3rem', // 30px
      '4xl': '3.6rem', // 36px
      '5xl': '4.8rem', // 48px
      '6xl': '6rem', // 60px
      '7xl': '7.2rem', // 72px
      '8xl': '9.6rem', // 96px
      '9xl': '12.8rem', // 128px
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#111827',
          'primary-content': '#c9cbcf',
          secondary: '#347eea',
          'secondary-content': '#fff',
          accent: '#60a5fa',
          'accent-content': '#ffffff',
          neutral: '#fff',
          'neutral-content': '#141414',
          'base-100': '#fafafa',
          'base-200': '#d9d9d9',
          'base-300': '#bababa',
          'base-content': '#151515',
          info: '#ffedd5',
          'info-content': '#161410',
          success: '#16a34a',
          'success-content': '#000a02',
          warning: '#f59e0b',
          'warning-content': '#150900',
          error: '#dc2626',
          'error-content': '#ffd9d4',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
  prefix: 'tw-',
};
