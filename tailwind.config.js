/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        egg: {
          black: "#080704",
          panel: "#141008",
          card: "#1d160b",
          gold: "#ffcc33",
          yolk: "#ffb000",
          shell: "#fff7dc",
          muted: "#c9b98b",
          danger: "#ff5c3b",
          green: "#8cff7a"
        }
      },
      boxShadow: {
        egg: "0 24px 80px rgba(255, 176, 0, 0.18)",
        brutal: "8px 8px 0 rgba(255, 204, 51, 0.95)"
      }
    }
  },
  plugins: []
};
``