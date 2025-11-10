import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on 0.0.0.0 for Docker
    port: 5173,
    proxy: {
      // When baseURL is empty, axios hits relative "/people" and Vite proxies to backend
      "/people": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
});
