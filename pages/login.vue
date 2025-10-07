<template>
  <view class="main">
    <view class="bg"></view>
    <view class="status-bar">
      <view class="navigatebar">
      </view>
    </view>
    <view class="content">
      <view class="logo-text">
        <image class="mid-logo" src="/static/logo.png"></image>
        <view class="mid-text">
          <view class="big-text mtext"><text>酷狗音乐</text></view>
          <view class="medium-text mtext"><text>音乐总有新玩法</text></view>
        </view>
      </view>
      <view class="input" >
        <view v-show="ifShowInput">
          <input type="text" v-model="acc" placeholder="帐号"/>
          <input type="text" v-model="pass" placeholder="密码"/>
        </view>
      </view>
      <view class="event">
        <button class="login-btn" style="background-color: #0ce6c5;" @click="btnToSignIn" v-if="ifShowSignUp" ><text>注册</text></button>
        <button class="login-btn" style="background-color: #0c96e6;" @click="btnToLogin" v-else><text>登录</text></button>
      </view>
      <view class="login-way-text"><text>其他登录方式</text></view>
      <view class="login-way-select">
        <view>
          <SvgIcon name="SVG_weibo" />
          <view><text>微博</text></view>
        </view>
        <view>
          <SvgIcon name="SVG_qq" />
          <view><text>QQ</text></view>
        </view>
        <view>
          <SvgIcon name="SVG_wechat" />
          <view><text>微信</text></view>
        </view>
      </view>
      <view class="agreement"><text>登录代表你同意<span>酷狗服务</span>和<span>隐私条款</span></text></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/api'
import { localUserInfo } from '@/stores/localuser.js'

const ifShowInput = ref(false)
const ifShowSignUp = ref(false)
const acc = ref("test")
const pass = ref("123")

// 登录逻辑
const _login = async () => {
  console.debug(acc.value, pass.value)
  const res = await api.user.login({
    'username': acc.value, 
    'password': pass.value
  })
  console.debug(res.data)
  const localuser = localUserInfo()
  localuser.userLogin(res.data.token)
  console.debug('login success, get token:', res.data.token)
  uni.redirectTo({ url: '/pages/index/index' })
  // uni.switchTab({ url: '/pages/index/index' }) // @YHD#mk>更新为tarBar后替换
}

// 按钮事件
const btnToLogin =  () => {
  ifShowInput.value && _login()
  ifShowInput.value || (ifShowInput.value = true)
}
const btnToSignIn = () => {
  ifShowInput.value && _login()
  ifShowInput.value || (ifShowInput.value = true)
}
</script>

<style scoped lang="scss">
  @import '~@/tool.scss';
  $bgi: '/static/pic/login/bgi.jpg';
  $tips-font-size: 0.8rem;
  .bg {
    @include i-background-app($bgi);
  }
  .logo-text {
    @extend .i-row-horizontal-center;
    margin-top: 101px;
    
    .mid-logo {
      width: 59px; height: 59px;
    }
    .mid-text {
      @extend .i-col-vertical-between;
      margin-left: 26px;
      
      .mtext {
        width: 160px;
        @extend .i-text-between;
      }
      .big-text {
        font-size: 1.5rem;
        font-family: '幼圆';
      }
      .medium-text {
        font-size: 1.2rem;
        font-family: '华文细黑';
      }
    }
  }
  .input {
    height: 183px; 
    @extend .i-col-horizontal-center,.i-col-vertical-center;
    
    input {
      width: 248px; height: 35px;
      text-indent:10px;
      border-bottom: 2px #FFFFFF solid;
      margin-top: 10px;
    }
  }
  .event {
    height: 49px;
    
    .login-btn {
      color: #FFFFFF;
      width: 248px; height: 35px;
      line-height: 35px;
      border-radius: 25px;
      margin-bottom: 14px;
    }
  }
  .login-way-text {
    @extend .i-row-horizontal-center, .i-row-vertical-center;
    white-space: pre;
    font-size: $tips-font-size;
    margin-top: 38px;
    
    &::after, &::before{
      content: "";
      background: #FFFFFF;
      height: 1px;
      width: 35%;
    }
  }
  .login-way-select {
    width: 235px; height: 41px;
    margin:0 auto;
    @extend .i-row-horizontal-between;
    margin-top: 28px;
    color: white;
    
    .icon {
      height: 36px;
      width: auto;
    }
    
    text {
      display: flex;
      @extend .i-row-horizontal-center;
    }
    
  }
  .agreement {
    text-align: center;
    font-size: $tips-font-size;
    margin-top: 31px;
    
    span {
      color: #037cc2;
    }
  }
</style>
