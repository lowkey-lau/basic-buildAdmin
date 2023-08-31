<!-- 广告配置 - 热冷启动广告配置 -->
<template>
  <div class="initPanel paramSetting">
    <el-space fill wrap :size="20" style="width: 100%">
      <el-card v-for="(item, index) in state.configList" :key="index">
        <el-descriptions :column="1" border>
          <template #title>
            <span class="initSubTitle">{{ item.boot_type == 0 ? "热启动" : "冷启动" }}</span>
          </template>
          <template #extra><el-button type="warning" disabled @click="editConfiguration(1)">编辑</el-button></template>
          <el-descriptions-item label="间隔时长" v-if="item.boot_type == 0"> {{ item.time }}s </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="item.switch ? 'success' : 'info'">{{ item.switch ? "开启" : "关闭" }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-space>

    <DialogByAdLaunchConfiguration
      :visible="state.visibleByAdLaunchConfiguration"
      :doType="state.doType"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByAdLaunchConfiguration from "./components/DialogByAdLaunchConfiguration.vue";

import { onMounted, reactive } from "vue";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "广告配置 - 热冷启动广告配置",

  configList: [],

  doType: 1,
  visibleByAdLaunchConfiguration: false,
});

const init = async () => {
  try {
    state.configList = await getRequestData();
  } catch (error) {}
};

const getRequestData = () => {
  return new Promise((reslove, reject) => {
    $api.advertisingManagement.adLaunchConfiguration
      .GetConfigurationList()
      .then((res) => reslove(res.data))
      .catch((error) => reject(error));
  });
};

const editConfiguration = (e) => {
  state.doType = e;
  changeVisible(1, true);
};

const changeVisible = (e, flag) => {
  switch (e) {
    case 1:
      state.visibleByAdLaunchConfiguration = flag;
      break;
  }
};
const searchData = (type) => {
  // switch (type) {
  //   case 1:
  //     getModulesConfig();
  //     break;
  // }
};

onMounted(() => {
  init();
});
</script>

<style lang="scss">
.paramSetting {
  .el-descriptions__label {
    width: 240px;
  }
}
</style>
