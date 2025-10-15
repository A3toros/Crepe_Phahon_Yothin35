/**** Tailwind CSS Config ****/
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6f42c1', // navbar purple
        blueSoft: '#d9e1f5',
        blueBold: '#5a9eec',
        pinkSoft: '#ffebee',
        borderSoft: '#bba0ec'
      }
    }
  },
  plugins: [],
};
