import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { usersRoutes } from "./routes/users";
import { musicRoutes } from "./routes/music";
import { assetRoutes } from "./routes/assets";

const JWT_SECRET = "kugou-mock-server-secret-2024";
const START_TIME = Date.now();

function formatUptime(): string {
  const s = Math.floor((Date.now() - START_TIME) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h${m % 60}m${s % 60}s`;
  if (m > 0) return `${m}m${s % 60}s`;
  return `${s}s`;
}

const app = new Hono();

app.use(
  "*",
  logger((message, ...rest) => {
    console.log(`[server] ${message}`);
  })
);

const allowedOrigins: string[] = (() => {
  try {
    const raw = process.env.ALLOWED_ORIGINS;
    if (raw) return JSON.parse(raw);
  } catch {}
  return ["http://localhost:5173"];
})();

console.log(`[server] CORS 白名单: ${allowedOrigins.join(", ")}`);

app.use(
  "*",
  cors({
    origin: allowedOrigins,
  })
);

app.use("/api/music/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`[server] JWT 鉴权失败: 缺少 Authorization 头`);
    return c.json({ code: 401, msg: "未提供认证令牌", data: null }, 401);
  }
  try {
    await jwt({ secret: JWT_SECRET, alg: "HS256" })(c, next);
  } catch {
    console.log(`[server] JWT 鉴权失败: token 无效或已过期`);
    return c.json({ code: 401, msg: "认证令牌无效或已过期", data: null }, 401);
  }
});

app.route("/", assetRoutes);
app.route("/api/users", usersRoutes);
app.route("/api/music", musicRoutes);

app.get("/", (c) => c.text("Kugou Mock Server is running"));

app.onError((err, c) => {
  console.error(`[server] 未捕获异常: ${err.message}`);
  console.error(err.stack);
  return c.json({ code: 500, msg: "服务器内部错误", data: null }, 500);
});

const port = Number(process.env.PORT) || 8787;
console.log(`[server] ========================================`);
console.log(`[server]   Kugou Mock Server 启动成功`);
console.log(`[server]   地址: http://localhost:${port}`);
console.log(`[server]   运行时间: ${new Date().toLocaleString()}`);
console.log(`[server] ========================================`);
serve({ fetch: app.fetch, port });
