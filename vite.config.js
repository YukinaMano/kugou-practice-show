import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { __ASSET_REMOTE_URL__ } from "./config.js";

export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      "/musicList": {
        target: __ASSET_REMOTE_URL__ || "localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/musicList/, "/musicList"),
      },
      "/api": {
        target: __ASSET_REMOTE_URL__ || "localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
});
