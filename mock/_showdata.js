import { makeHashKey } from "@/utils/common.js";

const key1 = makeHashKey({ username: "scholar", password: "456" });
const key2 = makeHashKey({ username: "test", password: "123" });

export const users = {
  [key1]: {
    id: 1,
    username: "test",
    password: "123",
    token: key1,
  },
  [key2]: {
    id: 2,
    username: "scholar",
    password: "456",
    token: key2,
  },
};

/**
 * 统一静态资源路径（兼容 App / H5 / 小程序）
 * - static 下的文件会自动打包到各端
 * - H5：访问路径 /static/mock-data/
 * - App / 小程序：自动映射到本地资源路径
 */
const basePath = "/static/mock-data/";

// 所有路径直接拼接文件名，不再使用 import.meta.url
export const musicList = [
  {
    mId: 1,
    mTitle: "鱼玄机",
    mSinger: "hanser",
    mPictureUrl: basePath + "1.jpg",
    mMusicUrl: basePath + "hanser - 鱼玄机.ogg",
    mLyricUrl: basePath + "hanser - 鱼玄机.lrc",
  },
  {
    mId: 2,
    mTitle: "アイシテ (爱我吧)",
    mSinger: "とあ (toa)",
    mPictureUrl: basePath + "2.png",
    mMusicUrl: basePath + "とあ (toa) _ nameless - アイシテ (爱我吧).ogg",
    mLyricUrl: basePath + "とあ (toa) _ nameless - アイシテ (爱我吧).lrc",
  },
  {
    mId: 3,
    mTitle: "打上花火",
    mSinger: "Daoko (ダヲコ)",
    mPictureUrl: basePath + "3.jpg",
    mMusicUrl: basePath + "Daoko (ダヲコ) _ 米津玄師 (よねづ けんし) - 打上花火.ogg",
    mLyricUrl: basePath + "Daoko (ダヲコ) _ 米津玄師 (よねづ けんし) - 打上花火.lrc",
  },
  {
    mId: 4,
    mTitle: "少年诗",
    mSinger: "米白",
    mPictureUrl: basePath + "4.jpg",
    mMusicUrl: basePath + "米白 - 少年诗.ogg",
    mLyricUrl: basePath + "米白 - 少年诗.lrc",
  },
  {
    mId: 5,
    mTitle: "乐园游梦记",
    mSinger: "耀佳音",
    mPictureUrl: basePath + "5.jpg",
    mMusicUrl: basePath + "三Z-STUDIO _ HOYO-MiX - 乐园游梦记.flac",
    mLyricUrl: basePath + "三Z-STUDIO _ HOYO-MiX - 乐园游梦记.lrc",
  },
  {
    mId: 6,
    mTitle: "在银河中孤独摇摆",
    mSinger: "知更鸟",
    mPictureUrl: basePath + "6.jpg",
    mMusicUrl: basePath + "知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.ogg",
    mLyricUrl: basePath + "知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.lrc",
  },
];

// 不变的播放列表映射
export const playlist = {
  [key1]: [musicList[0], musicList[1], musicList[2]],
  [key2]: [musicList[1], musicList[3], musicList[5]],
};
