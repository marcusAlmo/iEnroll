 /** @type {import('tailwindcss').Config} */
 export default {
  content: ["./src/app/*.{html,js}", "./src/app/**/*.{html,jsx}"],
  theme: {
    extend: {
      colors: {
        "text": "#0B0D0F",
        "background": "#F9FAFB",
        "primary": "#1C385E",
        "secondary": "#EFAA15",
        "accent": "#4EA9EF",
        "container-1": "#EDF0F3",
        "border-1": "#E2E2E2",
        "text-2": "#7E8C91",
        "success": "#61BC79",
        "warning": "#FFC107",
        "danger": "#FF0000"
      }
    },
  },
  plugins: [],
}