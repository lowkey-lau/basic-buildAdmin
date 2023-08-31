<!-- 用户信息 - 用户金币流水 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" type="datetimerange" />
      <InitSelect v-model="state.channel" title="渠道号" :list="state.channelList" />
      <InitSelect v-model="state.source" title="变化类型" :list="state.sourceList" />
      <InitInput v-model="state.offerId" title="收益来源商单ID" />
      <InitInput v-model="state.nickName" title="昵称" />
      <InitInput v-model="state.userId" title="用户ID" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="180" align="center" sortable prop="time" label="时间" fixed="left" />
      <el-table-column min-width="180" align="center" prop="channel_key" label="渠道号" />
      <el-table-column min-width="180" align="center" prop="user_id" label="用户ID" />
      <el-table-column min-width="180" align="center" prop="nickname" label="昵称" />
      <el-table-column min-width="180" align="center" prop="sourceStr" label="变化类型" />
      <el-table-column min-width="180" align="center" prop="offer_id" label="收益来源的商单ID" />
      <el-table-column min-width="180" align="center" prop="variation" label="变化值" />
      <el-table-column min-width="180" align="center" prop="balance" label="金币余额" />
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
import { FilterLabelByValue } from "@/utils/common";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "用户信息 - 用户金币流水",
  loading: false,

  requestResult: [],
  datePickerValue: [],
  channelList: [],
  channel: "",
  sourceList: [],
  source: "",
  offerId: "",
  nickName: "",
  userId: "",

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
      item.time = GetFormatZoomDateBySeconds(item.time);
      item.sourceStr = FilterLabelByValue(state.sourceList, item.source);
    });

    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.userManagement.userGoldCoinTurnover
      .GetUserFlow({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetTimestampByZoom(state.datePickerValue[1]),
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
        channel: state.channel,
        source: state.source,
        offer_id: state.offerId,
        nickname: state.nickName,
        query_user_id: state.userId,
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
  state.datePickerValue = GetDatePickerValue(7, "yyyy-MM-DD HH:mm:ss");

  state.channelList = server.adminConfig.channel_type;
  state.sourceList = server.adminConfig.source_type_map;

  searchData();
});
</script>
