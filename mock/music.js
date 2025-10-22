// mock/music.js
import Mock from 'mockjs'
import { playlist, musicList, tokenManager } from './_showdata.js'

export const getMyList = ({ key }) => {
  console.debug('[Mock] getMyList 收到 access_token:', key)
  const refreshToken = tokenManager.getRefreshToken(key)
  if (refreshToken) {
    return {
      code: 200,
      msg: '成功获取我的歌单',
      data: playlist[refreshToken] // 直接返回 value
    }
  }
  return { code: 401, msg: '用户信息错误', data: null }
}

export const getAllList = ({ key }) => {
  return {
    code: 200,
    msg: '成功获取我的曲库',
    data: musicList
  }
}
