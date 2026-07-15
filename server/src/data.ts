const ASSET_BASE = "https://pub-05905c867afb43349d9e01121be81586.r2.dev/";
const PHOTO = ASSET_BASE + "photos/";
const MUSIC = ASSET_BASE + "music/";
const LYRIC = ASSET_BASE + "lyrics/";

export interface User {
  id: number;
  username: string;
  password: string;
  refreshToken: string;
}

export interface MusicItem {
  mId: number;
  mTitle: string;
  mSinger: string;
  mPictureUrl: string;
  mMusicUrl: string;
  mLyricUrl: string;
}

export const users: User[] = [
  { id: 1, username: "test", password: "123", refreshToken: "rft_test_hash_key_001" },
  { id: 2, username: "scholar", password: "456", refreshToken: "rft_scholar_hash_key_002" },
];

export const refreshTokenMap: Record<string, number> = {
  "rft_test_hash_key_001": 1,
  "rft_scholar_hash_key_002": 2,
};

export const musicList: MusicItem[] = [
  {
    mId: 1,
    mTitle: "鱼玄机",
    mSinger: "hanser",
    mPictureUrl: PHOTO + "1.jpg",
    mMusicUrl: MUSIC + "hanser%20-%20%E9%B1%BC%E7%8E%84%E6%9C%BA.ogg",
    mLyricUrl: LYRIC + "hanser%20-%20%E9%B1%BC%E7%8E%84%E6%9C%BA.lrc",
  },
  {
    mId: 2,
    mTitle: "アイシテ (爱我吧)",
    mSinger: "とあ (toa)",
    mPictureUrl: PHOTO + "2.png",
    mMusicUrl: MUSIC + "%E3%81%A8%E3%81%82%20%28toa%29%20_%20nameless%20-%20%E3%82%A2%E3%82%A4%E3%82%B7%E3%83%86%20%28%E7%88%B1%E6%88%91%E5%90%A7%29.ogg",
    mLyricUrl: LYRIC + "%E3%81%A8%E3%81%82%20%28toa%29%20_%20nameless%20-%20%E3%82%A2%E3%82%A4%E3%82%B7%E3%83%86%20%28%E7%88%B1%E6%88%91%E5%90%A7%29.lrc",
  },
  {
    mId: 3,
    mTitle: "打上花火",
    mSinger: "Daoko (ダヲコ)",
    mPictureUrl: PHOTO + "3.jpg",
    mMusicUrl: MUSIC + "Daoko%20%28%E3%83%80%E3%83%B2%E3%82%B3%29%20_%20%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB%20%28%E3%82%88%E3%81%AD%E3%81%A5%20%E3%81%91%E3%82%93%E3%81%97%29%20-%20%E6%89%93%E4%B8%8A%E8%8A%B1%E7%81%AB.ogg",
    mLyricUrl: LYRIC + "Daoko%20%28%E3%83%80%E3%83%B2%E3%82%B3%29%20_%20%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB%20%28%E3%82%88%E3%81%AD%E3%81%A5%20%E3%81%91%E3%82%93%E3%81%97%29%20-%20%E6%89%93%E4%B8%8A%E8%8A%B1%E7%81%AB.lrc",
  },
  {
    mId: 4,
    mTitle: "少年诗",
    mSinger: "米白",
    mPictureUrl: PHOTO + "4.jpg",
    mMusicUrl: MUSIC + "%E7%B1%B3%E7%99%BD%20-%20%E5%B0%91%E5%B9%B4%E8%AF%97.ogg",
    mLyricUrl: LYRIC + "%E7%B1%B3%E7%99%BD%20-%20%E5%B0%91%E5%B9%B4%E8%AF%97.lrc",
  },
  {
    mId: 5,
    mTitle: "乐园游梦记",
    mSinger: "耀佳音",
    mPictureUrl: PHOTO + "5.jpg",
    mMusicUrl: MUSIC + "%E4%B9%90%E5%9B%AD%E6%B8%B8%E6%A2%A6%E8%AE%B0.flac",
    mLyricUrl: LYRIC + "%E4%B9%90%E5%9B%AD%E6%B8%B8%E6%A2%A6%E8%AE%B0.lrc",
  },
  {
    mId: 6,
    mTitle: "在银河中孤独摇摆",
    mSinger: "知更鸟",
    mPictureUrl: PHOTO + "6.jpg",
    mMusicUrl: MUSIC + "%E7%9F%A5%E6%9B%B4%E9%B8%9F%20_%20HOYO-MiX%20_%20Chevy%20-%20%E5%9C%A8%E9%93%B6%E6%B2%B3%E4%B8%AD%E5%AD%A4%E7%8B%AC%E6%91%87%E6%91%86.ogg",
    mLyricUrl: LYRIC + "%E7%9F%A5%E6%9B%B4%E9%B8%9F%20_%20HOYO-MiX%20_%20Chevy%20-%20%E5%9C%A8%E9%93%B6%E6%B2%B3%E4%B8%AD%E5%AD%A4%E7%8B%AC%E6%91%87%E6%91%86.lrc",
  },
];

export const playlist: Record<number, MusicItem[]> = {
  1: [musicList[0], musicList[1], musicList[2]],
  2: [musicList[1], musicList[3], musicList[5]],
};
