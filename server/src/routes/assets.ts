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

/* 歌词代理：服务端做编码转换，统一输出 UTF-8 */
assetRoutes.get("/lyrics/*", async (c) => {
  const path = c.req.path;
  const url = ASSET_BASE + path;
  const start = Date.now();

  console.log(`[server] 代理歌词: ${path} → CDN`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new Response("Lyric fetch failed", { status: res.status });
    }
    const buf = await res.arrayBuffer();
    const uint8 = new Uint8Array(buf);

    let text: string;
    try {
      text = new TextDecoder("utf-8").decode(uint8);
      if (text.includes("\uFFFD")) {
        text = new TextDecoder("gbk").decode(uint8);
      }
    } catch {
      text = new TextDecoder("utf-8").decode(uint8);
    }

    const elapsed = Date.now() - start;
    console.log(
      `[server] 歌词转码完成: ${path} | ${res.status} | ${text.length} chars | ${elapsed}ms`
    );

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error(`[server] 歌词代理失败: ${path} | ${err.message}`);
    return new Response("Lyric fetch failed", { status: 502 });
  }
});

createAssetProxy("photos");
createAssetProxy("music");

export { assetRoutes };
