<template>
  <el-space wrap :size="4">
    <span class="initLabel">{{ $props.title }}</span>
    <el-select v-model="cModel" placeholder="请选择">
      <el-option v-for="item in $props.list" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </el-space>
</template>

<script setup>
import { computed } from "vue";

const $props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  list: {
    type: Array,
    default: [],
  },
  modelValue: {
    default: "",
  },
});

const $emit = defineEmits(["update:modelValue"]);

const cModel = computed({
  get: () => $props.modelValue,
  set: (e) => {
    $emit("update:modelValue", e);
  },
});
</script>
