<template>
  <el-space wrap :size="4">
    <span class="initLabel">{{ $props.title }}</span>
    <template v-if="$props.type == 'date'">
      <el-date-picker v-model="cModel" :type="$props.type" :value-format="'YYYY-MM-DD'" :default-value="[new Date()]" />
    </template>
    <template v-else>
      <el-date-picker
        v-model="cModel"
        :type="$props.type"
        :value-format="$props.type == 'daterange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-value="[new Date(), new Date()]"
        :shortcuts="shortcuts"
      />
    </template>
  </el-space>
</template>

<script setup>
import { computed } from "vue";

const $props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  type: {
    type: String,
    default: "daterange",
  },
  modelValue: {
    default: "",
  },
});

const shortcuts = [
  {
    text: "1周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (7 - 1));
      return [start, end];
    },
  },
  {
    text: "1月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (30 - 1));
      return [start, end];
    },
  },
  {
    text: "3月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * (90 - 1));
      return [start, end];
    },
  },
];

const $emit = defineEmits(["update:modelValue"]);

const cModel = computed({
  get: () => $props.modelValue,
  set: (e) => {
    $emit("update:modelValue", e);
  },
});
</script>
