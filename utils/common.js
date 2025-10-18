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

/**
 * 判断当前 window 是否运行在 App 环境（如 WebView 或混合应用）
 * 支持三种检测方式：UA 检测、窗口尺寸检测、综合检测
 * @param {'ua'|'size'|'auto'} [mode='auto'] - 检测模式：
 *   'ua'：仅使用 userAgent；
 *   'size'：仅使用窗口高宽比；
 *   'auto'：两者结合（默认）。
 * @param {string[]} [extraUA=[]] - 自定义 UA 关键字列表，例如 ['myapp', 'hybridapp']
 * @param {{ maxWidth?: number, minRatio?: number }} [sizeRule={}] - 自定义尺寸阈值：
 *   maxWidth：最大宽度（默认 800px 以下认为是移动或 App 环境）
 *   minRatio：最小高宽比（默认 >1.5 认为是竖屏移动设备）
 * @returns {boolean} true 表示可能运行在 App 环境，false 表示普通浏览器环境
 * @example
 * // 默认使用自动模式（UA + 尺寸综合判断）
 * if (isAppEnv()) console.log('App 环境');
 *
 * // 仅通过 UA 判断（并增加自定义 UA 标识）
 * isAppEnv('ua', ['myapp'])
 *
 * // 仅通过尺寸判断（自定义阈值）
 * isAppEnv('size', [], { maxWidth: 900, minRatio: 1.6 })
 */
export function isAppEnv(mode = 'auto', extraUA = [], sizeRule = {}) {
  // window 不存在（如 SSR 或小程序环境）直接返回 false
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    console.error('未检测到浏览器环境')
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  const { maxWidth = 800, minRatio = 1.5 } = sizeRule;

  // ====== 方式一：UA 检测 ======
  const baseUAKeywords = [
    'uniapp',      // DCloud App
    'html5plus',   // App-Plus 内核
    'cordova',     // Cordova
    'wv',          // Android WebView
    'version/',    // Android Chrome WebView
    'crios',       // iOS Chrome WebView
    'fxios',       // iOS Firefox
    'iphone.*safari/', // iOS Safari 内嵌
    ...extraUA.map(k => k.toLowerCase()), // 追加自定义 UA 关键字
  ];

  const isAppUA = baseUAKeywords.some(keyword => new RegExp(keyword).test(ua));

  // ====== 方式二：窗口尺寸检测 ======
  const ratio = window.innerHeight / window.innerWidth;
  const isAppSize = ratio > minRatio && window.innerWidth < maxWidth;

  // ====== 综合判断 ======
  let res = false;
  let navRegSelector = {
    'ua': isAppUA,
    'size': isAppSize,
    'auto': isAppUA || isAppSize
  };
  res = navRegSelector[mode];
  if(res) {
    console.debug(`@${mode}识别#> h5运行在移动端`)
  } else {
    console.debug(`@${mode}识别#> h5运行在桌面端`)
  }
  return res;
}
