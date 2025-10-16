// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    uni(),
    viteMockServe({
      mockPath: 'mock', // mock 文件存放目录
      localEnabled: true, // 开发环境启用 mock
      prodEnabled: false, // 生产环境禁用
      logger: true, // 控制台打印请求日志
      supportTs: false, // 如果用 js 写 mock，设为 false
    }),
  ],
})
