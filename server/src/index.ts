import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { usersRoutes } from "./routes/users";
import { musicRoutes } from "./routes/music";
import { assetRoutes } from "./routes/assets";

const JWT_SECRET = "kugou-mock-server-secret-2024";

function getEnv(key: string, fallback: string = ""): string {
  try {
    return (globalThis as any).process?.env?.[key] ?? fallback;
  } catch {
    return fallback;
  }
}

const app = new Hono();

app.use(
  "*",
  logger((message) => {
    console.log(`[server] ${message}`);
  })
);

const allowedOrigins = (c: any): string[] => {
  try {
    const raw = c?.env?.ALLOWED_ORIGINS ?? getEnv("ALLOWED_ORIGINS");
    if (raw) return JSON.parse(raw);
  } catch {}
  return ["http://localhost:5173"];
};

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const list = allowedOrigins(c);
      return list.includes(origin) ? origin : list[0];
    },
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

export default app;
