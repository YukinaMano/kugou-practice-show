const __ASSET_BASE_URL__ = import.meta.env.VITE_ASSET_BASE_URL || "";

const __ASSET_PHOTO_URL__ = __ASSET_BASE_URL__ + "photos/";
const __ASSET_MUSIC_URL__ = __ASSET_BASE_URL__ + "music/";
const __ASSET_LYRIC_URL__ = __ASSET_BASE_URL__ + "lyrics/";

export { __ASSET_BASE_URL__, __ASSET_PHOTO_URL__, __ASSET_MUSIC_URL__, __ASSET_LYRIC_URL__ };
