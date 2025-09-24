<template>
  <view class="main">
    <page-meta></page-meta>
    <image class="bg1" :src="nowMusicInfo.mPictureUrl"></image>
    <view class="bg2"></view>
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="content">
      <view class="navigatebar">
        <SvgIcon name="back" class="icon-back" />
        <!-- <image class="back" src="/static/pic/icon/back.svg" @click="toBack"></image> -->
        <text class="m-name">{{ nowMusicInfo.mTitle }}</text>
      </view>
      <view class="m-singer"><text>{{ nowMusicInfo.mSinger }}</text></view>
      <view class="m-effect">
        <view>
          <text>标准</text>
          <image src="/static/pic/play/down.png"></image>
        </view>
        <view>
          <text>音效</text>
        </view>
        <view>
          <text>封面</text>
          <image src="/static/pic/play/down.png"></image>
        </view>
      </view>
      <view class="m-cover">
        <image class="anplay" :src="nowMusicInfo.mPictureUrl" :class="{anpause: ispause}"></image>
      </view>
      <view class="m-lyric">
        <view>
          <image></image>
          <text>{{ lyricLines[lyricNowLines - 1]?.text || '' }}</text>
          <image src="/static/pic/play/micro.png"></image>
        </view>
        <view>
          <image></image>
          <text>{{ lyricLines[lyricNowLines]?.text || '' }}</text>
          <image src="/static/pic/play/note.png"></image>
        </view>
        <view>
          <image></image>
          <text>{{ lyricLines[lyricNowLines + 1]?.text || '' }}</text>
          <image src="/static/pic/play/note.png"></image>
        </view>
      </view>
      <view class="is-sing">
        <view class="sing" :style="'background-color:'+otherSelect[other]"></view>
        <view class="other"  :style="'background-color:'+otherSelect[1-other]"></view>
      </view>
      <view class="interactive">
        <image src="../../static/pic/play/like.png"></image>
        <image src="../../static/pic/play/download.png"></image>
        <image src="../../static/pic/play/comments.png"></image>
        <image src="../../static/pic/play/share.png"></image>
        <image src="../../static/pic/play/more.png"></image>
      </view>
      <view class="loading">
        <text class="now">{{ formatTime(curL) }}</text>
        <view class="loading-bar">
          <view class="pass" :style="{width: loading+'%'}"></view>
          <view class="in"></view>
        </view>
        <text class="all">{{ formatTime(durL) }}</text>
      </view>
      <view class="operation">
        <image src="/static/pic/play/playway.png" class="a"></image>
        <view>
          <view class="b" @click="btnLastMusic">
            <image src="/static/pic/play/last.png"></image>
          </view>
          <view class="c" @click="btnSwitchPlay">
            <image v-show="ispause" src="/static/pic/play/play.png"></image>
            <image v-show="!ispause" src="/static/pic/play/pause.png"></image>
          </view>
          <view class="b" @click="btnNextMusic">
            <image src="/static/pic/play/next.png"></image>
          </view>          
        </view>
        <image src="/static/pic/play/detail.png" class="a"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, toRef } from 'vue';
import { onMounted  } from 'vue';
import { inject } from 'vue';
import { formatTime } from '/utils/common.js';

const globalAudio = reactive(inject('audio'));
const nowMusicInfo = reactive(globalAudio.nowMusicInfo);
const ispause = toRef(globalAudio, 'ispause');
const durL = toRef(globalAudio, 'duration');
const curL = ref(0);
const loading = ref(0.0);
const first = ref('');
const second = ref('');
const lyricLines = toRef(globalAudio, 'lyricLines');
const lyricNowLines = ref(0);

const toBack = () => {
  uni.navigateBack();
}

const btnLastMusic = () => {
  globalAudio.toLastMusic();
}
const btnNextMusic = () => {
  globalAudio.toNextMusic();
}
const btnSwitchPlay = () => {
  globalAudio.toggle();
}



const checkLyricText = (curTime = 0) => {
  for (let i = 0; i < lyricLines.value.length; i++) {
    if (curTime * 1000 >= lyricLines.value[i].time) {
      lyricNowLines.value = i;
    } else {
      break;
    }
  }
  // first.value = lyricLines.value[lyricNowLines.value - 1]?.text || '';
  // second.value = lyricLines.value[lyricNowLines.value]?.text || '';
};

