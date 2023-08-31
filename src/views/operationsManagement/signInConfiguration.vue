<!-- 运营管理 - 签到管理 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitSelect v-model="state.channel" title="签到档位" :list="state.channelList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="180" align="center" prop="day" label="签到天数" />
      <el-table-column min-width="180" align="center" prop="gear" label="签到档位" />
      <el-table-column min-width="180" align="center" prop="signin_award" label="奖励数据" />
      <el-table-column min-width="180" align="center" prop="video_award" label="观看视频奖励" />
      <el-table-column min-width="180" align="center" prop="c_time" label="创建时间" />
      <el-table-column width="80" align="center" label="操作" fixed="right">
        <template #default="{ row }">
          <el-button disabled type="warning" @click="editConfiguration(row)" size="small">编辑</el-button>
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

    <DialogBySignInConfiguration :visible="state.visibleBySignInConfiguration" :doItem="state.doItem" @changeVisible="changeVisible" @searchData="searchData" />
  </div>
</template>

<script setup>
import DialogBySignInConfiguration from "./components/DialogBySignInConfiguration.vue";

import { onMounted, reactive } from "vue";
import { useServer } from "@/stores/server";
import { GetFormatZoomDateBySeconds, GetDatePickerValue, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "运营管理 - 签到管理",
  loading: false,

  requestResult: [],
  datePickerValue: [],
  channelList: [],
  channel: "",

  doItem: {},
  visibleBySignInConfiguration: false,

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
      item.c_time = GetFormatZoomDateBySeconds(item.c_time);
    });
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.operationsManagement.signInConfiguration
      .GetConfigurationList({
        gear: state.channel,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const changeVisible = (value, flag) => {
  switch (value) {
    case 1:
      state.visibleBySignInConfiguration = flag;
  }
};

const editConfiguration = (e) => {
  state.doItem = e;
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

onMounted(() => {
  // state.datePickerValue = GetDatePickerValue(7);
  // state.channelList = server.adminConfig.channel_type;
  // state.channel = state.channelList[0].value;
  searchData();
});
</script>

<style lang="scss" scoped>
//
</style>
