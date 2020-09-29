const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.vue', './src/**/*.ts'],
  },
  theme: {
    extend: {
      boxShadow: {
        dark: '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        sans: ['Play', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        dark: {
          50: '#F4F4F4',
          100: '#E8E8E8',
          200: '#C6C6C6',
          300: '#A4A4A4',
          400: '#242424',
          500: '#1C1C1C',
          600: '#191919',
          700: '#111111',
          800: '#0D0D0D',
          900: '#080808',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/ui'), require('@tailwindcss/typography')],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
