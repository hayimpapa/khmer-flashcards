/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        khmer: {
          50: '#fdf6ec',
          100: '#fae8cc',
          500: '#c97b2a',
          600: '#a85f17',
          700: '#7c4510',
        },
        phonetic: {
          50: '#eef6f9',
          100: '#d4e7ee',
          500: '#3a8ba6',
          600: '#236d86',
          700: '#1a4f63',
        },
        english: {
          50: '#eef5ee',
          100: '#d0e4d1',
          500: '#4a8c52',
          600: '#356d3c',
          700: '#234d28',
        },
        ink: {
          50: '#f7f6f3',
          100: '#ebe8df',
          200: '#d6d1c2',
          800: '#2b2a26',
          900: '#1a1a18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        khmer: ['"Noto Sans Khmer"', '"Noto Serif Khmer"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(31, 28, 22, 0.15), 0 4px 12px -4px rgba(31, 28, 22, 0.08)',
      },
    },
  },
  plugins: [],
}
