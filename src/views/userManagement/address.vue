<!-- 用户管理 - 用户钱包 -->
<template>
  <div class="initPanel">
    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column align="center" prop="account" label="用户名" />
      <el-table-column align="center" prop="address" label="地址" />
      <el-table-column align="center" prop="mnemonic" label="助记词" />
      <el-table-column align="center" prop="private_key" label="私钥" />
      <el-table-column align="center" prop="create_time" label="创建时间" />
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
  pageTitle: "用户管理 - 综合数据",
  loading: false,

  requestResult: [],
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
    state.requestResult = returnResult.list;
    state.currentPage = Number(returnResult.pageNum);
    state.pageCount = returnResult.total;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.userManagement
      .GetAddressList({
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

const editInfo = (e) => {
  state.selectItem = e;
  changeVisible(1, true);
};

const confirmEvent = (e) => {
  $api.userManagement
    .DeleteAccount({
      account: e.account,
    })
    .then((res) => {
      ElMessage.success("删除成功");
      searchData();
    });
};

const changeVisible = (type, e) => {
  switch (type) {
    case 1:
      state.visibleByModifyInfo = e;
      break;
  }
};

onMounted(() => {
  searchData();
});
</script>
