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


        },

    },


    darkMode: 'class',  // 2. Permite alternar claro/oscuro si tu tema lo define
    plugins: [],
}
