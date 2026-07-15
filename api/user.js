import request from './_base.js'

export const login = async ({ username, password }) => {
  try {
    const res = await request.post('/users/login', { username, password })
    return res
  } catch (err) {
    console.error('登录失败', err)
    throw err
  }
}

export const refresh = async ({ refresh_token }) => {
  try {
    const res = await request.post('/users/refresh', { refresh_token })
    return res
  } catch (err) {
    console.error('刷新Token失败', err)
    throw err
  }
}

export const register = async ({ username, password }) => {
  try {
    const res = await request.post('/users/register', { username, password })
    return res
  } catch (err) {
    console.error('注册失败', err)
    throw err
  }
}
