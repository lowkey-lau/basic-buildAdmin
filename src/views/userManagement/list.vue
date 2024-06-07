<!-- 数据管理 - 用户列表 -->
<template>
  <div class="initPanel">
    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="120" align="center" prop="account" label="用户名" />
      <el-table-column min-width="120" align="center" prop="nickname" label="昵称" />
      <el-table-column min-width="120" align="center" prop="identity" label="身份" />
      <el-table-column min-width="120" align="center" prop="sex" label="性别">
        <template #default="scope">
          <el-tag :type="scope.row.sex == 0 ? 'primary' : 'danger'">{{ state.sexStr[scope.row.sex] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" prop="email" label="邮箱" />
      <el-table-column min-width="120" align="center" label="头像地址">
        <template #default="scope"><el-avatar :src="scope.row.image_url" v-if="scope.row.image_url && scope.row.image_url !== ''" /></template>
      </el-table-column>
      <el-table-column min-width="180" align="center" prop="create_time" label="注册时间" />
      <el-table-column min-width="90" align="center" label="操作" fixed="right">
        <template #default="scope">
          <el-button type="warning" size="small" @click="editInfo(scope.row)">修改</el-button>

          <el-popconfirm title="确定删除吗?" @confirm="confirmEvent(scope.row)" v-if="scope.row.identityId != 999">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
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

    <DialogByModifyInfo :visible="state.visibleByModifyInfo" :userInfo="state.selectItem" @changeVisible="changeVisible" @searchData="searchData" />
  </div>
</template>

<script setup>
import DialogByModifyInfo from "./components/DialogByModifyInfo.vue";
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
    state.requestResult = returnResult.list;
    state.currentPage = Number(returnResult.pageNum);
    state.pageCount = returnResult.total;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.userManagement
      .GetList({
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
