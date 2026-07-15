import { Hono } from "hono";
import { sign } from "hono/jwt";
import { users, refreshTokenMap, User } from "../data";

const JWT_SECRET_FALLBACK = "dev-only-insecure-secret";

const usersRoutes = new Hono();

function generateJWT(userId: number, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign({ sub: userId, iat: now, exp: now + 3600 }, secret);
}

usersRoutes.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json<{
      username: string;
      password: string;
    }>();

    if (!username || !password) {
      console.log(`[server] 登录失败: 缺少用户名或密码`);
      return c.json({ code: 400, msg: "用户名和密码不能为空", data: null }, 400);
    }

    const user = users.find(
      (u: User) => u.username === username && u.password === password
    );
    if (!user) {
      console.log(`[server] 登录失败: 用户名 "${username}" 密码错误`);
      return c.json({ code: 401, msg: "用户名或密码错误", data: null }, 401);
    }

    const accessToken = await generateJWT(
      user.id,
      (c.env as any)?.JWT_SECRET ?? JWT_SECRET_FALLBACK
    );
    console.log(`[server] 登录成功: 用户 "${username}" (id=${user.id})`);

    return c.json({
      code: 200,
      msg: "登录成功",
      data: {
        access_token: accessToken,
        refresh_token: user.refreshToken,
        callback: "null",
      },
    });
  } catch (err) {
    console.error(`[server] 登录异常: ${err.message}`);
    return c.json({ code: 500, msg: "服务器内部错误", data: null }, 500);
  }
});

usersRoutes.post("/refresh", async (c) => {
  try {
    const { refresh_token } = await c.req.json<{ refresh_token: string }>();

    if (!refresh_token) {
      console.log(`[server] Token 刷新失败: 缺少 refresh_token`);
      return c.json({ code: 400, msg: "refresh_token 不能为空", data: null }, 400);
    }

    const userId = refreshTokenMap[refresh_token];
    if (!userId) {
      const short = refresh_token.slice(0, 16);
      console.log(`[server] Token 刷新失败: refresh_token 无效 "${short}..."`);
      return c.json({
        code: 401,
        msg: `refresh_token 错误: ${refresh_token}`,
        data: null,
      }, 401);
    }

    const user = users.find((u) => u.id === userId);
    const accessToken = await generateJWT(
      userId,
      (c.env as any)?.JWT_SECRET ?? JWT_SECRET_FALLBACK
    );
    console.log(`[server] Token 刷新成功: 用户 "${user?.username}" (id=${userId})`);

    return c.json({
      code: 200,
      msg: "刷新成功",
      data: {
        access_token: accessToken,
        callback: "null",
      },
    });
  } catch (err) {
    console.error(`[server] Token 刷新异常: ${err.message}`);
    return c.json({ code: 500, msg: "服务器内部错误", data: null }, 500);
  }
});

usersRoutes.post("/register", async (c) => {
  try {
    const { username, password } = await c.req.json<{
      username: string;
      password: string;
    }>();

    if (!username || !password) {
      console.log(`[server] 注册失败: 缺少用户名或密码`);
      return c.json({ code: 400, msg: "用户名和密码不能为空", data: null }, 400);
    }

    console.log(`[server] 注册成功: 用户 "${username}"`);

    return c.json({
      code: 200,
      msg: "注册成功",
      data: {
        uid: crypto.randomUUID(),
        username,
      },
    });
  } catch (err) {
    console.error(`[server] 注册异常: ${err.message}`);
    return c.json({ code: 500, msg: "服务器内部错误", data: null }, 500);
  }
});

export { usersRoutes };
