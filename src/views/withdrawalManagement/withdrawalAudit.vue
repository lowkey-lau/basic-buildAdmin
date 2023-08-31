<!-- 提现管理 - 提现审核 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" type="datetimerange" />
      <InitSelect v-model="state.withdrawStatus" title="状态" :list="state.withdrawStatusList" />
      <InitInput v-model="state.account" title="提现账户ID" />
      <InitInput v-model="state.userId" title="用户ID" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="success" :disabled="state.selectItems.length == 0" @click="batchAudit(2)">批量通过</el-button>
      <el-button type="danger" :disabled="state.selectItems.length == 0" @click="batchAudit(1)">批量拒绝</el-button>
    </el-space>

    <el-divider />

    <el-table
      class="initTable"
      :data="state.requestResult"
      v-loading="state.loading"
      element-loading-text="加载中"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column min-width="60" align="center" type="selection" :selectable="(row, index) => row.state == 0" fixed="left" />
      <el-table-column min-width="180" align="center" sortable prop="apply_time" label="申请时间" />
      <el-table-column min-width="180" align="center" prop="user_id" label="用户ID" />
      <el-table-column min-width="180" align="center" prop="methodStr" label="提现方式" />
      <el-table-column min-width="180" align="center" prop="amount" label="提现金额" />
      <el-table-column min-width="180" align="center" prop="total_award" label="生涯盈利" />
      <el-table-column min-width="180" align="center" prop="total_withdraw" label="生涯提现" />
      <el-table-column min-width="180" align="center" prop="invite_award" label="生涯邀请盈利" />
      <el-table-column min-width="180" align="center" prop="invitation_active_ratio" label="生涯邀请活跃占比" />
      <el-table-column min-width="180" align="center" prop="account" label="提现账户" />
      <el-table-column min-width="180" align="center" sortable prop="stateStr" label="状态" />
      <el-table-column min-width="180" align="center" label="操作" fixed="right">
        <template #default="scope">
          <el-button :disabled="scope.row.state != 0" type="success" @click="singleAudit(scope.row.id, 2)">通过</el-button>
          <el-button :disabled="scope.row.state != 0" type="danger" @click="singleAudit(scope.row.id, 1)">拒绝</el-button>
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
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { GetFormatDateBySeconds, GetTimestampBySeconds, GetDatePickerValue } from "@/utils/timeTools";
import { FilterLabelByValue } from "@/utils/common";
import { useServer } from "@/stores/server";
import { EleNBox } from "@/utils/ele";
import $api from "@/axios/api.js";

const server = useServer();

const state = reactive({
  pageTitle: "提现管理 - 提现审核",
  loading: false,

  requestResult: [],
  datePickerValue: [],
  withdrawStatusList: [],
  withdrawStatus: "",
  widthdrawMethodList: [],

  account: "", //提现账户
  userId: "", //用户ID
  selectItems: [],

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
      item.apply_time = GetFormatDateBySeconds(item.apply_time);
      item.stateStr = FilterLabelByValue(state.withdrawStatusList, item.state);
      item.methodStr = FilterLabelByValue(state.widthdrawMethodList, item.method);
    });
    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.withdrawalManagement.withdrawalAudit
      .GetWithdrawAuditRecord({
        start: GetTimestampBySeconds(state.datePickerValue[0]),
        end: GetTimestampBySeconds(state.datePickerValue[1]),
        state: state.withdrawStatus,
        account: state.account,
        query_user_id: state.userId,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const singleAudit = (id, status) => {
  ElMessageBox.confirm("确认操作?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let ids = JSON.stringify([id]);
    auditWithdrawFunc(ids, status);
  });
};

const batchAudit = (status) => {
  ElMessageBox.confirm("确认操作?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let ids = JSON.stringify(
      state.selectItems.map((item) => {
        return item.id;
      })
    );
    auditWithdrawFunc(ids, status);
  });
};

const auditWithdrawFunc = (ids, status) => {
  $api.withdrawalManagement.withdrawalAudit
    .AuditWithdraw({
      withdraw_db_id_list: ids,
      withdraw_status: status,
    })
    .then((res) => {
      EleNBox.success("操作成功");
      searchData();
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

const handleSelectionChange = (e) => {
  state.selectItems = e;
};

onMounted(() => {
  state.datePickerValue = GetDatePickerValue(3, "yyyy-MM-DD HH:mm:ss");

  state.withdrawStatusList = server.adminConfig.withdraw_state;
  state.withdrawStatusList.unshift({ value: "", label: "全部" });
  state.withdrawStatus = state.withdrawStatusList[0].value;
  state.widthdrawMethodList = server.adminConfig.withdraw_method;

  searchData();
});
</script>
