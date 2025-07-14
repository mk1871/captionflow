/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* 1. Mapear utilidades a las variables del tema -------------------- */
      fontFamily: {
        // Utilidad font-sans  →  var(--font-sans) declarada por el tema
        sans: ['var(--font-sans)'],
        // Utilidad font-serif →  var(--font-serif)
        serif: ['var(--font-serif)'],
        // Utilidad font-mono  →  var(--font-mono)
        mono: ['var(--font-mono)'],


      },
      // Transiciones personalizadas
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      // Escalas personalizadas para animaciones
      scale: {
        '92': '0.92',
        '102': '1.02',
        '105': '1.05',
      },
      // Delays personalizados
      transitionDelay: {
        '50': '50ms',
        '75': '75ms',
      },
      // Animaciones personalizadas
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'subtle-pulse': 'subtle-pulse 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

    },

  },

  darkMode: 'class',  // 2. Permite alternar claro/oscuro si tu tema lo define
  plugins: [],
}