onMounted(() => {
  globalAudio.onPlaying(() => {
    loading.value = globalAudio.getLoading();
    curL.value = globalAudio.getCurrentTime();
    checkLyricText(curL.value)
  })
  console.debug('组件挂载完成')
})
</script>

<style scoped lang="scss">
  @import '~@/tool.scss';
  .bg1 {
    // 第一层背景，封面模糊
    @extend .i-fill-container;
    position: fixed;
    top: auto;
    left: auto;
    z-index: -2;
    filter: blur(8px);
  }
  .bg2 {
    // 第二层背景，中间向上下渐变
    @extend .i-fill-container;
    position: fixed;
    top: auto;
    left: auto;
    z-index: -1;   
    background: linear-gradient(to top, rgba(41,66,102,1) 0%, rgba(42,58,58,0.33) 50%, rgba(47,63,63,1) 100%);
  }
  .content {
    font-family: '华文楷体';
    color: #FFFFFF;
  }
  .navigatebar {
    height: 53.33px;
    @extend .i-row-vertical-center;
    
    .back {
      width: 32px; height: 32px;
      margin: 0px 12.33px;
    }
    .m-name {
      width: 80%;
      font-size: 1.2rem;
      @extend .i-text-omit-line;
    }
  }
  .m-singer {
    height: 20.33px;
    @extend .i-row-horizontal-center, .i-row-vertical-center;
    font-size: 0.96rem;
    margin-bottom: 11.33px;

    &::after, &::before{
      content: "";
      background: #b3b5b4;
      height: 1px;
      width: 5%;
    }
  }
  .m-effect {
    width: 40%; height: 29px;
    margin: 0 auto;
    @extend .i-row-horizontal-between, .i-row-vertical-center;
    
    view {
      border: 1px solid #FFFFFF;
      border-radius: 5px;
    }
    text {
      font-size: 0.96rem;
    }
    image {
      width: 6px; height: 6px;
    }
  }
  .m-cover {
    height: 282.66px;
    @extend .i-row-horizontal-center, .i-row-vertical-center;
    
    image {
      width: 262px; height: 262px;
      border-radius: 50%;
      /* 这里需要根据背景变化 */
      border: 4px solid #484837;
    }
  }
  .m-lyric {
    height: 68.66px;
    font-size: 1.2rem;
    @extend .i-col-horizontal-center;
    
    view {
      width: 100%;
      @extend .i-row-horizontal-around;
      
      image {
        width: 18px; height: 18px;
      }     
      text {
        width: 60%;
        white-space: nowrap;
        overflow:hidden;
      }
    }
  }
  .is-sing {
    height: 20px;
    @extend .i-row-horizontal-center;
    
    view {
      width: 6px; height:6px;
      border-radius: 50%;
      margin: 0px 2px;
    }
  }
  .interactive {
    height: 31.33px;
    @extend .i-row-horizontal-around;
    
    image {
      width: 18.66px; height: 18.66px;
    }
  }
  .loading {
    height: 29px;
    @extend .i-row-horizontal-around, .i-row-vertical-center;
    
    text {
      font-size: 0.6rem;
    }
    .loading-bar {
      width: 60%; height: 1px;
      background-color: #b6b2cb;
      @extend .i-row-vertical-center;
      
      .pass{
        width: 50%; height: 1px;
        background-color: #2190f3;
      }     
      .in{
        width: 6px; height: 6px;
        border-radius: 3px;
        background-color: #ffffff;
      }           
    }
  }
  .operation {
    @extend .i-row-horizontal-around, .i-row-vertical-center;
    
    > view {
      width: 60%;
      @extend .i-row-horizontal-around, .i-row-vertical-center;
    }
    .a {
      width: 20px; height: 20px;
    }
    .b {
      width: 48px; height: 48px;
      background-color: #007AFF;
      border-radius: 50%;
      @extend .i-row-horizontal-around, .i-row-vertical-center;
      
      image {
        width: 16px; height: 16px;
      }
      
    }
    .c {
      width: 72px; height: 72px;
      background-color: #007AFF;
      border-radius: 50%;
      @extend .i-row-horizontal-around, .i-row-vertical-center;
      
      image {
        width: 24px; height: 24px;
      }
    }
  }
  .icon-back {
    font-size: 32px;
    color: white;
  }
</style>
