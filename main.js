// main.js 或 main.ts
import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import { MusicPlayer } from '@/utils/music-player.js'
import SvgIcon from '@/components/SvgIcon.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.component('SvgIcon', SvgIcon)
  app.provide('audio', reactive(new MusicPlayer()))
  app.use(createPinia())
  return {
    app
  }
}
// #endif
