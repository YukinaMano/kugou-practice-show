<script>
import { isAppEnv } from '@/utils/common.js'
import { api } from '@/api'
import { localUserInfo } from '@/stores/localuser.js'

export default {
  onLaunch: function() {
    console.debug('App Launch')
    const localuser = localUserInfo()
    api.init({
      getAccessToken: () => localuser.access_token,
      setAccessToken: (token) => localuser.updateAccessToken(token),
      getRefreshToken: () => uni.getStorageSync('refresh_token'),
    })
    // #ifdef H5
    if (!isAppEnv('ua')) {
      // 桌面端 → 模拟移动端效果
      this.simulateMobileViewport()
    }
    // #endif
  },
		onShow: function() {
			console.debug('App Show')
		},
		onHide: function() {
			console.debug('App Hide')
		},
    methods: {
      simulateMobileViewport() {
        // 清除已有模拟容器，避免重复插入
        const existingWrapper = document.getElementById('mock-mobile-wrapper')
        if (existingWrapper) existingWrapper.remove()

        // 计算媒体屏幕尺寸
        const screenW = window.innerWidth
        const screenH = window.innerHeight

        // 设置上下 margin 与最大高度
        const margin = 10
        const maxHeight = 844 // iPhone 14 屏幕高度（px）
        const maxWidth = 390  // iPhone 14 屏幕宽度（px）

        // 如果屏幕太矮，就减去 margin 作为最小高度
        const mockHeight = Math.min(screenH - margin * 2, maxHeight)
        const mockWidth = maxWidth
        document.documentElement.style.setProperty('--main-height', `${mockHeight}px`)

        // 创建外层容器（模拟手机）
        const wrapper = document.createElement('div')
        wrapper.id = 'mock-mobile-wrapper'
        Object.assign(wrapper.style, {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${mockWidth}px`, // iPhone 14 宽度
          height: `${mockHeight}px`,
          backgroundColor: '#fff',
          borderRadius: '24px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          zIndex: '9999',
          transition: 'all 0.3s ease',
        })

        // 创建内部内容容器（原页面内容）
        const inner = document.createElement('div')
        inner.id = 'mock-mobile-content'

        // 把原 body 内容移入 inner 容器
        while (document.body.firstChild) {
          inner.appendChild(document.body.firstChild)
        }

        // 设置 body 背景（灰色外部遮罩效果）
        document.body.style.background = '#f8f8f8'
        document.body.style.margin = '0'
        document.body.style.padding = '0'
        document.body.style.overflow = 'hidden' // 防止外层滚动

        // 组装结构
        document.body.appendChild(wrapper)
        wrapper.appendChild(inner)

        // 内部内容样式自适应
        Object.assign(inner.style, {
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        })

        // 控制台输出调试信息
        console.debug(
          `[simulateMobileViewport] 模拟设备尺寸: ${mockWidth}x${mockHeight} (屏幕 ${screenW}x${screenH})`
        )
      }
    }
	}
</script>

<style lang="scss">
/*每个页面公共css */
$status-bar-height: 60px;
$content-padding: 0 0 18px 0;
$base-font-color: #FFFFFF;
$base-font-size: 16px;
$tips-font-size: 12.8px;
$base-font-family: '华文楷体';

:root {
  --main-height: 100vh;
}

// #mock-mobile-wrapper::before {
//   content: '';
//   display: block;
//   position: absolute;
//   top: 8px;
//   left: 50%;
//   transform: translateX(-50%);
//   width: 60px;
//   height: 6px;
//   border-radius: 3px;
//   background: #ccc;
//   opacity: 0.8;
// }

.main {
  color: $base-font-color;
  font-size: $base-font-size;
  font-family: $base-font-family;
}
.status-bar {
  height: $status-bar-height;
}
.content {
  box-sizing: border-box;
  height: calc(var(--main-height) - $status-bar-height);
  padding: $content-padding;
  display: flex;
  flex-direction: column;

  &-top {
    // padding: 18px 0 0 0;
  }
  &-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  &-bottom {
    // padding: 0 0 18px 0;
  }
}
.round-text {
  border: 1px solid;
  border-radius: 5px;
  padding: 0px 3px;
}
// 专辑封面旋转效果
@-webkit-keyframes rotation{
  from{transform: rotate(0deg);}
  to{transform: rotate(360deg);}
}
@keyframes rotation {
  from{transform: rotate(0deg);}
  to{transform: rotate(360deg);}
}
.anplay {
  animation: rotation 8s infinite linear;
}
.anpause {
  animation-play-state: paused;
}
// 文字走马灯效果
.marquee {
  width: 80%;
  overflow: hidden;
  white-space: nowrap;

  span {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 10s linear infinite;
  }
}
@-webkit-keyframes scroll-left {
  0% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  100% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
}
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
