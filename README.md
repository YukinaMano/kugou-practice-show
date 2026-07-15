# kugou-practice-show

<p align="left">
  <a href="https://kugou-practice-show.yalsoeasy.workers.dev" target="_blank">
    <img src="https://img.shields.io/badge/H5预览-0078E7?style=for-the-badge&logo=googlechrome&logoColor=white" alt="H5预览">
  </a>
  <!-- <a href="https://github.com/yukinamano/kugou-practice-show" target="_blank">
    <img src="https://img.shields.io/badge/源码仓库-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="源码仓库">
  </a>
  <a href="https://www.bilibili.com/" target="_blank">
    <img src="https://img.shields.io/badge/演示视频-ff4081?style=for-the-badge&logo=youtube&logoColor=white" alt="演示视频">
  </a> -->
</p>

仿酷狗音乐练习项目：uni-app（Vue 3）前端 + Hono Mock 后端（Cloudflare Workers），包含登录鉴权（JWT）、歌单、播放器与歌词等页面。

## 技术栈

- **前端**：uni-app (Vue 3) + Pinia + Axios，使用 HBuilderX / Vite 构建
- **后端**：Hono，运行于 Cloudflare Workers，提供用户登录、Token 刷新与音乐数据的 Mock 接口
- **静态资源**：歌曲 / 歌词 / 图片托管于 Cloudflare R2（CDN）

## 目录结构

```
├── pages/            # 页面（login / index / play）
├── api/              # 前端接口封装（axios 实例见 api/_base.js）
├── stores/           # Pinia 状态
├── utils/            # 播放器、工具函数
├── config.js         # 静态资源地址拼接
├── vite.config.js    # 开发代理配置
└── server/           # Hono Mock 后端（Cloudflare Workers）
    ├── src/
    └── wrangler.toml.example
```

## 环境变量

前端（Vite，按模式自动加载）：

| 文件 | 用途 |
|---|---|
| `.env.development` | 开发环境，后端指向 `http://localhost:8787` |
| `.env.production` | 发布环境，后端指向线上 Workers 地址 |
| `.env.example` | 模板 |

| 变量 | 说明 |
|---|---|
| `VITE_API_BASE_URL` | 后端 API 地址（含 `/api` 前缀） |
| `VITE_MOCK_SERVER` | 开发代理目标（vite.config.js） |
| `VITE_ASSET_BASE_URL` | 静态资源 CDN 地址 |

后端（`server/`，均不入库）：

| 文件 | 用途 |
|---|---|
| `wrangler.toml` | 从 `wrangler.toml.example` 复制，配置 `JWT_SECRET` 与 `ALLOWED_ORIGINS` |
| `.dev.vars` | 本地开发密钥，`wrangler dev` 自动加载 |

## 开发

1. 安装依赖：

   ```bash
   npm install
   npm install --prefix server
   ```

2. 准备配置：

   ```bash
   # 复制模板并填写 JWT_SECRET（随机长字符串）与 ALLOWED_ORIGINS
   cp server/wrangler.toml.example server/wrangler.toml
   # 本地密钥
   echo "JWT_SECRET=<同上密钥>" > server/.dev.vars
   ```

3. 启动后端（localhost:8787）：

   ```bash
   npm run serve
   ```

4. 启动前端：使用 HBuilderX 打开项目，运行到浏览器（H5）；开发请求经 vite 代理转发到本地后端。

## 部署

### 后端（Cloudflare Workers）

```bash
cd server
npx wrangler login
npm run deploy
```

部署后确认 `wrangler.toml` 中 `ALLOWED_ORIGINS` 包含前端线上域名，否则跨域请求会被拦截。

### 前端（H5）

1. 确认 `.env.production` 中 `VITE_API_BASE_URL` / `VITE_MOCK_SERVER` 指向线上后端
2. HBuilderX：发行 → 网站-PC Web 或手机 H5，产物输出至 `unpackage/dist/build/web`
3. 将产物部署到任意静态托管（GitHub Pages / Cloudflare Pages 等）

## 安全说明

- `JWT_SECRET` 不入库：`server/wrangler.toml` 与 `server/.dev.vars` 已被 `.gitignore` 排除，仅提交 `wrangler.toml.example` 模板
- 密钥泄露时直接更换新值重新部署即可，旧 token 自动失效，用户重新登录恢复
