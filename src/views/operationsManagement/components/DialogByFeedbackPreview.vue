<template>
  <el-dialog :model-value="computedDialogVisible" width="50%" append-to-body center :close-on-press-escape="false" @close="closeDialog()">
    <template #header>
      <h2>详情</h2>
    </template>

    <el-descriptions :column="1" direction="vertical" border>
      <el-descriptions-item :span="item.span" v-for="(item, index) in doItem" :key="index">
        <template #label>
          <div class="cell-item">{{ item.label }}</div>
        </template>

        <span v-if="item.type == 1">{{ item.value }}</span>

        <div v-if="item.type == 2">
          <!-- <span v-for="(subItem, subIndex) in item.value" :key="subIndex">{{ subItem }}</span> -->
          <el-space>
            <el-image
              style="max-width: 200px"
              v-for="(subItem, subIndex) in item.value"
              :key="subIndex"
              :src="subItem"
              :zoom-rate="1.2"
              :preview-src-list="item.value"
            />
          </el-space>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="closeDialog()">返回</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue";

const $props = defineProps({
  visible: Boolean,
  doItem: Object,
});
const $emits = defineEmits(["changeVisible"]);

const closeDialog = () => {
  $emits("changeVisible", 1, false);
};

const doItem = computed(() => {
  //type = 1 文案  2 图片
  //span = 列宽占比

  return [
    {
      label: "反馈内容",
      value: $props.doItem.text,
      type: 1,
      span: 1,
    },
    {
      label: "反馈图片",
      value: $props.doItem.image,
      type: 2,
      span: 1,
    },
  ];
});

const computedDialogVisible = computed(() => {
  return $props.visible;
});
</script>
