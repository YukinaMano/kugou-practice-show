import { Hono } from "hono";

const ASSET_BASE = "https://pub-05905c867afb43349d9e01121be81586.r2.dev";

const assetRoutes = new Hono();

function createAssetProxy(prefix: string) {
  assetRoutes.use(`/${prefix}/*`, async (c) => {
    const path = c.req.path;
    const url = ASSET_BASE + path;
    const start = Date.now();

    console.log(`[server] 代理静态资源: ${path} → CDN`);

    try {
      const res = await fetch(url);
      const elapsed = Date.now() - start;
      const size = res.headers.get("content-length") || "unknown";
      console.log(
        `[server] 代理完成: ${path} | ${res.status} | ${size} bytes | ${elapsed}ms`
      );
      return new Response(res.body, {
        status: res.status,
        headers: res.headers,
      });
    } catch (err) {
      console.error(`[server] 代理失败: ${path} | ${err.message}`);
      return new Response("Asset fetch failed", { status: 502 });
    }
  });
}

createAssetProxy("photos");
createAssetProxy("music");
createAssetProxy("lyrics");

export { assetRoutes };
