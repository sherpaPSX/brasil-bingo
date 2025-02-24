import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 3000, // Use the environment's port or default to 3000
    host: "0.0.0.0", // povolí přístup z jiných síťových rozhraní
    allowedHosts: ["brasil-bingo-frontend.onrender.com"], // Přidání hosta do povolených
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
