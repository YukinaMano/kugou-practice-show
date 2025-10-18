// mock/music.js
import Mock from 'mockjs'
import { makeHashKey } from "@/utils/common.js";
import { playlist, musicList } from './_showdata.js'

export const getMyList = ({ key }) => {
  if (key in playlist) {
    return {
      code: 200,
      msg: '成功获取我的歌单',
      data: playlist[key] // 直接返回 value
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
