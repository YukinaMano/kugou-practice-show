import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [uni()],
    server: {
      proxy: {
        "/photos": {
          target: env.VITE_ASSET_BASE_URL,
          changeOrigin: true,
        },
        "/music": {
          target: env.VITE_ASSET_BASE_URL,
          changeOrigin: true,
        },
        "/lyrics": {
          target: env.VITE_ASSET_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
