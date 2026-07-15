import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const mockServer = env.VITE_MOCK_SERVER || "http://localhost:8787";

  return {
    plugins: [uni()],
    server: {
      proxy: {
        "/photos": {
          target: mockServer,
          changeOrigin: true,
        },
        "/music": {
          target: mockServer,
          changeOrigin: true,
        },
        "/lyrics": {
          target: mockServer,
          changeOrigin: true,
        },
      },
    },
  };
});
