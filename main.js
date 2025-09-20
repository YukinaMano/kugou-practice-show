// main.js 或 main.ts
import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'
import { MusicPlayer } from "utils/music-player.js"

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.provide('audio', new MusicPlayer())
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
export function createApp() {
  const app = createSSRApp(App)
  if (import.meta.env.MODE === 'development') {
    import('@/mock/index.js').then(() => {
      console.log('Mock 模拟接口已启用')
    })
  }
  app.use(createPinia())
  return {
    app
  }
}
// #endif