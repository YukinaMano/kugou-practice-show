<template>
  <view class="main">
    <page-meta></page-meta>
    <image class="bg1" :src="nowMusicInfo.mPictureUrl"></image>
    <view class="bg2"></view>
    <view class="status-bar">
      <view class="navigatebar" @click="btnToBack">
        <SvgIcon name="back" class="icon-back" />
        <text class="m-name">{{ nowMusicInfo.mTitle }}</text>
      </view>
    </view>
    <view class="content">
      <view class="content-top">
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
      </view>
      <view class="content-body">
        <view class="m-cover">
          <image class="anplay" :src="nowMusicInfo.mPictureUrl" :class="{anpause: isPause}"></image>
        </view>
        <view class="m-lyric">
          <LyricScroll :lyricLines="lyricLines" :lyricNowLines="lyricNowLines"></LyricScroll>
        </view>
      </view>
      <view class="content-bottom">
        <view class="is-sing">
          <view class="sing" :style="'background-color:'+otherSelect[other]"></view>
          <view class="other"  :style="'background-color:'+otherSelect[1-other]"></view>
        </view>
        <view class="interactive">
          <SvgIcon name="like" />
          <SvgIcon name="toload" />
          <SvgIcon name="comment" />
          <SvgIcon name="share" />
          <SvgIcon name="more" />
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
          <SvgIcon class="a" name="switch_random"></SvgIcon>
          <view>
            <view class="b" @click="btnLastMusic">
              <SvgIcon name="stepback" />
            </view>
            <view class="c" @click="btnSwitchPlay">
              <SvgIcon v-show="isPause" name="play" />
              <SvgIcon v-show="!isPause" name="pause" />
            </view>
            <view class="b" @click="btnNextMusic">
              <SvgIcon name="stepnext" />
            </view>          
          </view>
          <SvgIcon class="a" name="list"></SvgIcon>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, toRef } from 'vue';
import { onMounted  } from 'vue';
import { inject } from 'vue';
import { formatTime } from '/utils/common.js';
import LyricScroll from '/components/LyricView.vue';

const globalAudio = inject('audio');
const nowMusicInfo = reactive(globalAudio.nowMusicInfo);
const isPause = toRef(globalAudio, 'isPause');
const durL = toRef(globalAudio, 'duration');
const curL = ref(0);
const loading = ref(0.0);
const first = ref('');
const second = ref('');
const lyricLines = toRef(globalAudio, 'lyricLines');
const lyricNowLines = ref(0);

const btnToBack = () => {
  uni.navigateBack();
}

const btnLastMusic = () => {
  globalAudio.toLastMusic();
}
const btnNextMusic = () => {
  globalAudio.toNextMusic();
}
const btnSwitchPlay = () => {
  globalAudio.doToggle();
}



const checkLyricText = (curTime = 0, advanceTime = 100) => {
  for (let i = 0; i < lyricLines.value.length; i++) {
    if (curTime * 1000 + advanceTime >= lyricLines.value[i].time) {
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
    checkLyricText(curL.value, 200)
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
    height: 108px;
    font-size: 1.2rem;
    @extend .i-col-horizontal-center;
    
    view {
      width: 100%;
      @extend .i-row-horizontal-around;
      
      image {
        width: 18px; height: 18px;
      }     
      text {
        width: 72vw;
        text-align: center;
        white-space: nowrap;
        overflow:hidden;
      }
    }
    
    .read {
      color: skyblue;
    }
    .reading {
      color: white;
      &:active {
        color: skyblue;
        transition: color 0.3s;
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
    font-size: 1.6em;
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
      font-size: 1.4em;
      background-color: #007AFF;
      border-radius: 50%;
      @extend .i-row-horizontal-around, .i-row-vertical-center;
      
      image {
        width: 16px; height: 16px;
      }
      
    }
    .c {
      width: 72px; height: 72px;
      font-size: 2.0em;
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
