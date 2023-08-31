<template>
  <el-space wrap :size="4">
    <span class="initLabel">{{ $props.title }}</span>
    <el-input v-model="cModel" :placeholder="$props.placeholder" clearable />
  </el-space>
</template>

<script setup>
import { computed } from "vue";

const $props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
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
