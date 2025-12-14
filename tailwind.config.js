/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#36e270",
                "primary-hover": "#2fd165",
                "background": "var(--color-background)",
                "background-dark": "#112117",
                "surface": "var(--color-surface)",
                "surface-dark": "#1c2a23",
                "text-main": "var(--color-text-main)",
                "text-secondary": "var(--color-text-secondary)",
                "soft-blue": "#BFD7EA",
                "soft-green": "#A8D5BA",
                "soft-orange": "#F4A261",
                "soft-red": "#EF4444",
                "card-bg": "var(--color-card-bg)",
                "border-color": "var(--color-border)",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px",
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card': '0 2px 8px rgba(0,0,0,0.04)',
            }
        },
    },
    plugins: [],
}
