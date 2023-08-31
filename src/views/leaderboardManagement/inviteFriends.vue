<!-- 排行榜单管理 - 邀请好友榜单配置 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitData :value="state.limit" title="上榜限制" type="success" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="init()" :loading="state.loading">查询</el-button>
      <el-button type="warning" disabled @click="changeVisible(1, true)">上榜限制编辑</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="180" align="center" prop="rank_section" label="排名" />
      <el-table-column min-width="180" align="center" prop="token_type" label="奖励类型" />
      <el-table-column min-width="180" align="center" prop="rank_award" label="奖励数据" />
      <el-table-column min-width="180" align="center" prop="c_time" label="创建时间" />
      <el-table-column width="80" align="center" label="操作" fixed="right">
        <template #default="{ row }">
          <el-button type="warning" disabled @click="updateConfiguration(row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <DialogByLeaderboardConfiguration :visible="state.visibleByLeaderboardConfiguration" @changeVisible="changeVisible" @searchData="init" />
    <DialogByLeaderboardReward :visible="state.visibleByLeaderboardReward" :doItem="state.doItem" @changeVisible="changeVisible" @searchData="init" />
  </div>
</template>

<script setup>
import DialogByLeaderboardConfiguration from "./components/DialogByLeaderboardConfiguration.vue";
import DialogByLeaderboardReward from "./components/DialogByLeaderboardReward.vue";

import { onMounted, reactive } from "vue";
import { useServer } from "@/stores/server";
import { GetFormatDateBySeconds } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "排行榜单管理 - 邀请好友榜单配置",
  loading: false,

  pageTypeList: [],
  pageType: 1,

  requestResult: [],
  datePickerValue: [],
  rankTypeList: [],
  rankType: "",
  limit: 0,

  doItem: {},
  visibleByLeaderboardConfiguration: false,
  visibleByLeaderboardReward: false,

  currentPage: 1,
  pageSize: 20,
  pageSizes: [20, 50, 100],
  pageCount: 1,
});

const init = async () => {
  state.loading = true;

  try {
    await getConfigurationList();
    await getLimitData();
  } catch (error) {}

  state.loading = false;
};

const getConfigurationList = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.leaderboardManagement.leaderboard
      .GetConfigurationList({
        rank_type: state.rankType,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
      })
      .then((res) => {
        state.requestResult = res.data.data;
        state.requestResult.forEach((item) => {
          item.c_time = GetFormatDateBySeconds(item.c_time);
        });
        state.currentPage = res.data.page;
        state.pageCount = res.data.count;
        resolve();
      })
      .catch((error) => reject(error));
  });
};

const getLimitData = () => {
  return new Promise((resolve, reject) => {
    $api.leaderboardManagement.leaderboard
      .GetRankLimitData({
        rank_type: state.rankType,
      })
      .then((res) => {
        state.limit = res.data.val;
        resolve();
      })
      .catch((error) => reject(error));
  });
};

const changeVisible = (value, flag) => {
  switch (value) {
    case 1:
      state.visibleByLeaderboardConfiguration = flag;
      break;

    case 2:
      state.visibleByLeaderboardReward = flag;
      break;
  }
};

const updateConfiguration = (e) => {
  state.doItem = e;
  changeVisible(2, true);
};

onMounted(() => {
  state.rankType = server.adminConfig.rank_type_map.find((item) => item.label == "邀请榜单").value;

  init();
});
</script>
