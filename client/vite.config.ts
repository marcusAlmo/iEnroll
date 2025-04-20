import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // host: '0.0.0.0', // 👈 binds server to all network interfaces
    // port: 5173,       // optional: specify port explicitly
    proxy: {
      '/api': 'http://0.0.0.0:3000', // proxy to backend
    },
  },
});
