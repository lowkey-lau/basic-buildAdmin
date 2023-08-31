<template>
  <div class="tableDataBox">
    <div class="tableDataBox-title">用户来源</div>
    <div class="tableDataBox-container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column min-width="180" align="center" prop="channel_val" label="渠道名称" />
        <el-table-column min-width="180" align="center" prop="count" label="用户" />
        <el-table-column min-width="180" align="center" prop="ratioStr" label="占比" />
        <el-table-column min-width="180" align="center" prop="weekRatioStr" label="周环比" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import $BigNumber from "bignumber.js";

const $props = defineProps({
  data: Array,
});

const tableData = computed(() => {
  return $props.data.map((item) => {
    return {
      channel_val: item.channel_val,
      count: item.count,
      ratioStr: $BigNumber(item.ratio).times(100).toFixed(2) + "%",
      weekRatioStr: $BigNumber(item.week_ratio).times(100).toFixed(2) + "%",
    };
  });
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as *;
.tableDataBox {
  background: var(--lowkey-bg-color-overlay);
  margin-bottom: 20px;

  &-title {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color);
  }

  &-container {
    @include flexCenter;
    padding: 20px;
  }
}
</style>
