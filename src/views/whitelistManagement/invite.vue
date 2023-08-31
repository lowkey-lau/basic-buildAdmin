<!-- 白名单管理 - 提现白名单 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" @click="createWhitelist()">新增用户</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="60" align="center" prop="id" label="序号" />
      <el-table-column min-width="100" align="center" prop="user_id" label="用户ID" />
      <el-table-column min-width="100" align="center" prop="username" label="用户昵称" />

      <el-table-column min-width="120" align="center" label="同IP限制">
        <template #default="{ row, $index }">
          <el-tag :type="row.same_ip ? 'success' : 'danger'">{{ row.same_ip ? "开" : "关" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="同设备限制">
        <template #default="{ row, $index }">
          <el-tag :type="row.same_device ? 'success' : 'danger'">{{ row.same_device ? "开" : "关" }}</el-tag>
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

    <DialogByInvite
      :visible="state.visibleByWithdrawal"
      :doType="state.doType"
      :doItem="state.doItem"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByInvite from "./components/DialogByInvite.vue";
import { onMounted, reactive } from "vue";
import { EleLoading, EleNBox } from "@/utils/ele";
import { ElMessageBox } from "element-plus";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "白名单管理 - 提现白名单",
  loading: false,

  requestResult: [],

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
    state.requestResult = returnResult.data;
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.whitelistManagement.invite
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
  state.doType = 2;
  state.doItem = e;
  console.log(state.doItem);
  changeVisible(1, true);
};

const deleteWhitelist = (e) => {
  ElMessageBox.confirm(`确定删除吗`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      $api.whitelistManagement.invite.DeleteWhitelist({ record_id: e.id }).then((res) => {
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
  searchData();
});
</script>
