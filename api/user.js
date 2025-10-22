// src/api/user.js
import request from './_base.js'

/**
 * 用户登录接口
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<Object>} 返回接口响应对象
 */
export const login = async ({ username, password }) => {
  try {
    const res = await request.post('/users/login', {
      username,
      password
    })
    return res
  } catch (err) {
    console.error('登录失败', err)
    throw err
  }
}

export const refresh = async (refreshToken) => {
  try {
    const res = await request.post('/users/refresh', {
      refresh_token: refreshToken
    })
    return res
  } catch (err) {
    console.error('刷新Token失败', err)
    throw err
  }
}

/**
 * 用户注册接口
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<Object>} 返回接口响应对象
 */
export const register = async ({ username, password }) => {
  try {
    const res = await request.post('/users/login', {
      username,
      password
    })
    return res
  } catch (err) {
    console.error('注册失败', err)
    throw err
  }
}