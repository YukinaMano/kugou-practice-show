import { makeHashKey } from "@/utils/common.js";

const key1 = makeHashKey({ username: 'test', password: '123' })
const key2 = makeHashKey({ username: 'scholar', password: '456' })

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
    toekn: key2
  }
};

const basePath = '/mock/assest/'
export const musicList = [
  {
    mId: 1,
    mTitle: '鱼玄机',
    mSinger: 'hanser',
    mPictureUrl: `${basePath}1.jpg`,
    mMusicUrl: `${basePath}hanser - 鱼玄机.ogg`,
    mLyricUrl: `${basePath}hanser - 鱼玄机.lrc`
  },
  {
    mId: 2,
    mTitle: 'アイシテ (爱我吧)',
    mSinger: 'とあ (toa)',
    mPictureUrl: `${basePath}2.png`,
    mMusicUrl: `${basePath}とあ (toa) _ nameless - アイシテ (爱我吧).ogg`,
    mLyricUrl: `${basePath}とあ (toa) _ nameless - アイシテ (爱我吧).lrc`
  },
  {
    mId: 3,
    mTitle: '心拍数#0822',
    mSinger: '鹿乃 (かの)',
    mPictureUrl: `${basePath}3.jpg`,
    mMusicUrl: `${basePath}鹿乃 (かの) - 心拍数#0822.ogg`,
    mLyricUrl: `${basePath}鹿乃 (かの) - 心拍数#0822.lrc`
  },
  {
    mId: 4,
    mTitle: '少年诗',
    mSinger: '米白',
    mPictureUrl: `${basePath}4.jpg`,
    mMusicUrl: `${basePath}米白 - 少年诗.ogg`,
    mLyricUrl: `${basePath}米白 - 少年诗.lrc`
  },
  {
    mId: 5,
    mTitle: '乐园游梦记',
    mSinger: '耀佳音',
    mPictureUrl: `${basePath}5.jpg`,
    mMusicUrl: `${basePath}三Z-STUDIO _ HOYO-MiX - 乐园游梦记.flac`,
    mLyricUrl: `${basePath}三Z-STUDIO _ HOYO-MiX - 乐园游梦记.lrc`
  },
  {
    mId: 6,
    mTitle: '在银河中孤独摇摆',
    mSinger: '知更鸟',
    mPictureUrl: `${basePath}6.jpg`,
    mMusicUrl: `${basePath}知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.ogg`,
    mLyricUrl: `${basePath}知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.lrc`
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