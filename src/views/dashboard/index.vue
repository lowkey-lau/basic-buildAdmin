<template>
  <div class="main">
    <LineCharts />

    <div class="filterPanel">
      <InitDatePicker v-model="state.datePickerValue" title="归因日期" />
      <el-button type="primary" @click="init()" :loading="state.loading">查询</el-button>
    </div>

    <ItemData :data="state.tableData" v-if="state.tableData" />

    <el-row :gutter="20">
      <el-col :span="12">
        <QuickItem />
        <TableData :data="state.channelData" v-if="state.channelData" />
      </el-col>
      <el-col :span="12">
        <PieCharts :data="state.versionData" v-if="state.versionData" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import ItemData from "./components/ItemData.vue";
import LineCharts from "./components/LineCharts.vue";
import QuickItem from "./components/QuickItem.vue";
import TableData from "./components/TableData.vue";
import PieCharts from "./components/PieCharts.vue";
import { onMounted, reactive } from "vue";
import { GetDatePickerValue, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "数据概览",
  loading: false,

  datePickerValue: [],

  tableData: null,
  channelData: null,
  versionData: null,
});

const init = async () => {
  state.loading = true;

  try {
    const requestData = await getData();
    state.tableData = requestData.table_data;
    state.channelData = requestData.channel_data;
    state.versionData = requestData.version_data;
  } catch (error) {}

  state.loading = false;
};

const getData = () => {
  return new Promise((resolve, reject) => {
    $api.dashboard
      .GetCollectedData({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetEndTimestampByZoom(state.datePickerValue[1]),
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

onMounted(() => {
  state.datePickerValue = GetDatePickerValue(7);

  init();
});
</script>

<style lang="scss" scoped>
.filterPanel {
  margin-bottom: 20px;
}
</style>
