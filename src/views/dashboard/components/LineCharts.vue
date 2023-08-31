<template>
  <div class="lineChartsBox">
    <div class="lineChartsBox-container">
      <div class="lineChartsBox-header">
        <div class="lineChartsBox-tabs">
          <el-radio-group v-model="state.type" @change="handleRadioChange">
            <el-radio-button :label="0">用户注册数据</el-radio-button>
            <el-radio-button :label="1">日活跃数据</el-radio-button>
          </el-radio-group>
        </div>
        <div class="lineChartsBox-fitler">
          <el-space wrap :size="16">
            <InitSelect v-model="state.channel" title="渠道" :list="state.channelList" />
            <InitDatePicker v-model="state.datePickerValue" title="时间" type="datetimerange" />
            <el-button type="primary" @click="init()" :loading="state.loading">查询</el-button>
          </el-space>
        </div>
      </div>
      <div class="lineChartsBox-charts">
        <div class="echartsPanel" :id="`id_${state.uuid}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { GetFormatZoomDateBySeconds, GetDatePickerValue, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import { useServer } from "@/stores/server";
import { useConfig } from "@/stores/config";
import $api from "@/axios/api.js";
import * as echarts from "echarts";

const server = useServer();
const config = useConfig();

const state = reactive({
  loading: true,
  uuid: uuidv4(),
  type: 0,
  onlineData: {},
  activeData: {},

  myChart: null, //实例

  datePickerValue: [],
  channelList: [],
  channel: "",
});

const $props = defineProps({
  echartsData: Array,
});

const echartsOption = reactive({
  animation: true,
  legend: {
    data: [],
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    //X轴
    type: "category",
    data: [],
  },
  yAxis: {
    //Y轴
    type: "value",
  },
  series: [],
});

const init = async () => {
  state.loading = true;
  try {
    state.onlineData = await getUserOnlineData();
    state.activeData = await getUserActiveData();
    initEchats(state.type == 0 ? state.onlineData : state.activeData);
    state.loading = false;
  } catch (error) {}
};

const handleRadioChange = (e) => {
  initEchats(e == 0 ? state.onlineData : state.activeData);
};

const getUserOnlineData = () => {
  return new Promise((resolve, reject) => {
    $api.dashboard
      .GetUserOnlineData({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetTimestampByZoom(state.datePickerValue[1]),
        channel: state.channel,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const getUserActiveData = () => {
  return new Promise((resolve, reject) => {
    $api.dashboard
      .GetUserActiveData({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetTimestampByZoom(state.datePickerValue[1]),
        channel: state.channel,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const initEchats = (props) => {
  state.myChart = echarts.init(document.getElementById(`id_${state.uuid}`), config.layout.isDark ? "dark" : "");
  let legendList = [];
  let xAxisList = [];
  let seriesList = [];

  legendList = Object.keys(props.data);
  xAxisList = props.date.map((item) => GetFormatZoomDateBySeconds(item));

  seriesList = legendList.map((item) => {
    return {
      name: item,
      type: "line",
      data: props.data[item],
    };
  });

  echartsOption.legend.data = legendList;
  echartsOption.xAxis.data = xAxisList;
  echartsOption.series = seriesList;

  state.myChart.setOption(echartsOption, true);
  window.onresize = function () {
    //自适应大小
    myChart.resize();
  };
};

onMounted(() => {
  state.datePickerValue = GetDatePickerValue(1, "yyyy-MM-DD HH:mm:ss");
  state.channelList = server.adminConfig.channel_type;
  state.channel = state.channelList[0].value;

  init();
});

watch(
  () => config.layout.isDark,
  (newValue) => {
    state.myChart.dispose();
    state.myChart = echarts.init(document.getElementById(`id_${state.uuid}`), newValue ? "dark" : "");
    state.myChart.setOption(echartsOption, true);
  }
);
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as *;
.lineChartsBox {
  background: var(--lowkey-bg-color-overlay);
  margin-bottom: 20px;

  &-header {
    @include flexBetween;
    padding: 20px;
  }

  &-charts {
    font-size: 0;
  }
}
.echartsPanel {
  width: 100%;
  height: 300px;
}
</style>
