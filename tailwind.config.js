/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#58CC02',
          greenDark: '#46A302',
          yellow: '#FFC800',
          yellowDark: '#E5B400',
          blue: '#1CB0F6',
          blueDark: '#1899D6',
          orange: '#FF9600',
          orangeDark: '#E08500',
          red: '#FF4B4B',
          redDark: '#EA2B2B',
          purple: '#CE82FF',
          purpleDark: '#A549E7',
          gray: '#E5E5E5',
          grayDark: '#AFAFAF',
          cream: '#FFF9E6',
          sand: '#F7F4EA',
          cardBorder: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Fredoka', 'Quicksand', 'system-ui', 'sans-serif'],
        arabic: ['"LPMQ Isep Misbah"', 'Amiri', '"Scheherazade New"', 'Traditional Arabic', 'serif'],
      },
      boxShadow: {
        'duo-green': '0 5px 0 #46A302',
        'duo-yellow': '0 5px 0 #E5B400',
        'duo-blue': '0 5px 0 #1899D6',
        'duo-orange': '0 5px 0 #E08500',
        'duo-purple': '0 5px 0 #A549E7',
        'duo-gray': '0 5px 0 #AFAFAF',
        'duo-card': '0 4px 0 #E5E7EB',
      }
    },
  },
  plugins: [],
}
