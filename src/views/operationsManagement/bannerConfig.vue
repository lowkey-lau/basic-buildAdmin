<!-- 运营管理 - Banner管理 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitDatePicker v-model="state.datePickerValue" title="时间" type="datetimerange" />
      <InitSelect v-model="state.status" title="关键字" :list="state.statusList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" @click="createBanner(1, true)">添加Banner</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border>
      <el-table-column min-width="120" align="center" prop="test" label="Banner">
        <template #default="{ row }">
          <el-image
            style="width: 120px; height: 60px"
            :src="row.icon"
            :zoom-rate="1.2"
            :preview-src-list="[row.icon]"
            preview-teleported
            :z-index="9"
            close-on-press-escape
          />
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" prop="test" label="标题" />
      <el-table-column min-width="180" align="center" prop="test" label="所属模块" />
      <el-table-column min-width="180" align="center" prop="test" label="链接" />
      <el-table-column min-width="120" align="center" prop="test" label="状态" />
      <el-table-column min-width="100" align="center" prop="test" label="创建时间" />

      <el-table-column width="200" align="center" label="操作" fixed="right">
        <template #default="{ row, $index }">
          <el-button type="warning" @click="editOrder(row)" size="small">编辑</el-button>
          <el-button type="info" @click="editOrder(row)" size="small" v-if="$index % 2 == 0">禁用</el-button>
          <el-button type="info" @click="editOrder(row)" size="small" v-else>禁用</el-button>
          <el-button type="danger" @click="deleteOrderPrompt($index, row)" size="small">删除</el-button>
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

    <DialogByBannerConfig
      :visible="state.visibleByBannerConfig"
      :doType="state.doType"
      :doItem="state.doItem"
      :orderDetailInfo="state.orderDetailInfo"
      @changeVisible="changeVisible"
      @setPreviewOrderInfo="setPreviewOrderInfo"
      @searchData="searchData"
    />
  </div>
</template>

<script setup>
import DialogByBannerConfig from "./components/DialogByBannerConfig.vue";

import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { EleLoading, EleNBox } from "@/utils/ele";
import $api from "@/axios/api.js";
import $moment from "moment-timezone";
import $BigNumber from "bignumber.js";

const state = reactive({
  pageTitle: "运营管理 - Banner管理",
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

  visibleByBannerConfig: false,
  visibleByOrderPreview: false,

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
    $api.orderManagement
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

const editOrder = (e) => {
  state.doType = 2;
  state.doItem = e;

  changeVisible(1, true);

  // if (state.doType == 2) {
  //   getOrderDetail(e);
  // }
};

const getOrderDetail = (e) => {
  EleLoading.show();

  $api.orderManagement
    .GetOrderDetail({
      offer_id: e.offer_id,
    })
    .then((res) => {
      state.orderDetailInfo = res.data;
      state.orderDetailInfo.offer_name = state.orderDetailInfo.name;

      state.orderDetailInfo.expired = $moment.unix(state.orderDetailInfo.expired_time_admin).tz("America/Sao_Paulo").format("yyyy-MM-DD HH:mm:ss");

      state.orderDetailInfo.offer_source_input =
        state.orderDetailInfo.offer_source == 1 ? state.orderDetailInfo.download_url : state.orderDetailInfo.last_offer_id;
      state.orderDetailInfo.posterImg = res.data.image; //宣传图
      state.orderDetailInfo.iconImg = res.data.icon; //ICON

      let taskList = res.data.task_list.map((item) => {
        return {
          task_db_id: item.task_db_id,
          admin_task_id: item.admin_task_id,
          task_type: item.task_type, //任务值
          task_type_intro: state.taskConfig.find((subItem) => subItem.value == item.task_type).label, //任务类型
          task_param: item.task_param, //任务参数
          award: item.gold_reward, //奖励金币
          task_experience: item.ex_reward, //奖励经验
          parent_id: item.pre_task_id, //父ID
          task_name: item.name, //任务名称
          task_done_time: item.task_done_time, //任务持续时间
          task_description: item.task_introduce, //任务描述
        };
      });

      state.orderDetailInfo.taskList = taskList;

      changeVisible(1, true);
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const deleteOrderPrompt = (index, value) => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteOrderFunc(index, value);
  });
};

const deleteOrderFunc = (index, value) => {
  $api.orderManagement
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
      state.visibleByBannerConfig = _flag;
      break;

    case 2:
      state.visibleByOrderPreview = _flag;
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
