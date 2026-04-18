/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#0f0f1a',
          tertiary: '#141425',
          card: '#111120',
        },
        accent: {
          DEFAULT: '#6C4FFF',
          light: '#9B7AFF',
          dim: 'rgba(108,79,255,0.15)',
        },
        gold: {
          DEFAULT: '#F5A623',
          light: '#FFD166',
        },
        teal: {
          DEFAULT: '#00D4A4',
        },
        rose: {
          DEFAULT: '#FF4C6A',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong: 'rgba(255,255,255,0.13)',
        },
        text: {
          primary: '#F0EEF8',
          muted: '#6B6A8A',
          dim: '#3A3958',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
