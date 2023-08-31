<!-- 数据管理 - 留存数据 -->
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
      <el-table-column min-width="100" align="center" prop="time" label="日期" fixed="left" />
      <el-table-column min-width="180" align="center" prop="channel" label="渠道号" fixed="left" />
      <el-table-column min-width="100" align="center" prop="new_count" label="新增注册" />
      <el-table-column min-width="90" align="center" prop="2_day_retained" label="2日留存" />
      <el-table-column min-width="90" align="center" prop="3_day_retained" label="3日留存" />
      <el-table-column min-width="90" align="center" prop="4_day_retained" label="4日留存" />
      <el-table-column min-width="90" align="center" prop="5_day_retained" label="5日留存" />
      <el-table-column min-width="90" align="center" prop="6_day_retained" label="6日留存" />
      <el-table-column min-width="90" align="center" prop="7_day_retained" label="7日留存" />
      <el-table-column min-width="90" align="center" prop="8_day_retained" label="8日留存" />
      <el-table-column min-width="90" align="center" prop="9_day_retained" label="9日留存" />
      <el-table-column min-width="90" align="center" prop="10_day_retained" label="10日留存" />
      <el-table-column min-width="90" align="center" prop="11_day_retained" label="11日留存" />
      <el-table-column min-width="90" align="center" prop="12_day_retained" label="12日留存" />
      <el-table-column min-width="90" align="center" prop="13_day_retained" label="13日留存" />
      <el-table-column min-width="90" align="center" prop="14_day_retained" label="14日留存" />
      <el-table-column min-width="90" align="center" prop="21_day_retained" label="21日留存" />
      <el-table-column min-width="90" align="center" prop="30_day_retained" label="30日留存" />
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
  pageTitle: "数据管理 - 留存数据",
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
      .GetRetainedData({
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
