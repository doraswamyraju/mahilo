/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4E0C54',      // Deep logo wordmark purple
          'primary-dark': '#38063D',
          'primary-light': '#6E1B75',
          secondary: '#C2185B',    // Logo handbag gradient magenta
          'secondary-light': '#E91E63',
          accent: '#FF7A00',       // Logo smile & sparkle warm orange
          growth: '#4CAF50',       // Logo green leaf
          'growth-dark': '#2E7D32',
          bg: '#FAF6FA',           // Soft luxury tinted background
          surface: '#FFFFFF',
          border: '#EFE5F0',
          dark: '#200523',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(78, 12, 84, 0.04)',
        'card': '0 4px 20px -2px rgba(78, 12, 84, 0.07)',
        'hover': '0 12px 30px -4px rgba(78, 12, 84, 0.12)',
        'glow': '0 0 25px rgba(194, 24, 91, 0.25)',
      },
    },
  },
  plugins: [],
}
