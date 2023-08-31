<!-- 版本管理 - 版本更新 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitSelect v-model="state.channel" title="渠道号" :list="state.channelList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" @click="createVersionConfig()">新增版本</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" border>
      <el-table-column min-width="280" align="center" sortable prop="timeStr" label="发布时间" />
      <el-table-column min-width="120" align="center" label="渠道号">
        <template #default="{ row }">
          <!-- <el-tag v-if="row.must == 1">{{ row.upgradeTypeStr }}</el-tag> -->
          <el-tag type="warning">{{ row.channel_key }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" prop="version" label="版本号" />
      <el-table-column min-width="480" align="center" prop="download_path" label="下载地址" />

      <el-table-column width="180" align="center" label="操作" fixed="right">
        <template #default="scope">
          <el-button type="warning" @click="editConfig(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteConfig(scope.row)">删除</el-button>
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

    <DialogByVersionUpgrade
      :visible="state.visibleByVersionUpgrade"
      :doType="state.doType"
      :doItem="state.doItem"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByVersionUpgrade from "./components/DialogByVersionUpgrade.vue";

import { onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { useServer } from "@/stores/server";
import { EleNBox } from "@/utils/ele";
import { GetFormatZoomDateBySeconds } from "@/utils/timeTools";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "版本管理 - 版本更新",
  loading: false,

  requestResult: [],
  channelList: [],
  channel: "",

  doType: 1, //1新增 2编辑
  doItem: {},

  visibleByVersionUpgrade: false,

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
      item.timeStr = GetFormatZoomDateBySeconds(item.release_time, "America/Sao_Paulo");
    });
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.versionManagement.versionUpgrade
      .GetConfigurationList({
        channel: state.channel,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.total : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const createVersionConfig = () => {
  state.doType = 1;
  changeVisible(1, true);
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

const editConfig = (e) => {
  state.doType = 2;
  state.doItem = e;
  changeVisible(1, true);
};

const deleteConfig = (e) => {
  ElMessageBox.confirm(`确定删除吗`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      $api.versionManagement.versionUpgrade.DeleteConfiguration({ version_id: e.id }).then((res) => {
        EleNBox.success("操作成功");
        searchData();
      });
    })
    .catch(() => {
      EleNBox.error("取消操作");
    });
};

const changeVisible = (type, flag) => {
  switch (type) {
    case 1:
      state.visibleByVersionUpgrade = flag;
      break;
  }
};

onMounted(() => {
  state.channelList = server.adminConfig.channel_type;
  state.channel = state.channelList[0].value;

  searchData();
});
</script>
