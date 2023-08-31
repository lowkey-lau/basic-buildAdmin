<template>
  <div class="itemDataBox">
    <div class="itemDataBox-container">
      <div class="itemDataBox-item" v-for="(item, index) in $props.data" :key="index">
        <div class="itemDataBox-label">{{ item.label }}</div>
        <div class="itemDataBox-content">
          <div class="itemDataBox-num" :id="`item_id_${index}`">{{ item.current }}</div>
          <div class="itemDataBox-rate">{{ item.rateStr }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, onBeforeMount, watch } from "vue";
import { CountUp } from "countup.js";

import $BigNumber from "bignumber.js";

const $props = defineProps({
  data: Array,
});

const countUpFun = (id) => {
  nextTick(() => {
    let value = document.getElementById(id)?.innerText;

    if (value) {
      new CountUp(id, parseInt(value), {
        startVal: 0,
        duration: 3,
      }).start();
    }
  });
};

const initCountUp = () => {
  $props.data.forEach((item, index) => {
    item.rateStr = $BigNumber(item.chain_ratio).times(100).toFixed(2) + "%";
    countUpFun(`item_id_${index}`);
  });
};

onBeforeMount(() => {
  initCountUp();
});

watch(
  () => $props.data,
  (e1, _e1) => {
    if (_e1) {
      initCountUp();
    }
  }
);
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as *;
.itemDataBox {
  width: 100%;
  width: calc(100% + 20px);
  margin-left: -10px;
  margin-bottom: 20px;

  &-container {
    @include flexCenter;
    padding: 0 10px;
  }

  &-item {
    @include flexCenterColumn;
    @include initTransition(0.3);
    background-color: var(--lowkey-bg-color-overlay);
    border-radius: var(--el-border-radius-base);
    padding: 24px;
    flex: 1;
    margin-right: 30px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      -webkit-transform: translateY(-4px) scale(1.02);
      -moz-transform: translateY(-4px) scale(1.02);
      -ms-transform: translateY(-4px) scale(1.02);
      -o-transform: translateY(-4px) scale(1.02);
      transform: translateY(-4px) scale(1.02);
      z-index: 999;
      box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
    }
  }

  &-label {
    color: #92969a;
    font-size: 16px;
    width: 100%;
  }

  &-content {
    @include flexCenter;
    align-items: flex-end;
    color: #2c3f5d;
    width: 100%;
    margin-top: 15px;
  }

  &-num {
    flex: 1;
    font-size: 28px;
    font-weight: bold;
  }

  &-rate {
    font-size: 14px;
  }
}
</style>
