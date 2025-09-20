// mock/music.js
import Mock from 'mockjs'
import { makeHashKey } from "@/utils/common.js";
import { playlist, musicList } from './showdata.js'

/**
 * 用户相关接口模拟
 */

// 登录接口
Mock.mock(/api\/music\/mylist/, 'get', (options) => {
  console.log(options.url)
  const query = new URLSearchParams(options.url.split('?')[1] || '')
  const key = query.get('key');
  if (playlist[key]) {
    return {
      code: 200,
      msg: '成功获取我的歌单',
      data: playlist[key] // 直接返回 value
    }
  } else {
    console.log(key)
    return {
      code: 401,
      msg: '用户信息错误',
      data: null
    }
  }
})

// 注册接口
Mock.mock('api/music/alllist', 'get', (options) => {

  // 简单示例，直接返回成功
  return {
    code: 200,
    msg: '成功获取我的曲库',
    data: musicList
  }
})

export default Mock
