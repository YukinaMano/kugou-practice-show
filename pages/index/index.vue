<template>
  <view class="main">
    <view class="bg"></view>
    <view class="status-bar">
      <view class="navigatebar">
        <SvgIcon class="menu" name="menu"></SvgIcon>
        <view><text class="gri">听</text></view>
        <view><text>看</text></view>
        <view><text>唱</text></view>
        <SvgIcon class="search" name="search"></SvgIcon>
      </view>
    </view>
    <view class="content">
      <view class="personal">
        <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
        <view class="infor">
          <view class="up">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <image class="vip" src="/static/pic/index/vip.png"></image>
          </view>
          <view class="down">
            <view class="level round-text">LV.{{ userInfo.level }}</view>
            <text class="duration">听歌{{ userInfo.duration }}分钟</text>
          </view>
        </view>
      </view>
      <view class="my-music">
        <view class="my-music-item" v-for="item,index in renderItemMyMusic" :key="index"  @click="btnGoMusicLibrary" v-once>
          <SvgIcon class="icon" :name="item.iconName" />
          <text class="alt">{{ item.title }}</text>
          <text class="num">{{ cntItemMyMusic[index] }}</text>
        </view>
      </view>
      <view class="all-music">
        <view class="all-music-item" v-for="item,index in renderItemAllMusic" :key="index" v-once>
          <view class="icon-bg" :style="'background-color:'+item.bgc">
            <SvgIcon class="icon" :name="item.iconName" />
          </view>
          <text class="alt">{{ item.title }}</text>
        </view>
      </view>
      <view class="advitisement">
        <view class="left">
          <SvgIcon class="icon" name="broadcast"></SvgIcon>
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
                <SvgIcon v-show="isPause" class="icon" name="play" />
                <SvgIcon v-show="!isPause" class="icon" name="pause" />
              </view>
              <view @click="btnNextMusic">
                <SvgIcon class="icon" name="stepnext" />
              </view>
              <view @click="btnSwitchSkipMode">
                <SvgIcon class="icon" :name="switch_names[skipMode]" />
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

const switch_names = ['switch_allloop', 'switch_random', 'switch_oneloop']

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
  uni.preloadPage({
    url: 'pages/index/play'
  })
})

// Render
const renderItemMyMusic = [
  {
    iconName: 'localhost',
    iconUrl: '/static/pic/index/pc.png',
    title: '本地音乐'
  },
  {
    iconName: 'like',
    iconUrl: '/static/pic/index/heart.png',
    title: '喜欢·歌单'
  },
  {
    iconName: 'download',
    iconUrl: '/static/pic/index/download.png',
    title: '下载'
  },
  {
    iconName: 'time',
    iconUrl: '/static/pic/index/time.png',
    title: '最近'
  }
]
const renderItemAllMusic = [
	{
    iconName: 'music',
    iconUrl: '/static/pic/index/note.png',
    bgc: '#06b062',
    title: '乐库'
	},
	{
    iconName: 'musiclist',
    iconUrl: '/static/pic/index/work.png',
    bgc: '#067ab0',
    title: '歌单'
	},
	{
    iconName: 'radio',
    iconUrl: '/static/pic/index/chart.png',
    bgc: '#e62134',
    title: '电台·酷群'
	},
	{
    iconName: 'guess_like',
    iconUrl: '/static/pic/index/radio.png',
    bgc: '#c25bd1',
    title: '猜你喜欢'
	},
	{
    iconName: 'recommendation',
    iconUrl: '/static/pic/index/chart.png',
    bgc: '#edb231',
    title: '每日推荐'
	},
	{
    iconName: 'listen',
    iconUrl: '/static/pic/index/micro.png',
    bgc: '#4be22d',
    title: '听歌识曲'
	}
]

</script>

<style scoped lang="scss">
  @import '~@/tool.scss';
  $bgi: '/static/pic/index/bgi.jpg';
  $plate-gap: 24px;
  .bg {
    @include i-background-app($bgi);
  }
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
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .content > *:not(:last-child) {
    margin-bottom: $plate-gap;
  }

  .personal {
    height: 60px;
    padding: 0px 18px;
    @extend .i-row-vertical-center;

    .avatar {
      width: 43px;  height: 43px;
    }
    .infor{
      margin-left: 14.66px;
      .up {

        .nickname {
          // font-size: 0.6rem;
          margin-right: 6px;
        }
        .vip {
          width: 8px;  height: 5px;
        }
      }
      .down {
        @extend .i-row;
        margin-top: 10px;

        .level {
          // font-size: 0.34rem;
          font-family: '华文中宋';
          color: #f9a80b;
          margin-right: 6px;
        }
        .duration {
          // font-size: 0.36rem;
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

      .icon {
        height: 24px;
        width: auto;
      }
      .alt {
        margin-top: 15px;
      }
      .num {
        color: #b5b4b1;
        margin-top: 9px;
      }
    }
  }
  .all-music {
    $item-gap: 20px;

    height: 206px;  width: 100%;
    @extend .i-row;
    flex-wrap: wrap;
    gap: 0 $item-gap;

    .all-music-item {
      height: fit-content;
      @extend .i-col-horizontal-center;
      flex: 0 0 calc((100% - ($item-gap * 2)) / 3);

      .icon-bg {
        width: 55px;  height: 55px;
        border-radius: 27.5px;
        @extend .i-row-vertical-center, .i-row-horizontal-center;
      }
      .icon {
        height: 24px;
        width: auto;
      }
      .alt {
        // font-size: 0.6rem;
        color: #87cbcc;
        margin: 11px 0px;
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
      height: 18px;
      width: auto;
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
    width: 100%; height: 66px;
    padding-bottom: 10px;
    position: fixed;
    bottom: 0px;
    background-color: #151f28;
    @extend .i-row;

    .cover{
      width: 59px; height: 59px;
      margin: 0px 12px;
      border-radius: 30px;
      border: solid #080c10 3px;
      position: relative;
      bottom: 5px;
    }
    .right{
      width: 100%; height: 100%;

      .up{
        width: 100%; height: 50%;
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
        width: 100%; height: 50%;
        @extend .i-row-horizontal-between;
        margin-top: 0px;

        .information{
          width: 50%;
          @extend .i-col;

          .m-name{
            height: 50%;
            font-size: 0.6rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .m-singer{
            height: 50%;
            font-size: 0.48rem;
          }
        }

        .operation{
          width: 50%;
          @extend .i-row-horizontal-around;

          .icon{
            height: 18px;
            width: auto;
          }
        }
      }
    }
  }
</style>
