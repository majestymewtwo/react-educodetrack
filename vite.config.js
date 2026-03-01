import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from 'fs'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  server: {
    https: {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.crt"),
    },
    host: true,
    port: 443,
    allowedHosts: ["educodetrack.com"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
