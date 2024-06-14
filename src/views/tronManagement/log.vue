<!-- 数据管理 - 用户列表 -->
<template>
  <div class="initPanel">
    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column align="center" prop="id" label="Id" />
      <el-table-column align="center" prop="from" label="From" />
      <el-table-column align="center" prop="to" label="To" />
      <el-table-column align="center" prop="amount" label="数量" />
      <el-table-column align="center" prop="type" label="类别" />
      <el-table-column align="center" prop="txid" label="交易哈希" />
      <el-table-column align="center" prop="block_num" label="区块" />
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
import { ElMessage } from "element-plus";

const server = useServer();

const state = reactive({
  pageTitle: "数据管理 - 综合数据",
  loading: false,

  requestResult: [],
  selectItem: {},
  sexStr: {
    0: "男",
    1: "女",
  },

  visibleByModifyInfo: false,

  currentPage: 1,
  pageSize: 20,
  pageSizes: [20, 50, 100],
  pageCount: 1,
});

const searchData = async () => {
  state.loading = true;

  try {
    let returnResult = await getRequestData();
    console.log(returnResult);
    state.requestResult = returnResult.list;
    state.currentPage = Number(returnResult.pageNum);
    state.pageCount = returnResult.total;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.tronManagement.config
      .GetApiTradeLog({
        pageNum: state.currentPage,
        pageSize: state.pageSize,
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
  searchData();
});
</script>
