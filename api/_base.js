// src/utils/_base.js
import axios from 'axios'

// 创建 Axios 实例
const service = axios.create({
  baseURL: '\api', // 接口基础地址
  timeout: 5000, // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = uni.getStorageSync('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 可以统一处理状态码
    if (response.data.code !== 200) {
      console.debug({ title: response.data.msg || '请求失败', icon: 'none' })
      return Promise.reject(response.data)
    }
    return response.data
  },
  error => {
    console.debug({ title: error.message || '网络错误', icon: 'none' })
    return Promise.reject(error)
  }
)

export default service
