<!-- 版本管理 - 审核开关 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="15">
      <el-button type="primary" :loading="state.loading" @click="searchData()">查询</el-button>
      <el-button type="warning" @click="changeVisible(1, true)">添加大版本号</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestData" v-loading="state.loading" border>
      <el-table-column min-width="180" align="center" label="渠道号">
        <template #default="{ row }">
          <el-tag type="warning">{{ row.channel_str }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="180" align="center" prop="version" label="版本号" />
      <el-table-column min-width="180" align="center" prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.state == 0 ? 'info' : 'success'">{{ row.stateStr }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="240" align="center" label="操作" fixed="right">
        <template #default="{ row }">
          <el-button type="warning" @click="updateConfig(row)">改变审核状态</el-button>
          <el-button type="danger" @click="deleteConfig(row)">删除</el-button>
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

    <DialogByAuditSwitch :visible="state.visibleByAudioSwitch" @changeVisible="changeVisible" @searchData="searchData" />
  </div>
</template>

<script setup>
import DialogByAuditSwitch from "./components/DialogByAuditSwitch.vue";
import { onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { EleLoading, EleNBox } from "@/utils/ele";
import { FilterLabelByValue } from "@/utils/common";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "版本管理 - 审核开关",

  requestData: [],
  stateList: [
    { label: "未开启", value: 0 },
    { label: "已开启", value: 1 },
  ],

  visibleByAudioSwitch: false,

  // 表格相关
  currentPage: 1,
  pageSize: 20,
  pageSizes: [20, 50, 100],
  pageCount: 1,
});

const searchData = async (e) => {
  state.loading = true;

  try {
    let returnResult = await getRequestData();
    state.requestData = returnResult.result;
    state.requestData.forEach((item) => {
      item.stateStr = FilterLabelByValue(state.stateList, item.state);
    });
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.total;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = () => {
  return new Promise((resolve, reject) => {
    $api.versionManagement.auditSwitch
      .GetChannelVersionAuditList({
        page: state.currentPage,
        page_size: state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const updateConfig = (e) => {
  ElMessageBox.confirm("确认修改操作?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $api.versionManagement.auditSwitch
      .EditChannelVersionAudit({
        channel_str: e.channel_str,
        version: e.version,
        state: e.state == 0 ? 1 : 0,
      })
      .then((res) => {
        EleNBox.success("修改成功");
        searchData();
      });
  });
};

const deleteConfig = (e) => {
  ElMessageBox.confirm("确认删除操作?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $api.versionManagement.auditSwitch
      .DeleteChannelVersionAudit({
        channel_str: e.channel_str,
        version: e.version,
      })
      .then((res) => {
        EleNBox.success("删除成功");
        searchData();
      });
  });
};

const changeVisible = (type, flag) => {
  switch (type) {
    case 1:
      state.visibleByAudioSwitch = flag;
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
