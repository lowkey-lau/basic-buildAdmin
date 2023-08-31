<!-- 数据管理 - 在线数据 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" type="datetimerange" />
      <InitSelect v-model="state.channel" title="渠道" :list="state.channelList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
    </el-space>

    <el-divider />

    <EchartsBar :echartsData="state.requestResult" v-if="state.requestResult" />
  </div>
</template>

<script setup>
import EchartsBar from "./components/EchartsLine.vue";

import { onMounted, reactive } from "vue";
import { useServer } from "@/stores/server";
import { GetFormatZoomDateBySeconds, GetDatePickerValueByHour, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "数据管理 - 在线数据",
  loading: false,

  requestResult: null,
  datePickerValue: [],
  channelList: [],
  channel: "",
});

const searchData = async () => {
  state.loading = true;

  try {
    let returnResult = await getRequestData();
    state.requestResult = returnResult;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = () => {
  return new Promise((resolve, reject) => {
    $api.dataManagement
      .GetOnlineData({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetTimestampByZoom(state.datePickerValue[1]),
        channel: state.channel,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

onMounted(() => {
  state.datePickerValue = GetDatePickerValueByHour(6, "yyyy-MM-DD HH:mm:ss");
  console.log(state.datePickerValue);

  state.channelList = server.adminConfig.channel_type;
  state.channel = state.channelList[0].value;

  searchData();
});
</script>
