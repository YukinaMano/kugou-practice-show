<template>
  <view class="main">
    <image src="/static/pic/index/bgi.jpg" mode="aspectFill" class="bg-img"></image>
    <view class="status-bar">
      <view class="navigatebar">
        <text class="iconfont icon-exit" @click="btnExitToLogin"></text>
        <view><text class="gri">听</text></view>
        <view><text>看</text></view>
        <view><text>唱</text></view>
        <text class="iconfont icon-search"></text>
      </view>
    </view>
    <view class="content">
      <view class="personal">
        <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
        <view class="infor">
          <view class="up">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="iconfont vip icon-VIP"></text>
          </view>
          <view class="down">
            <view class="level round-text">LV.{{ userInfo.level }}</view>
            <text class="duration">听歌{{ userInfo.duration }}分钟</text>
          </view>
        </view>
      </view>
      <view class="my-music">
        <view class="my-music-item" v-for="item,index in renderItemMyMusic" :key="index"  @click="btnGoMusicLibrary">
          <text :class="['iconfont', item.iconName]"></text>
          <text class="alt">{{ item.title }}</text>
          <text class="num">{{ cntItemMyMusic[index] }}</text>
        </view>
      </view>
      <view class="all-music">
        <view class="all-music-item" v-for="item,index in renderItemAllMusic" :key="index">
          <text :class="['iconfont', item.iconName]" :style="'background-color:'+item.bgc"></text>
          <text class="alt">{{ item.title }}</text>
        </view>
      </view>
      <view class="advitisement">
        <view class="left">
          <text class="iconfont icon-broadcast_fill icon"></text>
          <text class="alt">推广</text>
        </view>
        <view class="report marquee">
          <span>装了这个app不用再去ktv</span>
        </view>
      </view>
      <view class="tabbar">
        <view class="left">
          <view @click="btnGoBigMusic">
            <image class="cover anplay" :class="{anpause: isPause}" :src="nowMusicInfo.mPictureUrl" mode="aspectFill"></image>
          </view>
        </view>
        <view class="right">
          <view class="up">
            <view class="loading">
              <view class="pass" :style="{width: loading+'%'}"></view>
              <view class="in"></view>
            </view>
          </view>
          <view class="down">
            <view class="information">
              <text class="m-name">{{ nowMusicInfo.mTitle }}</text>
              <text class="m-singer">{{ nowMusicInfo.mSinger }}</text>
            </view>
            <view class="operation">
              <view @click="btnSwitchPlay">
                <text v-show="!isPause" class="iconfont icon-pause"></text>
                <text v-show="isPause" class="iconfont icon-play1"></text>
              </view>
              <view @click="btnNextMusic">
                <text class="iconfont icon-next"></text>
              </view>
              <view @click="btnSwitchSkipMode">
                <text :class="['iconfont', switch_names[skipMode]]"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, toRef } from 'vue';
import { onMounted  } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { inject } from 'vue';
import { api } from '@/api';

import { localUserInfo } from '@/stores/localuser.js'

// const PLAY_PAGE = import('@/pages/index/index.vue')
const localuser = localUserInfo();
const globalAudio = inject('audio');
const nowMusicInfo = reactive(globalAudio.nowMusicInfo);
const isPause = toRef(globalAudio, 'isPause');
const skipMode = toRef(globalAudio, 'skipMode');


const userInfo = reactive({
	uid: '',
	avatarUrl: '/static/pic/index/avatar.png',
	nickname: '胡萝北',
	level: 5,
	duration: 15302
})
let listenList = ref([
  {
	mTitle: '',
	mSinger: '',
	mPictureUrl: '',
  mMusicUrl: '',
  mLyricUrl: ''
  }
])
const cntItemMyMusic = ref([0, 0, 0, 0])
const loading = ref(0.0)

const switch_names = ['icon-arrow_up_down', 'icon-shuffle', 'icon-reload']

const btnExitToLogin = () => {
  console.debug('[page to] 退出登录页')
  uni.redirectTo({ url: '/pages/login' })
}
const btnGoMusicLibrary = () => {

}
const btnGoBigMusic = async () => {
  console.debug('[page to] 播放详情页')
  uni.navigateTo({ url: '/pages/index/play' })
}
const btnSwitchPlay = () => {
  globalAudio.doToggle();
}
const btnNextMusic = () => {
  globalAudio.toNextMusic();
}
const btnSwitchSkipMode = () => {
  globalAudio.doSwitchSkipMode();
}

onMounted(() => {
  globalAudio.onPlaying(() => {
    loading.value = globalAudio.getLoading()
  })
  globalAudio.onMusicEnded(() => {
    btnNextMusic();
  })
  listenList.value = globalAudio._initDefaultMusic()
  console.debug('组件挂载完成')
})
onLoad(() => {
  console.debug('预加载子页面，预防白屏')
  // #ifdef H5, APP
  uni.preloadPage({
    url: 'pages/index/play'
  })
  // #endif
})

