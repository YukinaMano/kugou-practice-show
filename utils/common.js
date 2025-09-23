import MD5 from "crypto-js/md5";

/**
 * 生成唯一 key（MD5 哈希）
 * @param {Object} obj - 要哈希的对象
 * @returns {string} 哈希字符串
 */
export function makeHashKey(obj) {
  const input = JSON.stringify(obj);
  return MD5(input).toString();
}

/**
 * 将秒数格式化为 mm:ss 形式的时间字符串
 * @param {number} seconds - 秒数（歌曲时长或播放进度）
 * @returns {string} 格式化后的时间字符串，例如 "03:25"
 */
export function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
