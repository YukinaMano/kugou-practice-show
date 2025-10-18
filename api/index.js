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

  init() {
    this.realApi = { ...this.fetch }
    this.checkApi()
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
  }
}
