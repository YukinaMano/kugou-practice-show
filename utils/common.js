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

/**
 * 防抖函数：在事件停止触发一段时间后才执行回调
 * @param {Function} fn - 需要防抖执行的函数
 * @param {number} [delay=500] - 延迟时间（毫秒），默认 500ms
 * @returns {Function} 包装后的防抖函数
 * @example
 * element.addEventListener('click', debounce(handleClick, 500));
 */
export function debounce(fn, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数：在固定时间间隔内只执行一次回调
 * @param {Function} fn - 需要节流执行的函数
 * @param {number} [interval=1000] - 时间间隔（毫秒），默认 1000ms
 * @returns {Function} 包装后的节流函数
 * @example
 * element.addEventListener('click', throttle(handleClick, 1000));
 */
export function throttle(fn, interval = 1000) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime > interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
