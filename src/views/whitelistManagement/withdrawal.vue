<!-- 白名单管理 - 提现白名单 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" @click="createWhitelist()">新增用户</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="60" align="center" prop="db_id" label="序号" />
      <el-table-column min-width="100" align="center" prop="white_user_id" label="用户ID" />
      <el-table-column min-width="120" align="center" :label="item.label" v-for="item in state.withdrawMap" :key="item">
        <template #default="{ row, $index }">
          <el-tag :type="row[`${item.value}`] == 1 ? 'success' : 'danger'">{{ row[`${item.value}`] == 1 ? "开" : "关" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="140" align="center" label="操作" fixed="right">
        <template #default="{ row, $index }">
          <el-button type="warning" @click="editWhitelist(row)" size="small">编辑</el-button>
          <el-button type="danger" @click="deleteWhitelist(row)" size="small">删除</el-button>
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

    <DialogByWithdrawal
      :visible="state.visibleByWithdrawal"
      :doType="state.doType"
      :doItem="state.doItem"
      :withdrawMap="state.withdrawMap"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByWithdrawal from "./components/DialogByWithdrawal.vue";
import { onMounted, reactive } from "vue";
import { EleLoading, EleNBox } from "@/utils/ele";
import { ElMessageBox } from "element-plus";
import { useServer } from "@/stores/server";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "白名单管理 - 提现白名单",
  loading: false,

  requestResult: [],
  withdrawMap: [],

  doType: 1,
  doItem: {},

  visibleByWithdrawal: false,

  currentPage: 1,
  pageSize: 20,
  pageSizes: [20, 50, 100],
  pageCount: 1,
});

const searchData = async () => {
  state.loading = true;

  try {
    let returnResult = await getRequestData();
    state.requestResult = returnResult.data_info;
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.whitelistManagement.withdrawal
      .GetWhitelistRecord({
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const createWhitelist = () => {
  state.doType = 1;
  changeVisible(1, true);
};

const editWhitelist = async (e) => {
  EleLoading.show();

  try {
    state.doType = 2;
    const requestData = await getWhitelistDetail(e);
    state.doItem = requestData.game_data;
    changeVisible(1, true);
  } catch (error) {
    console.log(error);
  }

  EleLoading.hide();
};

const getWhitelistDetail = async (e) => {
  return new Promise((resolve, reject) => {
    $api.whitelistManagement.withdrawal
      .GetWhitelistDetail({
        db_id: e.db_id,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const deleteWhitelist = (e) => {
  ElMessageBox.confirm(`确定删除吗`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      $api.whitelistManagement.withdrawal.DeleteWhitelist({ db_id: e.db_id }).then((res) => {
        EleNBox.success("操作成功");
        searchData();
      });
    })
    .catch(() => {
      EleNBox.error("取消操作");
    });
};

const changeVisible = (value, flag) => {
  switch (value) {
    case 1:
      state.visibleByWithdrawal = flag;
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
  state.withdrawMap = server.adminConfig.withdraw_limit_map;

  searchData();
});
</script>
