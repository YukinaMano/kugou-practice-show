import { makeHashKey } from "@/utils/common.js";
import { __ASSET_REMOTE_URL__ } from "@/config.js";
const key1 = makeHashKey({ username: "test", password: "123" });
const key2 = makeHashKey({ username: "scholar", password: "456" });

export const tokenManager = {
  mapTokenAccessToRefresh: {},
  mapTokenRefreshToAccess: {},

  /**
   * 初始化 tokenManager，从 sessionStorage 恢复映射表
   */
  init() {
    const localMapTokenAccessToRefresh = uni.getStorageSync(
      "mapTokenAccessToRefresh"
    );
    const localMapTokenRefreshToAccess = uni.getStorageSync(
      "mapTokenRefreshToAccess"
    );
    if (localMapTokenAccessToRefresh) {
      this.mapTokenAccessToRefresh = localMapTokenAccessToRefresh;
    }
    if (localMapTokenRefreshToAccess) {
      this.mapTokenRefreshToAccess = localMapTokenRefreshToAccess;
    }
    console.debug("[Mock] tokenManager 已从 sessionStorage 恢复映射表");
  },

  /**
   * 设置映射，并持久化到 sessionStorage
   * @param {string} accessToken - 访问令牌
   * @param {string} refreshToken - 刷新令牌
   */
  setMapAccessToRefresh(accessToken, refreshToken) {
    this.mapTokenAccessToRefresh[accessToken] = refreshToken;
    this.mapTokenRefreshToAccess[refreshToken] = accessToken;
    this.save(); // 每次写入都同步保存
  },

  /**
   * 通过 access_token 获取 refresh_token
   * @param {string} accessToken - 访问令牌
   * @returns {string|null} 刷新令牌或 null
   */
  getRefreshToken(accessToken) {
    const refreshToken = this.mapTokenAccessToRefresh[accessToken];
    console.debug(
      "[Mock] tokenManager 将 access_token 转换为 refresh_token:",
      refreshToken
    );
    return refreshToken;
  },

  /**
   * 检查 refresh_token 是否存在
   * @param {string} refreshToken - 刷新令牌
   * @returns {boolean} 是否存在
   */
  checkRefreshToken(refreshToken) {
    return refreshToken in this.mapTokenRefreshToAccess;
  },

  /**
   * 保存当前映射到 sessionStorage
   */
  save() {
    uni.setStorageSync("mapTokenAccessToRefresh", this.mapTokenAccessToRefresh);
    uni.setStorageSync("mapTokenRefreshToAccess", this.mapTokenRefreshToAccess);
  },

  /**
   * 清除映射和存储
   */
  clear() {
    this.mapTokenAccessToRefresh = {};
    this.mapTokenRefreshToAccess = {};
    uni.removeStorageSync("mapTokenAccessToRefresh");
    uni.removeStorageSync("mapTokenRefreshToAccess");
    console.debug("[Mock] tokenManager 已清空映射表");
  },
};

export const users = {
  data: {
    [key1]: {
      id: 1,
      username: "test",
      password: "123",
      refresh_token: key1,
    },
    [key2]: {
      id: 2,
      username: "scholar",
      password: "456",
      refresh_token: key2,
    },
  },
  checkPassword(username, password) {
    const key = makeHashKey({ username, password });
    if (!(key in this.data)) {
      console.warn("[Mock] ⚠️ 用户名或密码错误");
      return false;
    }
    if (this.data[key].password !== password) {
      console.warn("[Mock] ⚠️ 密码校验未通过");
      return false;
    }
    return true;
  },
  getRefreshToken(username, password) {
    const key = makeHashKey({ username, password });
    if (!this.checkPassword(username, password)) {
      return null;
    }
    return this.data[key].refresh_token;
  },
};

/**
 * 统一静态资源路径（兼容 App / H5 / 小程序）
 * - static 下的文件会自动打包到各端
 * - H5：访问路径 /static/mock-data/
 * - App / 小程序：自动映射到本地资源路径
 */
