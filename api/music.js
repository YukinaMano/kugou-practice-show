import request from './_base.js'

export const getMyList = async () => {
  try {
    const res = await request.get('/music/mylist')
    return res
  } catch (err) {
    console.error('获取歌单失败', err)
    throw err
  }
}

export const getAllList = async () => {
  try {
    const res = await request.get('/music/alllist')
    return res
  } catch (err) {
    console.error('获取曲库失败', err)
    throw err
  }
}
