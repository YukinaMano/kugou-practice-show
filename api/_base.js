const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
const timeout = 5000

function requestInterceptor(config = {}) {
  const token = uni.getStorageSync('access_token')
  const header = { ...config.header }
  if (token) {
    header.Authorization = `Bearer ${token}`
  }
  return { ...config, header }
}

function responseInterceptor(res) {
  if (res.data.code !== 200) {
    console.debug({ title: res.data.msg || '请求失败', icon: 'none' })
    return Promise.reject(res.data)
  }
  return Promise.resolve(res.data)
}

function errorHandler(err) {
  const msg = err?.data?.msg || err?.msg || err?.message || '网络错误'
  console.debug({ title: msg, icon: 'none' })
  return Promise.reject(err)
}

function requestWrapper(method, url, data, config = {}) {
  return new Promise((resolve, reject) => {
    const fullConfig = requestInterceptor(config)
    const requestOptions = {
      url: baseURL + url,
      method: method,
      timeout: timeout,
      header: fullConfig.header,
      data: data,
      success: (res) => {
        responseInterceptor(res).then(resolve).catch(reject)
      },
      fail: (err) => {
        errorHandler(err).catch(reject)
      },
    }
    uni.request(requestOptions)
  })
}

const service = {
  get(url, config) {
    return requestWrapper('GET', url, undefined, config)
  },
  post(url, data, config) {
    return requestWrapper('POST', url, data, config)
  },
}

export default service