// Render
const renderItemMyMusic = [
  {
    iconName: 'icon-home',
    iconUrl: '/static/pic/index/pc.png',
    title: '本地音乐'
  },
  {
    iconName: 'icon-fabulous',
    iconUrl: '/static/pic/index/heart.png',
    title: '喜欢·歌单'
  },
  {
    iconName: 'icon-download',
    iconUrl: '/static/pic/index/download.png',
    title: '下载'
  },
  {
    iconName: 'icon-time1',
    iconUrl: '/static/pic/index/time.png',
    title: '最近'
  }
]
const renderItemAllMusic = [
	{
    iconName: 'icon-music',
    iconUrl: '/static/pic/index/note.png',
    bgc: '#06b062',
    title: '乐库'
	},
	{
    iconName: 'icon-layers',
    iconUrl: '/static/pic/index/work.png',
    bgc: '#067ab0',
    title: '歌单'
	},
	{
    iconName: 'icon-radio',
    iconUrl: '/static/pic/index/chart.png',
    bgc: '#e62134',
    title: '电台·酷群'
	},
	{
    iconName: 'icon-flash',
    iconUrl: '/static/pic/index/radio.png',
    bgc: '#c25bd1',
    title: '猜你喜欢'
	},
	{
    iconName: 'icon-flag',
    iconUrl: '/static/pic/index/chart.png',
    bgc: '#edb231',
    title: '每日推荐'
	},
	{
    iconName: 'icon-headphones',
    iconUrl: '/static/pic/index/micro.png',
    bgc: '#4be22d',
    title: '听歌识曲'
	}
]

</script>

<style scoped lang="scss">
  @import '~@/tool.scss';
  $size-layout-plates-gap: 24px;
  $size-layout-labels-gap: 4px;
  $color-vip: #f5c71a;

  .navigatebar {
    height: 51px;
    padding: 0px 18px;
    font-family: '幼圆';
    font-size: 1.2em;
    color: #076cce;
    @extend .i-row-vertical-center, .i-row-horizontal-between;

    .gri {
      /* 文字渐变，只支持webkit浏览器 */
      background-image: linear-gradient(to top,#43d5eb,#fff);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
    .iconfont {
      font-size: inherit;
      color: inherit;
    }
  }
  .content > view:not(:last-child) {
    margin-bottom: $size-layout-plates-gap;
  }

  .personal {
    $size-view-avatar: 60px;
    height: 60px;
    padding: 0px 18px;
    @extend .i-row-vertical-center;

    .avatar {
      @include func-shape-circle($size-view-avatar);
    }
    .infor{
      margin-left: 14.66px;
      .up {
        font-size: 20px;

        .nickname {
          margin-right: 6px;
        }
        .iconfont {
          font-size: inherit;
        }
        .vip {
          color: $color-vip;
        }
      }
      .down {
        @extend .i-row;
        margin-top: 10px;

        .level {
          font-family: '华文中宋';
          color: #f9a80b;
          margin-right: 6px;
        }
        .duration {
          white-space: nowrap;
          color: #b5b4b1;
        }
      }
    }
  }
  .my-music {
    $item-gap: 16px;
    height: 96px;  width: 100%;
    @extend .i-row-horizontal-between;

    .my-music-item {
      @extend .i-col-horizontal-center;
      flex: 0 0 calc((100% - ($item-gap * 2)) / 4);

      .iconfont {
        font-size: 32px;
      }
      .alt {
        margin-top: $size-layout-labels-gap;
      }
      .num {
        color: #b5b4b1;
        margin-top: $size-layout-labels-gap;
      }
    }
  }
  .all-music {
    $size-item-gap: 20px;
    $size-icon-bg-circle: 64px;
    $color-icon-alt: #87cbcc;

    height: 206px;  width: 100%;
    @extend .i-row;
    flex-wrap: wrap;
    gap: 0 $size-item-gap;

    .all-music-item {
      height: fit-content;
      @extend .i-col-horizontal-center;
      flex: 0 0 calc((100% - ($size-item-gap * 2)) / 3);

      .iconfont {
        @include func-shape-circle($size-icon-bg-circle);
        font-size: 28px;
      }
      .alt {
        color: $color-icon-alt;
        margin-top: $size-layout-labels-gap;
      }
    }
  }
  .advitisement {
    height: 38px;
    margin: 0px 20px;
    border-top:1px solid #0a8ec5;
    border-bottom:1px solid #0a8ec5;
    @extend .i-row-vertical-center, .i-row-horizontal-between;

    .left {
      @extend .i-row-vertical-center;
    }
    .icon {
      font-size: 20px;
      margin-right: 12px;
    }
    .alt {
      // font-size: 0.72rem;
      color: #87cbcc;
    }
    .report {
      // font-size: 0.6rem;
      color: #87cbcc;
    }
  }

  .tabbar {
    $size-view-cover: 72px;
    width: 100%; height: 66px;
    padding-bottom: 10px;
    position: fixed;
    bottom: 0px;
    background-color: #151f28;
    @extend .i-row;

    .cover{
      @include func-shape-circle($size-view-cover);
      border: solid #080c10 3px;
      margin: 0px 12px;
      position: relative;
      bottom: 12px;
    }
    .right{
      width: 100%; height: 100%;

      .up{
        width: 100%; height: 40%;
        @extend .i-row-vertical-center, .i-row-horizontal-center;
        justify-content: left;

        .loading{
          width: 80%; height: 1px;
          background-color: #01182d;
          @extend .i-row-vertical-center;

          .pass{
            width: 0%; height: 1px;
            background-color: #2190f3;
          }
          .in{
            width: 6px; height: 6px;
            border-radius: 3px;
            background-color: #2190f3;
          }
        }
      }
      .down{
        width: 100%; height: 60%;
        @extend .i-row-horizontal-between;
        margin-top: 0px;

        .information{
          width: 50%;
          @extend .i-col;

          .m-name{
            font-size: 16px;
            height: 60%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .m-singer{
            font-size: 12px;
            height: 40%;
          }
        }

        .operation{
          width: 50%;
          @extend .i-row-horizontal-around, .i-row-vertical-center;

          .iconfont{
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
