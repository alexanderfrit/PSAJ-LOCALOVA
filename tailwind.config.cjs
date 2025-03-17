/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            serif: ['Playfair Display', 'serif'],
         },
         keyframes: {
            progress: {
               '0%': { transform: 'translateX(-100%)' },
               '100%': { transform: 'translateX(100%)' }
            },
            float: {
               '0%, 100%': { transform: 'translateY(0)' },
               '50%': { transform: 'translateY(-10px)' },
            }
         },
         animation: {
            progress: 'progress 1.5s ease-in-out infinite',
            float: 'float 3s ease-in-out infinite',
         }
      },
   },
   plugins: [require("daisyui")],
   daisyui: {
      themes: [{
         mytheme: {
            // Luxury green color palette
            "primary": "#0B4D3C",        // Deep emerald green
            "primary-focus": "#0D5A46",  // Slightly lighter emerald
            "primary-content": "#FFFFFF",

            "secondary": "#739D8C",      // Sage green
            "secondary-focus": "#86B09E",
            "secondary-content": "#FFFFFF",

            "accent": "#BFB69B",         // Warm gold/beige
            "accent-focus": "#CFC6AB",
            "accent-content": "#0B4D3C",

            "neutral": "#2C3632",        // Deep green-gray
            "neutral-focus": "#3A443F",
            "neutral-content": "#FFFFFF",

            "base-100": "#FFFFFF",
            "base-200": "#F8FAF9",
            "base-300": "#EEF2F0",
            "base-content": "#1A1A1A",

            "info": "#7BA5AB",           // Muted teal
            "success": "#527D6D",        // Forest green
            "warning": "#C2B280",        // Warm sand
            "error": "#A65D57",          // Muted red

            // Custom extended palette
            "--rounded-box": "0",        // Sharp corners
            "--rounded-btn": "0",
            "--rounded-badge": "0",
            "--animation-btn": "0.25s",
            "--animation-input": "0.2s",
            "--btn-text-case": "uppercase",
            "--btn-focus-scale": "0.98",
            "--border-btn": "1px",
            "--tab-border": "1px",
            "--tab-radius": "0",
         },
      }],
      includeBase: true,
      includedThemes: ["mytheme"],
      logs: false,
   },
   future: {
      removeDeprecatedGapUtilities: true,
      purgeLayersByDefault: true,
   },
};
