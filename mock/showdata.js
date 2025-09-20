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

export const musicList = [
  {
  mId: 1,
  mTitle: '鱼玄机',
  mPictureUrl: '@/mock/assest/1.jpg',
  mMusicUrl: '@/mock/assest/hanser - 鱼玄机.ogg',
  mLyricUrl: '@/mock/assest/hanser - 鱼玄机.lrc'
  },
  {
  mId: 2,
  mTitle: 'アイシテ (爱我吧)',
  mPictureUrl: '@/mock/assest/2.png',
  mMusicUrl: '@/mock/assest/とあ (toa) _ nameless - アイシテ (爱我吧).ogg',
  mLyricUrl: '@/mock/assest/とあ (toa) _ nameless - アイシテ (爱我吧).lrc'
  },
  {
  mId: 3,
  mTitle: '心拍数#0822',
  mPictureUrl: '@/mock/assest/3.jpg',
  mMusicUrl: '@/mock/assest/鹿乃 (かの) - 心拍数#0822.ogg',
  mLyricUrl: '@/mock/assest/鹿乃 (かの) - 心拍数#0822.lrc'
  },
  {
  mId: 4,
  mTitle: '少年诗',
  mPictureUrl: '@/mock/assest/4.jpg',
  mMusicUrl: '@/mock/assest/米白 - 少年诗.ogg',
  mLyricUrl: '@/mock/assest/米白 - 少年诗.lrc'
  },
  {
  mId: 5,
  mTitle: '乐园游梦记',
  mPictureUrl: '@/mock/assest/5.jpg',
  mMusicUrl: '@/mock/assest/三Z-STUDIO _ HOYO-MiX - 乐园游梦记.flac',
  mLyricUrl: '@/mock/assest/三Z-STUDIO _ HOYO-MiX - 乐园游梦记.lrc'
  },
  {
  mId: 6,
  mTitle: '在银河中孤独摇摆',
  mPictureUrl: '@/mock/assest/6.jpg',
  mMusicUrl: '@/mock/assest/知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.ogg',
  mLyricUrl: '@/mock/assest/知更鸟 _ HOYO-MiX _ Chevy - 在银河中孤独摇摆.lrc'
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