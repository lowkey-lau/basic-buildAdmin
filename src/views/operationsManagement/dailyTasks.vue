<!-- 运营管理 - 日常任务 -->
<template>
  <div class="initPanel paramSetting">
    <el-space fill wrap :size="20" style="width: 100%">
      <el-card v-for="(item, index) in state.configList" :key="index">
        <el-descriptions :column="1" border>
          <template #title
            ><span class="initSubTitle">{{ item.task_name }}</span></template
          >
          <template #extra><el-button disabled type="warning" @click="editConfiguration(1)">编辑</el-button></template>
          <el-descriptions-item label="任务参数">{{ item.param }}</el-descriptions-item>
          <el-descriptions-item label="任务奖励翻倍">{{ item.award }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-space>
    <DialogByDailyTasks :visible="state.visibleByDailyTasks" :doType="state.doType" @changeVisible="changeVisible" @searchData="searchData" />
  </div>
</template>

<script setup>
import DialogByDailyTasks from "./components/DialogByDailyTasks.vue";

import { onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "运营管理 - 日常任务",

  configList: [],

  doType: 1,
  visibleByDailyTasks: false,
});

const init = async () => {
  try {
    state.configList = await getRequestData();
  } catch (error) {}

  console.log(state.configList);
};

const getRequestData = () => {
  return new Promise((resolve, reject) => {
    $api.operationsManagement.dailyTasks
      .GetConfigurationList()
      .then((res) => resolve(res.data))
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
      state.visibleByDailyTasks = flag;
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
