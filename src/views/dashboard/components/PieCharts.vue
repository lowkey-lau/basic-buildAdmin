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
import * as echarts from "echarts";
import { v4 as uuidv4 } from "uuid";
console.log(uuidv4());

const state = reactive({
  uuid: uuidv4(),
  type: 0,
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
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
});

const initEchats = (props) => {
  let myChart = echarts.init(document.getElementById(`id_${state.uuid}`));
  let data = props.map((item) => {
    return {
      name: item.version,
      value: item.user_count,
    };
  });
  echartsOption.series[0].data = data;

  myChart.setOption(echartsOption, true);
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

// export default {
//   props: {
//     echartsData: Array,
//   },
//   setup(props) {

//   },
// };
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
