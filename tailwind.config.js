/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#111111",
        card: "#191919",
        cardElevado: "#202020",
        bordaSutil: "#252525",
        bordaVisivel: "#333333",
        textoPrimario: "#f5f5f5",
        textoSecundario: "#999999",
        textoTerciario: "#555555",
        verde: "#4ade80",
        verdeBackground: "#0f2010",
        ambar: "#f59e0b",
        ambarBackground: "#2a1a00",
        vermelho: "#ef4444",
        vermelhoBackground: "#2d0f0f",
        roxo: "#818cf8",
        roxoBackground: "#1a1a2e",
        whatsapp: "#005c3f",
      },
    },
  },
  plugins: [],
};
