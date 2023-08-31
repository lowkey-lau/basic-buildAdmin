<!-- 提现管理 - 提现配置 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="100" align="center" prop="test" label="提现档位" />
      <el-table-column min-width="180" align="center" prop="test" label="提现方式" />
      <el-table-column min-width="180" align="center" prop="test" label="金额" />
      <el-table-column min-width="120" align="center" prop="test" label="金币数量（原价）" />
      <el-table-column min-width="100" align="center" prop="test" label="金币折扣" />
      <el-table-column min-width="100" align="center" prop="test" label="提现次数" />

      <el-table-column width="200" align="center" label="操作" fixed="right">
        <template #default="{ row, $index }">
          <el-button type="warning" @click="editConfiguration(row)" size="small">编辑</el-button>
          <el-button type="danger" @click="deleteConfiguration($index, row)" size="small">删除</el-button>
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

    <DialogByWithdrawalConfiguration
      :visible="state.visibleByWithdrawalConfiguration"
      :doItem="state.doItem"
      @changeVisible="changeVisible"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByWithdrawalConfiguration from "./components/DialogByWithdrawalConfiguration.vue";

import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import $api from "@/axios/api.js";
import $moment from "moment-timezone";
import $BigNumber from "bignumber.js";

import { EleLoading, EleNBox } from "@/utils/ele";

const state = reactive({
  pageTitle: "提现管理 - 提现配置",
  loading: false,

  requestResult: [{ test: 1 }, { test: 2 }],
  datePickerValue: [],
  regionsList: [], //国家类型
  regionsType: "",
  statusList: [
    {
      label: "全部",
      value: "",
    },
    {
      label: "未过期",
      value: 0,
    },
    {
      label: "已过期",
      value: 1,
    },
  ],
  status: "",
  taskConfig: [],

  // 赋值
  offerName: "", //App名称
  offerId: "", //ID
  doType: 1, //1新增 2修改
  doItem: {},

  visibleByWithdrawalConfiguration: false,

  orderDetailInfo: {},
  previewOrderInfo: {},

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
    state.requestResult = returnResult.offer;
    state.requestResult.forEach((item, index) => {
      item.utcExpired = $moment.unix(item.expired_time_admin).tz("America/Sao_Paulo").format("yyyy-MM-DD HH:mm:ss");
      item.finish_rate = $BigNumber(item.finish_rate).times(100).toFormat(2) + "%";
      item.pre_finish_rate = item.pre_finish_rate + "%";
      item.efficient_rate = $BigNumber(item.efficient_rate).times(100).toFormat(2) + "%";
    });

    state.currentPage = returnResult.page;
    state.pageCount = returnResult.count;
  } catch (error) {}

  state.loading = false;
};

const getRequestData = (flag = false) => {
  return new Promise((resolve, reject) => {
    $api.orderManagement.withdrawalAudit
      .GetOrderList({
        offer_name: state.offerName,
        offer_id: state.offerId,
        page: flag ? 1 : state.currentPage,
        page_size: flag ? state.pageCount : state.pageSize,
        is_expired: state.status,
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

const createBanner = (type, value) => {
  state.doType = 1;

  changeVisible(type, value);
};

const editConfiguration = (e) => {
  state.doItem = e;

  changeVisible(1, true);

  // if (state.doType == 2) {
  //   getOrderDetail(e);
  // }
};

const deleteConfiguration = (index, value) => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteOrderFunc(index, value);
  });
};

const deleteOrderFunc = (index, value) => {
  $api.orderManagement.withdrawalAudit
    .DeleteOrder({
      offer_id: value.offer_id,
    })
    .then((res) => {
      EleNBox.success("删除成功");
      searchData();
    });
};

const changeVisible = (_type, _flag) => {
  switch (_type) {
    case 1:
      state.visibleByWithdrawalConfiguration = _flag;
      break;
  }
};

const setPreviewOrderInfo = (_e) => {
  state.previewOrderInfo = _e;
};

onMounted(() => {
  // searchData();
});
</script>

<style lang="scss" scoped>
//
.expired {
  color: red;
}
</style>
