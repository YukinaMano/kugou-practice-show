import * as user from './user.js'
import * as music from './music.js'

export const api = {
  fetch: {
    user,
    music,
  },

  tokenProvider: {
    getAccessToken: null,
    getRefreshToken: null,
    updateAccessToken: null,
  },

  init(provider) {
    this.tokenProvider = {
      getAccessToken: provider.getAccessToken,
      getRefreshToken: provider.getRefreshToken,
      updateAccessToken: provider.updateAccessToken,
    }
    console.debug('[api] 初始化完成，已注入 TokenProvider')
  },

  async request(apiFn, payload = {}) {
    try {
      let accessToken = this.tokenProvider.getAccessToken?.()
      if (!accessToken) {
        console.warn('[api] ⚠️ access_token 不存在，启动 refresh 流程')
        accessToken = await this.refreshTokenFlow()
        if (!accessToken) throw new Error('无法刷新 access_token，请重新登录')
      } else {
        console.debug('[api] 🔑 已存在有效 access_token')
      }

      uni.setStorageSync('access_token', accessToken)

      const res = await apiFn(payload)

      const newToken = res?.data?.access_token
      if (newToken && this.tokenProvider.updateAccessToken) {
        this.tokenProvider.updateAccessToken(newToken)
        uni.setStorageSync('access_token', newToken)
      }

      return res
    } catch (err) {
      console.error('[api] ❌ 请求失败：', err)
      throw err
    }
  },

  async refreshTokenFlow() {
    const refreshToken = this.tokenProvider.getRefreshToken?.()
    if (!refreshToken) {
      console.warn('[api] ⚠️ 无 refresh_token，无法刷新')
      return null
    }

    console.debug('[api] 🔄 正在刷新 access_token...')

    try {
      const res = await this.fetch.user.refresh({ refresh_token: refreshToken })

      if (res.code === 200 && res.data?.access_token) {
        const newAccess = res.data.access_token
        this.tokenProvider.updateAccessToken?.(newAccess)
        uni.setStorageSync('access_token', newAccess)
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

  isTokenExpired(token) {
    try {
      const [, payloadBase64] = token.split('.')
      const payload = JSON.parse(atob(payloadBase64))
      return payload.exp * 1000 < Date.now()
    } catch {
      return false
    }
  },
}
