import { makeHashKey } from "@/utils/common.js";

const key1 = makeHashKey({ username: 'scholar', password: '456' })
const key2 = makeHashKey({ username: 'test', password: '123' })

export const users = {
  [key1]: {
    id: 1,
    username: 'test',
    password: '123',
    token: key1
  },
  [key2]: {
    id: 2,
    username: 'scholar',
    password: '456',
    token: key2
  }
};

const basePath = '/mock/assets/'

export const musicList = [
  {
    mId: 1,
    mTitle: '鱼玄机',
    mSinger: 'hanser',
    mPictureUrl: new URL(basePath + '1.jpg', import.meta.url).href,
    mMusicUrl: new URL(basePath + 'hanser - 鱼玄机.ogg', import.meta.url).href,
    mLyricUrl: new URL(basePath + 'hanser - 鱼玄机.lrc', import.meta.url).href
  },
  {
    mId: 2,
    mTitle: 'アイシテ (爱我吧)',
    mSinger: 'とあ (toa)',
    mPictureUrl: new URL(basePath + '2.png', import.meta.url).href,
    mMusicUrl: new URL(basePath + 'とあ (toa) _ nameless - アイシテ (爱我吧).ogg', import.meta.url).href,
    mLyricUrl: new URL(basePath + 'とあ (toa) _ nameless - アイシテ (爱我吧).lrc', import.meta.url).href
  },
  {
    mId: 3,
    mTitle: '打上花火',
    mSinger: 'Daoko (ダヲコ)',
    mPictureUrl: new URL(basePath + '3.jpg', import.meta.url).href,
    mMusicUrl: new URL(basePath + 'Daoko (ダヲコ) _ 米津玄師 (よねづ けんし) - 打上花火.ogg', import.meta.url).href,
    mLyricUrl: new URL(basePath + 'Daoko (ダヲコ) _ 米津玄師 (よねづ けんし) - 打上花火.lrc', import.meta.url).href
  },
  {
    mId: 4,
    mTitle: '少年诗',
    mSinger: '米白',
    mPictureUrl: new URL(basePath + '4.jpg', import.meta.url).href,
    mMusicUrl: new URL(basePath + '米白 - 少年诗.ogg', import.meta.url).href,
    mLyricUrl: new URL(basePath + '米白 - 少年诗.lrc', import.meta.url).href
  },
  {
    mId: 5,
    mTitle: '乐园游梦记',
    mSinger: '耀佳音',
    mPictureUrl: new URL(basePath + '5.jpg', import.meta.url).href,
    mMusicUrl: new URL(basePath + '三Z-STUDIO _ HOYO-MiX - 乐园游梦记.flac', import.meta.url).href,
    mLyricUrl: new URL(basePath + '三Z-STUDIO _ HOYO-MiX - 乐园游梦记.lrc', import.meta.url).href
  },
  {
    mId: 6,
    mTitle: '在银河中孤独摇摆',
    mSinger: '知更鸟',
    mPictureUrl: new URL(basePath + '6.jpg', import.meta.url).href,
    mMusicUrl: new URL(basePath + '知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.ogg', import.meta.url).href,
    mLyricUrl: new URL(basePath + '知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.lrc', import.meta.url).href
  }
]



export const playlist = {
  [key1]: [
    musicList[0],
    musicList[1],
    musicList[2]
  ],
  [key2]: [
    musicList[1],
    musicList[3],
    musicList[5]
  ]
};