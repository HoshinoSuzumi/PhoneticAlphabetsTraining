/** @type {import('tailwindcss').Config} */
export default {
    content: [],
    theme: {
        extend: {
            fontFamily: {
                ipa: ['Segoe UI', 'Verdana', 'Lucida Sans Regular', 'Lucida Sans Unicode', 'Arial', 'sans-serif']
            }
        },
    },
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: ["light", "dark", "cyberpunk"],
    },
}

