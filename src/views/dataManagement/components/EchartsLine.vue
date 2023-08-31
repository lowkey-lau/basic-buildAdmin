<template>
  <div class="echartsPanel initCharts" id="echartsLine"></div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import * as echarts from "echarts";
import { GetFormatZoomDateBySeconds } from "@/utils/timeTools";

const $props = defineProps({
  echartsData: Object,
});

const echartsOption = reactive({
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

const initEchats = (props) => {
  let myChart = echarts.init(document.getElementById("echartsLine"));
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

  myChart.setOption(echartsOption, true);
  window.onresize = function () {
    //自适应大小
    myChart.resize();
  };
};
onMounted(() => {
  //需要获取到element,所以是onMounted的Hook
  initEchats($props.echartsData);
});

watch(
  () => $props.echartsData,
  (newProps) => {
    initEchats(newProps);
  }
);
</script>

<style lang="scss" scoped>
.echartsPanel {
  width: 100%;
}
</style>
