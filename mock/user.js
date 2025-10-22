// mock/user.js
import Mock from 'mockjs'
import { users, tokenManager } from './_showdata.js'

export const login = ({ username, password }) => {
  // 验证账户密码
  const refreshToken = users.getRefreshToken(username, password)
  if (refreshToken) {
    // 生成 token
    const accessToken = "access_" + Date.now()
    tokenManager.setMapAccessToRefresh(accessToken, refreshToken)
    // 返回请求
    return {
      code: 200,
      msg: '登录成功',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        callback: 'null'
      }
      // Mock.mock({
      //   id: '@id',
      //   name: '@cname',
      //   token: '@guid',
      // }),
    }
  }
  return { code: 401, msg: '用户名或密码错误', data: null }
}
export const refresh = ({ refresh_token }) => {
  // 验证 refresh_token
  if (tokenManager.checkRefreshToken(refresh_token)) {
    // 生成 token
    const accessToken = "access_" + Date.now()
    tokenManager.setMapAccessToRefresh(accessToken, refresh_token)
    // 返回请求
    return {
      code: 200,
      msg: '刷新成功',
      data: {
        access_token: accessToken,
        callback: 'null'
      }
    }
  }
  return { code: 401, msg: `refresh_token 错误: ${refresh_token}`, data: null }
}

export const register = ({ username, password }) => {
  return {
    code: 200,
    msg: '注册成功',
    data: {
      uid: Mock.Random.guid(),
      username,
    },
  }
}
