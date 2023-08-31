<template>
  <el-dialog :model-value="computedDialogVisible" width="85%" append-to-body center :close-on-press-escape="false" @close="closeDialog()">
    <template #header>
      <h2>商单预览</h2>
    </template>

    <el-descriptions :column="12" direction="vertical" border>
      <el-descriptions-item :span="item.span" v-for="(item, index) in computedPreviewOrderInfo" :key="index" width="50%">
        <template #label>
          <div class="cell-item">{{ item.label }}</div>
        </template>

        <span v-if="item.type == 1">{{ item.value }}</span>

        <div v-if="item.type == 2">
          <el-image style="width: 200px; height: 200px" :src="item.value" fit="contain" />
        </div>

        <div v-if="item.type == 3">
          <el-table :data="item.value" border fit style="width: 100%" size="small" v-if="item.value.length != 0">
            <el-table-column :prop="subItem" :label="subItem" v-for="(subItem, subIndex) in Object.keys(item.value[0])" :key="subIndex" />
          </el-table>
        </div>

        <div v-if="item.type == 4" v-html="item.value" />

        <div v-if="item.type == 5">
          <div class="videoBox">
            <video :src="item.value" controls v-if="item.value != ''" />
            <el-tag type="warning" v-else>无上传视频</el-tag>
          </div>
        </div>

        <el-tag type="warning" v-if="item.type == 6">{{ item.value }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="closeDialog()">返回</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useServer } from "@/stores/server";
import { FilterLabelByValue } from "@/utils/common";

const server = useServer();

const $props = defineProps({
  visible: Boolean,
  previewOrderInfo: Object,
});
const $emits = defineEmits(["changeVisible"]);

const closeDialog = () => {
  $emits("changeVisible", 2, false);
};

const computedDialogVisible = computed(() => {
  return $props.visible;
});

const computedPreviewOrderInfo = computed(() => {
  //type = 1 纯文案  2 图片  3 数组  4 富文本 5 视频
  //span = 列宽占比

  return [
    {
      label: "offer名称",
      value: $props.previewOrderInfo.offer_name,
      type: 1,
      span: 4,
    },
    {
      label: "包名",
      value: $props.previewOrderInfo.package_name,
      type: 1,
      span: 4,
    },
    {
      label: "过期时间",
      value: $props.previewOrderInfo.expired,
      type: 1,
      span: 4,
    },
    {
      label: "offer介绍",
      value: $props.previewOrderInfo.introduce,
      type: 4,
      span: 12,
    },
    {
      label: "宣传视频",
      value: $props.previewOrderInfo.video,
      type: 5,
      span: 4,
    },
    {
      label: "宣传图",
      value: $props.previewOrderInfo.posterImg,
      type: 2,
      span: 4,
    },
    {
      label: "Icon图",
      value: $props.previewOrderInfo.iconImg,
      type: 2,
      span: 4,
    },
    {
      label: "排序权重",
      value: $props.previewOrderInfo.weights,
      type: 1,
      span: 3,
    },
    {
      label: "指标额度",
      value: $props.previewOrderInfo.index_quota,
      type: 1,
      span: 3,
    },
    {
      label: "预期完单率",
      value: $props.previewOrderInfo.pre_finish_rate + "%",
      type: 1,
      span: 3,
    },
    {
      label: "成本价",
      value: $props.previewOrderInfo.cost_price,
      type: 1,
      span: 3,
    },
    {
      label: "是否新手任务",
      value: $props.previewOrderInfo.novice_task_offer == 1 ? true : false,
      type: 1,
      span: 3,
    },
    {
      label: "渠道选择",
      value: FilterLabelByValue(server.adminConfig.offer_source_type, $props.previewOrderInfo.offer_source),
      type: 6,
      span: 3,
    },
    {
      label: "渠道参数",
      value: $props.previewOrderInfo.offer_source_input,
      type: 1,
      span: 6,
    },
    {
      label: "任务预览",
      value: $props.previewOrderInfo.taskList,
      type: 3,
      span: 12,
    },
  ];
});
</script>

<style lang="scss" scoped>
.videoBox {
  max-width: 200px;
  video {
    width: 100%;
  }
}
</style>
