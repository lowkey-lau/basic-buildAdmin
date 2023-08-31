<!-- 运营管理 - 问题反馈 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" type="datetimerange" />
      <InitInput v-model="state.userId" title="用户ID" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" :loading="state.loading" @click="searchData()">查询</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" border>
      <el-table-column min-width="120" align="center" prop="username" label="用户昵称" />
      <el-table-column min-width="180" align="center" prop="test" label="问题类型" />
      <el-table-column min-width="100" align="center" prop="user_id" label="用户ID" />
      <el-table-column min-width="180" align="center" prop="contact" label="用户联系方式" />
      <el-table-column min-width="180" align="center" prop="time" label="反馈时间" />
      <el-table-column min-width="180" align="center" label="反馈图片">
        <template #default="{ row, $index }">
          <el-space direction="vertical" v-if="row.image?.length > 0">
            <el-image style="width: 100px; height: 100px" :src="row.image[0]" :preview-src-list="row.image" fit="cover" preview-teleported :z-index="9999" />
            <el-tag type="warning">{{ `共${row.image?.length}张` }}</el-tag>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column min-width="360" align="center" prop="text" label="反馈内容" />
      <el-table-column width="120" align="center" label="操作" fixed="right">
        <template #default="{ row }">
          <el-button type="warning" @click="previewFeedback(row)">详情</el-button>
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

    <DialogByFeedbackPreview :visible="state.visibleByPreviewFeedback" :doItem="state.doItem" @changeVisible="changeVisible" />
  </div>
</template>

<script setup>
import DialogByFeedbackPreview from "./components/DialogByFeedbackPreview.vue";

import { onMounted, reactive } from "vue";
import { GetFormatZoomDateBySeconds, GetDatePickerValue, GetTimestampByZoom, GetEndTimestampByZoom } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "系统管理 - 问题反馈",
  loading: false,

  requestResult: [],
  datePickerValue: [],
  userId: "",
  doItem: {},

  visibleByPreviewFeedback: false,

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
    });

    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.operationsManagement.userFeedback
      .GetData({
        start: GetTimestampByZoom(state.datePickerValue[0]),
        end: GetTimestampByZoom(state.datePickerValue[1]),
        query_user_id: state.userId,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const previewFeedback = (e) => {
  state.doItem = e;
  changeVisible(1, true);
};

const changeVisible = (_type, _flag) => {
  switch (_type) {
    case 1:
      state.visibleByPreviewFeedback = _flag;
      break;
  }
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

  searchData();
});
</script>