// 所有路径直接拼接文件名，不再使用 import.meta.url
// export const musicList = [
//   {
//     mId: 1,
//     mTitle: "鱼玄机",
//     mSinger: "hanser",
//     mPictureUrl: basePath + "1.jpg",
//     mMusicUrl: basePath + "hanser - 鱼玄机.ogg",
//     mLyricUrl: basePath + "hanser - 鱼玄机.lrc",
//   },
//   {
//     mId: 2,
//     mTitle: "アイシテ (爱我吧)",
//     mSinger: "とあ (toa)",
//     mPictureUrl: basePath + "2.png",
//     mMusicUrl: basePath + "とあ (toa) _ nameless - アイシテ (爱我吧).ogg",
//     mLyricUrl: basePath + "とあ (toa) _ nameless - アイシテ (爱我吧).lrc",
//   },
//   {
//     mId: 3,
//     mTitle: "打上花火",
//     mSinger: "Daoko (ダヲコ)",
//     mPictureUrl: basePath + "3.jpg",
//     mMusicUrl: basePath + "Daoko (ダヲコ) _ 米津玄師 (よねづ けんし) - 打上花火.ogg",
//     mLyricUrl: basePath + "Daoko (ダヲコ) _ 米津玄師 (よねづ けんし) - 打上花火.lrc",
//   },
//   {
//     mId: 4,
//     mTitle: "少年诗",
//     mSinger: "米白",
//     mPictureUrl: basePath + "4.jpg",
//     mMusicUrl: basePath + "米白 - 少年诗.ogg",
//     mLyricUrl: basePath + "米白 - 少年诗.lrc",
//   },
//   {
//     mId: 5,
//     mTitle: "乐园游梦记",
//     mSinger: "耀佳音",
//     mPictureUrl: basePath + "5.jpg",
//     mMusicUrl: basePath + "三Z-STUDIO _ HOYO-MiX - 乐园游梦记.flac",
//     mLyricUrl: basePath + "三Z-STUDIO _ HOYO-MiX - 乐园游梦记.lrc",
//   },
//   {
//     mId: 6,
//     mTitle: "在银河中孤独摇摆",
//     mSinger: "知更鸟",
//     mPictureUrl: basePath + "6.jpg",
//     mMusicUrl: basePath + "知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.ogg",
//     mLyricUrl: basePath + "知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.lrc",
//   },
// ];
const assetUrl = __ASSET_REMOTE_URL__;
const remoteUrl = __ASSET_REMOTE_URL__;
export const musicList = [
  {
    mId: 1,
    mTitle: "鱼玄机",
    mSinger: "hanser",
    mPictureUrl: assetUrl + "1.jpg",
    mMusicUrl: assetUrl + "hanser%20-%20%E9%B1%BC%E7%8E%84%E6%9C%BA.ogg",
    mLyricUrl: remoteUrl + "hanser%20-%20%E9%B1%BC%E7%8E%84%E6%9C%BA.lrc",
  },
  {
    mId: 2,
    mTitle: "アイシテ (爱我吧)",
    mSinger: "とあ (toa)",
    mPictureUrl: assetUrl + "2.png",
    mMusicUrl:
      assetUrl +
      "%E3%81%A8%E3%81%82%20%28toa%29%20_%20nameless%20-%20%E3%82%A2%E3%82%A4%E3%82%B7%E3%83%86%20%28%E7%88%B1%E6%88%91%E5%90%A7%29.ogg",
    mLyricUrl:
      remoteUrl +
      "%E3%81%A8%E3%81%82%20%28toa%29%20_%20nameless%20-%20%E3%82%A2%E3%82%A4%E3%82%B7%E3%83%86%20%28%E7%88%B1%E6%88%91%E5%90%A7%29.lrc",
  },
  {
    mId: 3,
    mTitle: "打上花火",
    mSinger: "Daoko (ダヲコ)",
    mPictureUrl: assetUrl + "3.jpg",
    mMusicUrl:
      assetUrl +
      "Daoko%20%28%E3%83%80%E3%83%B2%E3%82%B3%29%20_%20%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB%20%28%E3%82%88%E3%81%AD%E3%81%A5%20%E3%81%91%E3%82%93%E3%81%97%29%20-%20%E6%89%93%E4%B8%8A%E8%8A%B1%E7%81%AB.ogg",
    mLyricUrl:
      remoteUrl +
      "Daoko%20%28%E3%83%80%E3%83%B2%E3%82%B3%29%20_%20%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB%20%28%E3%82%88%E3%81%AD%E3%81%A5%20%E3%81%91%E3%82%93%E3%81%97%29%20-%20%E6%89%93%E4%B8%8A%E8%8A%B1%E7%81%AB.lrc",
  },
  {
    mId: 4,
    mTitle: "少年诗",
    mSinger: "米白",
    mPictureUrl: assetUrl + "4.jpg",
    mMusicUrl: assetUrl + "米白%20-%20%E5%B0%8F%E5%91%A8%E8%8B%B1%E8%AF%9D.ogg",
    mLyricUrl:
      remoteUrl + "米白%20-%20%E5%B0%8F%E5%91%A8%E8%8B%B1%E8%AF%9D.lrc",
  },
  {
    mId: 5,
    mTitle: "乐园游梦记",
    mSinger: "耀佳音",
    mPictureUrl: assetUrl + "5.jpg",
    mMusicUrl: assetUrl + "%E4%B9%90%E5%9B%AD%E6%B8%B8%E6%A2%A6%E8%AE%B0.flac",
    mLyricUrl: remoteUrl + "%E4%B9%90%E5%9B%AD%E6%B8%B8%E6%A2%A6%E8%AE%B0.lrc",
  },
  {
    mId: 6,
    mTitle: "在银河中孤独摇摆",
    mSinger: "知更鸟",
    mPictureUrl: assetUrl + "6.jpg",
    mMusicUrl:
      assetUrl +
      "%E5%9C%A8%E9%93%B6%E6%B2%B3%E4%B8%AD%E5%AD%A4%E7%8B%AC%E6%91%87%E6%91%86.ogg",
    mLyricUrl:
      remoteUrl +
      "%E5%9C%A8%E9%93%B6%E6%B2%B3%E4%B8%AD%E5%AD%A4%E7%8B%AC%E6%91%87%E6%91%86.lrc",
  },
];

// 不变的播放列表映射
export const playlist = {
  [key1]: [musicList[0], musicList[1], musicList[2]],
  [key2]: [musicList[1], musicList[3], musicList[5]],
};
