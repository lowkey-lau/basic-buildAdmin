<!-- H5小游戏管理 - H5小游戏配置 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitInput v-model="state.gameName" title="游戏名称" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" @click="createOrder(1, true)">新增H5小游戏</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="60" align="center" sortable prop="db_id" label="排序" />
      <el-table-column min-width="120" align="center" prop="game_name" label="游戏名称" />
      <el-table-column min-width="140" align="center" prop="introduce" label="游戏简介" show-overflow-tooltip />
      <el-table-column min-width="100" align="center" label="图标">
        <template #default="{ row }">
          <el-image style="width: 80px; height: 80px" :src="row.icon" :preview-src-list="[row.icon]" preview-teleported close-on-press-escape />
        </template>
      </el-table-column>
      <el-table-column min-width="260" align="center" label="宣传图">
        <template #default="{ row }">
          <el-image style="width: 240px; height: 80px" :src="row.image" :preview-src-list="[row.image]" preview-teleported close-on-press-escape />
        </template>
      </el-table-column>
      <el-table-column min-width="240" align="center" prop="url" label="链接" show-overflow-tooltip />
      <el-table-column width="140" align="center" label="操作" fixed="right">
        <template #default="scope">
          <el-button type="warning" @click="editOrder(scope.row)" size="small">编辑</el-button>
          <el-button type="danger" @click="deletePrompt(scope.row)" size="small">删除</el-button>
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

    <DialogByGameConfiguration
      :visible="state.visibleByGameConfiguration"
      :doType="state.doType"
      :doItem="state.doItem"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByGameConfiguration from "./components/DialogByGameConfiguration.vue";

import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { EleLoading, EleNBox } from "@/utils/ele";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "H5小游戏管理 - H5小游戏配置",
  loading: false,

  requestResult: [],
  gameName: "", //App名称

  doType: 1, //1新增 2修改
  doItem: {},
  visibleByGameConfiguration: false,

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
    state.requestResult = returnResult.game_list;
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.total;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.gameManagement.gameConfiguration
      .GetConfigurationList({
        game_name: state.gameName,
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

const createOrder = (type, value) => {
  state.doType = 1;
  changeVisible(type, value);
};

const editOrder = (e) => {
  state.doType = 2;
  state.doItem = e;

  if (state.doType == 2) {
    getOrderDetail(e);
  }
};

const getOrderDetail = (e) => {
  EleLoading.show();

  $api.gameManagement.gameConfiguration
    .GetConfigurationDetail({
      db_id: e.db_id,
    })
    .then((res) => {
      state.doItem = res.data.game_data;
      changeVisible(1, true);
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const deletePrompt = (e) => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteConfiguration(e);
  });
};

const deleteConfiguration = (e) => {
  $api.gameManagement.gameConfiguration
    .DeleteConfiguration({
      db_id: e.db_id,
    })
    .then(() => {
      EleNBox.success("删除成功");
      searchData();
    });
};

const changeVisible = (e, flag) => {
  switch (e) {
    case 1:
      state.visibleByGameConfiguration = flag;
      break;
  }
};

onMounted(() => {
  searchData();
});
</script>
