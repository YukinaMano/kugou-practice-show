import { Hono } from "hono";
import { musicList, playlist } from "../data";

const musicRoutes = new Hono();

musicRoutes.get("/mylist", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = Number(payload.sub);

    const userPlaylist = playlist[userId];
    if (!userPlaylist) {
      console.log(`[server] 获取歌单失败: 用户 id=${userId} 无歌单数据`);
      return c.json({ code: 401, msg: "用户信息错误", data: null }, 401);
    }

    console.log(
      `[server] 获取歌单成功: 用户 id=${userId} | ${userPlaylist.length} 首歌曲`
    );
    return c.json({
      code: 200,
      msg: "成功获取我的歌单",
      data: userPlaylist,
    });
  } catch {
    console.log(`[server] 获取歌单失败: JWT payload 解析异常`);
    return c.json({ code: 401, msg: "用户信息错误", data: null }, 401);
  }
});

musicRoutes.get("/alllist", async (_c) => {
  console.log(`[server] 获取曲库: ${musicList.length} 首歌曲`);
  return _c.json({
    code: 200,
    msg: "成功获取我的曲库",
    data: musicList,
  });
});

export { musicRoutes };
