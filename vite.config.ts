import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mantine: ["@mantine/core", "@mantine/hooks", "@tabler/icons-react"],
          state: ["@tanstack/react-query", "zustand", "axios"],
        },
      },
    },
  },
});
