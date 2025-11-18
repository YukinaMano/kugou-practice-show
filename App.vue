<script>
import { isAppEnv } from "@/utils/common.js";
import { api } from "@/api";
import { localUserInfo } from "@/stores/localuser.js";

export default {
  onLaunch: function () {
    console.debug("App Launch");
    const localuser = localUserInfo();
    api.init({
      getAccessToken: () => localuser.access_token,
      setAccessToken: (token) => localuser.updateAccessToken(token),
      getRefreshToken: () => uni.getStorageSync("refresh_token"),
    });
    // #ifdef H5
    if (!isAppEnv("ua")) {
      // 桌面端 → 模拟移动端效果
      this.simulateMobileViewport();
    }
    // #endif
  },
  onShow: function () {
    console.debug("App Show");
  },
  onHide: function () {
    console.debug("App Hide");
  },
  methods: {
    simulateMobileViewport() {
      // 清除已有模拟容器，避免重复插入
      const existingWrapper = document.getElementById("mock-mobile-wrapper");
      if (existingWrapper) existingWrapper.remove();

      // 计算媒体屏幕尺寸
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // 设置上下 margin 与最大高度
      const margin = 10;
      const maxHeight = 844; // iPhone 14 屏幕高度（px）
      const maxWidth = 390; // iPhone 14 屏幕宽度（px）

      // 如果屏幕太矮，就减去 margin 作为最小高度
      const mockHeight = Math.min(screenH - margin * 2, maxHeight);
      const mockWidth = maxWidth;
      document.documentElement.style.setProperty(
        "--main-height",
        `${mockHeight}px`
      );

      // 创建外层容器（模拟手机）
      const wrapper = document.createElement("div");
      wrapper.id = "mock-mobile-wrapper";
      Object.assign(wrapper.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${mockWidth}px`, // iPhone 14 宽度
        height: `${mockHeight}px`,
        backgroundColor: "#fff",
        borderRadius: "24px",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        zIndex: "9999",
        transition: "all 0.3s ease",
      });

      // 创建内部内容容器（原页面内容）
      const inner = document.createElement("div");
      inner.id = "mock-mobile-content";

      // 把原 body 内容移入 inner 容器
      while (document.body.firstChild) {
        inner.appendChild(document.body.firstChild);
      }

      // 设置 body 背景（灰色外部遮罩效果）
      document.body.style.background = "#f8f8f8";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflow = "hidden"; // 防止外层滚动

      // 组装结构
      document.body.appendChild(wrapper);
      wrapper.appendChild(inner);

      // 内部内容样式自适应
      Object.assign(inner.style, {
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      });

      // 控制台输出调试信息
      console.debug(
        `[simulateMobileViewport] 模拟设备尺寸: ${mockWidth}x${mockHeight} (屏幕 ${screenW}x${screenH})`
      );
    },
  },
};
</script>

<style lang="scss">
@import "~@/tool.scss";
@import "/static/iconfont/font_5053371_l3qf21p7cm/iconfont.css";
// @import '//at.alicdn.com/t/c/font_5053371_zujvu7cpa7i.css';
/*每个页面公共css */
$size-layout-plates-gap: 24px;
$size-layout-navbar-height: 60px;
$content-padding: 0 0 18px 0;
$base-font-color: #ffffff;
$color-icon-base: $base-font-color;
$color-icon-tips: lightgreen;
$base-font-size: 16px;
$tips-font-size: 12.8px;
$base-font-family: "华文楷体";
$icon-base-size: 32px;

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

.icon-dark-theme {
  color: #000000;
  font-size: $icon-base-size;
}
.icon-light-theme {
  color: #ffffff;
  font-size: $base-font-size;
  &:hover {
    color: #0c96e6;
  }
  &:active {
    color: #85c1e4;
  }
}

// @AC#> 设置一个空的iconfont作为占位
.icon-empty {
  opacity: 0;
  visibility: hidden;
  width: 1em;
  height: 1em;
  display: inline-block;
}
// @AC#> 全局图标大小继承父容器
.iconfont {
  font-size: inherit;
  color: inherit;
}
.main {
  color: $base-font-color;
  font-size: $base-font-size;
  font-family: $base-font-family;
}
.status-bar {
  height: var(--status-bar-height);
}
.navigatebar {
  height: $size-layout-navbar-height;
  @extend .i-row-horizontal-between, .i-row-vertical-center;
  padding: 0px 18px;
  font-family: "幼圆";
  font-size: 20px;
}
.content > view:not(:last-child) {
  margin-bottom: $size-layout-plates-gap;
}
.content {
  box-sizing: border-box;
  height: calc(
    var(--main-height) - var(--status-bar-height) - $size-layout-navbar-height
  );
  padding: $content-padding;
  display: flex;
  flex-direction: column;
}
.round-text {
  border: 1px solid;
  border-radius: 5px;
  padding: 0px 3px;
}
// 专辑封面旋转效果
@-webkit-keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
// @AC#> 标记那些设计了交互效果的图标按钮
// 可触发控件闪烁效果
/* 闪烁类 */
.blink-infinite {
    animation: blink 4s infinite; /* 每次闪烁持续0.333秒，重复3次 */
}
/* 闪烁动画 */
@keyframes blink {
    0%, 70%, 80%, 90%, 100% {
        color: $color-icon-base; /* 原色 */
    }
    75%, 85%, 95% {
        color: $color-icon-tips; /* 提示色 */
    }
}
</style>
