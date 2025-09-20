// src/utils/debug.js
const isDev = process.env.NODE_ENV === 'development'

/**
 * debugLog - 仅在开发环境下打印信息
 * @param  {...any} args 要打印的内容
 */
export function debugLog(...args) {
  if (isDev) {
    console.log('[DEBUG]', ...args)
  }
}
