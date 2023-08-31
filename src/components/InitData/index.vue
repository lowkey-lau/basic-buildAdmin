<template>
  <el-space wrap :size="8">
    <span class="initLabel">{{ $props.title }}</span>
    <el-tag :type="$props.type">{{ $props.value }}</el-tag>
  </el-space>
</template>

<script setup>
const $props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  value: {
    type: [Number, String],
    default: "",
  },
  type: {
    type: String,
    default: "success",
  },
});
</script>
