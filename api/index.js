import * as user from './user.js'
import * as music from './music.js'
import mockApi from '@/mock'

export const api = {
  fetch: {
    user,
    music,
  },

  // 控制当前是否走本地伪装接口
  isOffline: true, // 默认为在线模式
  mockApi: mockApi,
  realApi: {},
  /**
   * token调度入口，在 Vue 层注入具体实现
   * 包括 access_token 获取、刷新等逻辑
   */
  tokenProvider: {
    getAccessToken: null,   // ()=>string
    getRefreshToken: null,  // ()=>string
    updateAccessToken: null // (token:string)=>void
  },

  init(provider) {
    this.tokenProvider = provider
    this.realApi = { ...this.fetch }
    this.checkApi()
    console.debug('[api] 初始化完成，已注入 TokenProvider')
  },
  setMockApi(mock) {
    this.mockApi = mock
    console.debug('[api] 已设置自定义 Mock 接口')
  },
  checkApi() {
    this.fetch = this.isOffline ? this.mockApi : this.realApi
    if (!this.fetch) {
      console.error('[api] ⚠️ 未设置可用的 API 模块')
      return {}
    }
    console.debug(`[api] 🔁 已切换至 ${this.isOffline ? '离线' : '在线'} 模式`, this.fetch)
  },
  setOffline(value) {
    this.isOffline = !!value
    this.checkApi()
    console.debug(`[api] 已切换为 ${this.isOffline ? '离线(本地)' : '在线(网络)'} 模式`)
  },


  /**
   * 统一请求入口，自动处理 access_token 刷新逻辑
   * @param {Function} apiFn - 具体的 API 函数，如 user.login
   * @param {Object} payload - 请求参数，包含必要的 key 字段
   * @returns {Promise} - API 调用结果
   */
  async request(apiFn, payload = {}) {
    try {
      // 1️⃣ 取出 access_token
      let accessToken = this.tokenProvider.getAccessToken?.()
      // 2️⃣ 检查是否缺失或过期
      // if (!accessToken || this.isTokenExpired?.(accessToken)) {
      if (!accessToken) {
        console.warn('[api] ⚠️ access_token 不存在或已过期，启动 refresh 流程')
        accessToken = await this.refreshTokenFlow()
        if (!accessToken) throw new Error('无法刷新 access_token，请重新登录')
      } else {
        console.debug('[api] 🔑 已存在有效 access_token，无需刷新')
      }

      // 3️⃣ 附加 access_token 到请求数据中
      const reqData = { ...payload, key: accessToken }

      // 4️⃣ 发出真实请求
      const res = await apiFn(reqData)

      // 5️⃣ 如果返回中带新 token，则更新
      if (res.data?.access_token && this.tokenProvider.updateAccessToken) {
        this.tokenProvider.updateAccessToken(res.data.access_token)
      }

      return res
    } catch (err) {
      console.error('[api] ❌ 请求失败：', err)
      throw err
    }
  },

  /**
   * ✅ 刷新 access_token 流程
   * 通过 refresh_token 获取新的 access_token
   */
  async refreshTokenFlow() {
    const refreshToken = this.tokenProvider.getRefreshToken?.()
    if (!refreshToken) {
      console.warn('[api] ⚠️ 无 refresh_token，无法刷新')
      return null
    }

    console.debug('[api] 🔄 正在刷新 access_token...')

    try {
      const res = await this.fetch.user.refresh({
        refresh_token: refreshToken,
        refresh: true
      })

      if (res.code === 200 && res.data?.access_token) {
        const newAccess = res.data.access_token
        this.tokenProvider.updateAccessToken?.(newAccess)
        console.debug('[api] ✅ 刷新成功，已更新 access_token')
        return newAccess
      } else {
        console.warn('[api] ⚠️ 刷新失败：', res.msg)
        return null
      }
    } catch (err) {
      console.error('[api] ❌ 刷新请求异常：', err)
      return null
    }
  },

  /**
   * （可选）判断 token 是否过期
   * 如果是 JWT，可通过 exp 字段判断
   */
  isTokenExpired(token) {
    try {
      const [, payloadBase64] = token.split('.')
      const payload = JSON.parse(atob(payloadBase64))
      return payload.exp * 1000 < Date.now()
    } catch {
      return false
    }
  }
}
