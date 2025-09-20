// src/api/music.js
import request from './_base.js'

export const getMyList = async ({ key }) => {
  try {
    const res = await request.get('/music/mylist', {
      params: {
        key
      }
    })
    return res
  } catch (err) {
    console.error('获取歌单失败', err)
    throw err
  }
}

export const getAllList = async ({ key }) => {
  try {
    const res = await request.get('/music/alllist', {
      key
    })
    return res
  } catch (err) {
    console.error('获取曲库失败', err)
    throw err
  }
}