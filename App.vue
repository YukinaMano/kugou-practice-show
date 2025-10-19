<script>
import { isAppEnv } from '@/utils/common.js'
import { api } from '@/api'
export default {
		onLaunch: function() {
    console.debug('App Launch')
      api.init()
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
        // 创建外层容器（模拟手机）
        const wrapper = document.createElement('div')
        wrapper.id = 'mock-mobile-wrapper'

        // 设置基本样式
        Object.assign(wrapper.style, {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '390px', // iPhone 14 宽度
          height: '744px', // iPhone 14 高度
          backgroundColor: '#fff',
          borderRadius: '24px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          scrollbarWidth: 'none',       // Firefox 隐藏滚动条
          msOverflowStyle: 'none',      // IE/Edge 隐藏滚动条
          zIndex: '9999',
        })

        // 创建内部内容容器（原页面内容）
        const inner = document.createElement('div')
        inner.id = 'mock-mobile-content'

        // 让原页面内容迁移到新容器中
        while (document.body.firstChild) {
          inner.appendChild(document.body.firstChild)
        }

        // 添加白色背景外层
        document.body.style.background = '#f8f8f8'
        document.body.appendChild(wrapper)
        wrapper.appendChild(inner)

        // 内部内容样式自适应
        Object.assign(inner.style, {
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollbarWidth: 'none',       // Firefox 隐藏滚动条
          msOverflowStyle: 'none',      // IE/Edge 隐藏滚动条
        })
      }
    }
	}
</script>

<style lang="scss">
/*每个页面公共css */
$status-bar-height: 60px;
$content-padding: 0 0 18px 0;
$base-font-color: #FFFFFF;
$base-font-size: 1.0rem;
$tips-font-size: 0.8rem;
$base-font-family: '华文楷体';

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
  height: calc(100vh - $status-bar-height);
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
