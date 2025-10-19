<template>
  <scroll-view
    class="lyric-scroll"
    scroll-y
    :scroll-top="scrollTop"
    @resize="onResize"
  >
    <view
      v-for="(line, index) in lyricLines"
      :key="index"
      :class="['lyric-line', { active: index === lyricNowLines }]"
    >
      {{ line.text }}
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  lyricLines: { type: Array, default: () => [] },
  lyricNowLines: { type: Number, default: 0 },
  lineHeight: { type: Number, default: 36 }
})

const scrollTop = ref(0)
const containerHeight = ref(300) // 默认高度，可通过 onMounted 获取真实高度

const updateScrollTop = () => {
  scrollTop.value =
    props.lineHeight * (props.lyricNowLines - 1)
  if (scrollTop.value < 0) scrollTop.value = 0 // 防止滚动过顶部
}

// 监听当前行变化
watch(() => props.lyricNowLines, updateScrollTop)

// 可选：监听容器大小变化
const onResize = (e) => {
  containerHeight.value = e.detail.height
  updateScrollTop()
}

onMounted(() => {
  updateScrollTop()
})
</script>

<style lang="scss">
.lyric-scroll {
  height: 100px;
}
:deep(.uni-scroll-view) {
  /* 允许滚动但隐藏滚动条（多端） */
  overflow-y: scroll;
  scrollbar-width: none;     /* Firefox */
  -ms-overflow-style: none;  /* IE/Edge */

  &::-webkit-scrollbar {
    display: none;           /* Chrome/Safari */
    width: 0;
    height: 0;
  }
}

.lyric-line {
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #999;
}

.lyric-line.active {
  color: #fff;
  font-weight: bold;
  font-size: 16px;
}
</style>
