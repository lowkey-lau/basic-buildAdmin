<!-- 商单管理 - 商单数据（天） -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" />
      <InitInput v-model="state.offerId" title="Offer ID" />
      <InitSelect v-model="state.channel" title="渠道" :list="state.channelList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="120" align="center" prop="time" label="日期" fixed="left" />
      <el-table-column min-width="180" align="center" prop="channel_key" label="渠道号" />
      <el-table-column min-width="180" align="center" prop="offer_name" label="Offer名称" show-overflow-tooltip />
      <el-table-column min-width="100" align="center" prop="offer_id" label="Offer ID" />
      <el-table-column min-width="100" align="center" prop="take_offer_count" label="接单人数" />
      <el-table-column min-width="120" align="center" prop="valid_offer_count" label="有效接单人数" />
      <el-table-column min-width="80" align="center" prop="finish_count" label="完单人数" />
      <el-table-column min-width="80" align="center" prop="install_count" label="安装人数" />
      <el-table-column min-width="80" align="center" prop="activate_count" label="激活人数" />
      <el-table-column min-width="120" align="center" label="任务完成总数">
        <template #default="{ row }">
          <el-popover effect="light" trigger="hover" placement="top" width="auto" :disabled="row.subtask_completion.length == 0">
            <template #default>
              <el-descriptions :column="10" direction="vertical" border size="small">
                <el-descriptions-item align="center" :label="item.label" v-for="(item, index) in row.subtask_completion" :key="index">
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
            <template #reference>
              <el-tag>{{ row.completion }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="140" align="center" prop="aver_completion" label="人均完成任务数" />
      <el-table-column min-width="120" align="center" prop="total_award" label="当日总奖励" />
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
import { onBeforeMount, reactive } from "vue";
import { useServer } from "@/stores/server";
import { GetFormatZoomDateBySeconds, GetDatePickerValue, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "商单管理 - 商单数据（天）",
  loading: false,

  requestResult: [],
  datePickerValue: [],
  channelList: [],
  channel: "",
  offerId: "",

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
    $api.orderManagement.orderDataByDaily
      .GetList({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetEndTimestampByZoom(state.datePickerValue[1]),
        offer_id: state.offerId,
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

// onMounted(() => {
//   state.datePickerValue = GetDatePickerValue(7);
//   state.channelList = server.adminConfig.channel_type;
//   state.channel = state.channelList[0].value;

//   searchData();
// });

onBeforeMount(() => {
  state.datePickerValue = GetDatePickerValue(7);
  state.channelList = server.adminConfig.channel_type;
  state.channel = state.channelList[0].value;

  searchData();
});
</script>
