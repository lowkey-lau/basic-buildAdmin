<template>
  <div class="pieChartsBox">
    <div class="pieChartsBox-container">
      <div class="pieChartsBox-title">版本占比</div>
      <div class="pieChartsBox-charts">
        <div class="echartsPanel" :id="`id_${state.uuid}`"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useConfig } from "@/stores/config";
import * as echarts from "echarts";

const config = useConfig();
const state = reactive({
  uuid: uuidv4(),
  type: 0,
  myChart: null,
  datePickerValue: [],
  channelList: [],
  channel: "",
});

const $props = defineProps({
  data: Array,
});

const echartsOption = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "center",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
});

const initEchats = (props) => {
  state.myChart = echarts.init(document.getElementById(`id_${state.uuid}`), config.layout.isDark ? "dark" : "");
  let data = props.map((item) => {
    return {
      name: `v${item.version}`,
      value: item.user_count,
    };
  });
  echartsOption.series[0].data = data;

  state.myChart.setOption(echartsOption, true);
  window.onresize = function () {
    //自适应大小
    myChart.resize();
  };
};
onMounted(() => {
  //需要获取到element,所以是onMounted的Hook
  initEchats($props.data);
});

watch(
  () => $props.data,
  (newProps) => {
    initEchats(newProps);
  }
);

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
.pieChartsBox {
  background: var(--lowkey-bg-color-overlay);

  &-title {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color);
  }
}
.echartsPanel {
  width: 100%;
  height: 400px;
}
</style>
