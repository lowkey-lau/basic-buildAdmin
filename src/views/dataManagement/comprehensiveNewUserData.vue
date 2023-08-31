<!-- 数据管理 - 新用户数据 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" />
      <InitSelect v-model="state.channel" title="渠道" :list="state.channelList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="100" align="center" prop="time" label="日期" />
      <el-table-column min-width="180" align="center" prop="channel_key" label="渠道号" />
      <el-table-column min-width="120" align="center" prop="register_count" label="注册人数" />
      <el-table-column min-width="120" align="center" prop="invite_count" label="邀请注册人数" />
      <el-table-column min-width="120" align="center" prop="user_count" label="接单人数" />
      <el-table-column min-width="120" align="center" prop="user_count_valid" label="有效接单人数" />
      <el-table-column min-width="120" align="center" prop="aver_count" label="人均接单人数" />
      <el-table-column min-width="120" align="center" prop="task_finish_rate" label="任务完成率" />
      <el-table-column min-width="120" align="center" prop="offer_award" label="商单奖励" />
      <el-table-column min-width="120" align="center" prop="invite_award" label="邀请奖励" />
      <el-table-column min-width="120" align="center" prop="commission_award" label="分销返佣奖励" />
      <el-table-column min-width="120" align="center" prop="all_award" label="总奖励" />
      <el-table-column min-width="120" align="center" prop="all_withdraw" label="总提现" />
      <el-table-column min-width="120" align="center" prop="withdraw_count" label="提现人数" />
      <el-table-column min-width="160" align="center" prop="incentive_video_count" label="激励视频观看次数" />
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
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useServer } from "@/stores/server";
import { GetFormatZoomDateBySeconds, GetDatePickerValue, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "数据管理 - 新用户数据",
  loading: false,

  requestResult: [],
  datePickerValue: [],
  channelList: [],
  channel: "",

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
      item.time = GetFormatZoomDateBySeconds(item.time, "America/Sao_Paulo", "yyyy-MM-DD");
    });
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.dataManagement
      .GetNewUserComprehensiveData({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetEndTimestampByZoom(state.datePickerValue[1]),
        channel: state.channel,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
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
  state.datePickerValue = GetDatePickerValue(7);

  state.channelList = server.adminConfig.channel_type;
  state.channel = state.channelList[0].value;

  searchData();
});
</script>
