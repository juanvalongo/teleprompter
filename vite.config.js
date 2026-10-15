import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Teleprompter IA",
        short_name: "Prompter",
        description:
          "Teleprompter com reconhecimento de voz e sincronização em tempo real",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        icons: [
          // Depois você pode gerar e adicionar ícones reais na pasta public/
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
