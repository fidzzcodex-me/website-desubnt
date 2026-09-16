const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FBFDFF',
        brand: {
          50: '#F4F8FE',
          100: '#E7F0FD',
          200: '#C7DBFA',
          300: '#9CBEF3',
          400: '#6C9BEA',
          500: '#3E74DD',
          600: '#2557C0',
          700: '#1E439A',
          800: '#1B3A80',
          900: '#1A3269'
        },
        ink: {
          900: '#0E1526',
          700: '#33405C',
          500: '#5C6B87',
          300: '#98A6BF',
          100: '#E7ECF5'
        }
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14, 21, 38, 0.04), 0 8px 24px rgba(30, 67, 154, 0.06)'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-6%)' },
          '50%': { transform: 'translateX(106%)' },
          '100%': { transform: 'translateX(-6%)' }
        },
        radar: {
          '0%': { transform: 'scale(0.6)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        }
      },
      animation: {
        scan: 'scan 2.6s ease-in-out infinite',
        radar: 'radar 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) infinite'
      }
    }
  },
  plugins: []
}
