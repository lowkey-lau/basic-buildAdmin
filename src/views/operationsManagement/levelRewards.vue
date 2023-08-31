<!-- 运营管理 - 等级奖励 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" disabled @click="createConfiguration()">新增配置</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" border>
      <el-table-column min-width="180" align="center" prop="level" label="等级" />
      <el-table-column min-width="180" align="center" prop="ex" label="经验值" />
      <el-table-column min-width="180" align="center" prop="reward_type" label="奖励类型" />
      <el-table-column min-width="180" align="center" prop="reward" label="奖励值" />

      <el-table-column width="120" align="center" label="操作" fixed="right">
        <template #default="scope">
          <el-button type="warning" disabled @click="editConfiguration(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="initPagination">
      <el-pagination
        :disabled="state.loading"
        :current-page="state.currentPage"
        :page-size="state.pageSize"
        :page-sizes="state.pageSizes"
        :total="state.pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <DialogByLevelRewards
      :visible="state.visibleByLevelRewards"
      :doType="state.doType"
      :doItem="state.doItem"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByLevelRewards from "./components/DialogByLevelRewards.vue";

import { onMounted, reactive } from "vue";
import { GetFormatZoomDateBySeconds } from "@/utils/timeTools";
import { useServer } from "@/stores/server";
import { FilterLabelByValue } from "@/utils/common";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "运营管理 - 等级奖励",
  loading: false,

  requestResult: [],
  levelRewardTypeList: [],
  channel: "",

  doType: 1, //1新增 2编辑
  doItem: {},

  visibleByLevelRewards: false,

  // 表格相关
  currentPage: 1,
  pageSize: 20,
  pageSizes: [20, 50, 100],
  pageCount: 1,
});

const searchData = async () => {
  state.loading = true;

  try {
    let returnResult = await getRequestData();
    state.requestResult = returnResult.data;
    state.requestResult.forEach((item) => {
      item.reward_type = FilterLabelByValue(state.levelRewardTypeList, item.reward_type);
    });
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.operationsManagement.levelRewards
      .GetConfigurationList({
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.total : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const createConfiguration = () => {
  state.doType = 1;
  changeVisible(1, true);
};

const handleSizeChange = (val) => {
  state.pageSize = val;
  searchData();
};

const handleCurrentChange = (page) => {
  if (state.currentPage != page) {
    state.currentPage = page;
    searchData();
  }
};

const editConfiguration = (e) => {
  state.doType = 2;
  state.doItem = e;

  changeVisible(1, true);
};

const changeVisible = (type, flag) => {
  switch (type) {
    case 1:
      state.visibleByLevelRewards = flag;
      break;
  }
};

onMounted(() => {
  state.levelRewardTypeList = server.adminConfig.level_reward_type;

  searchData();
});
</script>
