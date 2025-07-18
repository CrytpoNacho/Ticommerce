import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000", // Negro puro para el fondo
        foreground: "#FFFFFF", // Pure White - Texto principal
        primary: "#D4AF37", // Gold Luxe - Color de acento primario
        secondary: "#C0C0C0", // Platinum Silver - Acento secundario
        card: "#FAF9F6", // Soft Ivory - Fondo tarjetas/secundario
        mist: "#E5E5E5", // Mist Gray - Detalles ligeros
        textSecondary: "#A0A0A0", // Cool Gray - Texto secundario
        success: "#2ECC71", // Emerald Green - Confirmación / Positivo
        error: "#E74C3C", // Crimson Red - Error o alerta
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
