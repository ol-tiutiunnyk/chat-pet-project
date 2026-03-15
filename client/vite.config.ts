import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    environment: "jsdom"
  },
  server: {
    port: 3000,
    open: true
  }
});
