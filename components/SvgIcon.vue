<script setup>
const props = defineProps({
  name: { type: String, required: true }    // 图标名字
})
const iconsDSave = {
  back
}

const back = 'M538.288 198.624l-11.312-11.312a16 16 0 0 0-22.64 0L187.312 504.336a16 16 0 0 0 0 22.64L504.336 844a16 16 0 0 0 22.64 0l11.312-11.312a16 16 0 0 0 0-22.624l-294.4-294.4 294.4-294.4a16 16 0 0 0 0-22.64z'
</script>

<template>
  <svg class="icon" viewBox="0 0 1024 1024" aria-hidden="true">
    <path :d="iconsDSave[name]" />
  </svg>
</template>

<style scoped>
.icon {
  vertical-align: middle;
  width: 1em;           /* 让图标大小跟字体大小挂钩 */
  height: 1em;
  fill: currentColor;   /* 填充颜色继承父容器 color */
  stroke: currentColor; /* 如果需要描边，也继承 color */
}
</style>
