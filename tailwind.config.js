/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "background-0" : "#262626",
                "background-1" : "#383838",
                "background-field" : "#2e2e2e",
                "background-viewport" : "#2f2f2f",
                "background-selectable" : "#494949",
                // "background-tabbar" : "#383838",
                "background-tabbar" : "#484848",
                "color-default" : "#878787",
                "color-menu": "#7d7d7d",
                "transparent": "transparent"
    
            }
        },
    },
    plugins: [],
}

