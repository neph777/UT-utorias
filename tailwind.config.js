/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#00805C",  
          600: "#006B4C",
          700: "#00563C",
          400: "#04BD75",  
        },
        dark: {
          500: "#0A0F1A", 
          600: "#080C14",
          700: "#05080F",
        }
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        utn: {
          primary: "#00805C",
          "primary-content": "#ffffff",
          secondary: "#04BD75",
          "secondary-content": "#ffffff",
          accent: "#04BD75",
          neutral: "#0A0F1A",
          "base-100": "#ffffff",
          "base-200": "#F8FAFC",
          "base-300": "#F1F5F9",
          info: "#3b82f6",
          success: "#00805C",
          warning: "#f59e0b",
          error: "#dc2626",
        },
      },
      "light",
    ],
    defaultTheme: "utn",
  },
}