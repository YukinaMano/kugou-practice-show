import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
})

service.interceptors.request.use(
  config => {
    const token = uni.getStorageSync('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.data.code !== 200) {
      console.debug({ title: response.data.msg || '请求失败', icon: 'none' })
      return Promise.reject(response.data)
    }
    return response.data
  },
  error => {
    const msg = error?.data?.msg || error?.message || '网络错误'
    console.debug({ title: msg, icon: 'none' })
    return Promise.reject(error)
  }
)

export default service
