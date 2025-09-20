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
