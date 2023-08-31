<!-- 商单管理 - 商单列表 -->
<template>
  <div class="initPanel">
    <el-space wrap :size="20">
      <InitInput v-model="state.offerName" title="Offer名称" />
      <InitInput v-model="state.offerId" title="Offer ID" />
      <InitSelect v-model="state.status" title="Offer状态" :list="state.statusList" />
    </el-space>

    <el-divider />

    <el-space wrap :size="15">
      <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
      <el-button type="warning" @click="createOrder(1, true)">新增商单</el-button>
    </el-space>

    <el-divider />

    <el-table class="initTable" :data="state.requestResult" v-loading="state.loading" element-loading-text="加载中" border :row-class-name="tableRowClassName">
      <el-table-column min-width="110" align="center" sortable prop="offer_id" label="Offer ID" fixed="left" />
      <el-table-column min-width="280" align="center" sortable prop="utcExpired" label="过期时间" />
      <el-table-column min-width="200" align="center" prop="name" label="Offer 名称" show-overflow-tooltip="" />
      <el-table-column min-width="90" align="center" prop="test" label="图标">
        <template #default="{ row }">
          <el-image style="width: 40px; height: 40px" :src="row.icon" :preview-src-list="[row.icon]" preview-teleported close-on-press-escape />
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" sortable prop="price" label="单价" />
      <el-table-column min-width="150" align="center" prop="cost_price_usd" label="成本价（美元）" />
      <el-table-column min-width="150" align="center" prop="cost_price_brl" label="成本价（巴西）" />
      <el-table-column min-width="100" align="center" prop="profit" label="利润" />
      <el-table-column min-width="100" align="center" prop="limit_reward" label="限量奖励" />
      <el-table-column min-width="120" align="center" label="限量奖励额度">
        <template #default="{ row }">
          <el-popover effect="light" trigger="hover" placement="top" width="auto" :disabled="row.limit_quota.length == 0">
            <template #default>
              <el-descriptions border size="small">
                <el-descriptions-item align="center" :label="item.label" v-for="(item, index) in row.limit_quota" :key="index">
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
            <template #reference>
              <el-tag>{{ row.all_quota }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column min-width="100" align="center" prop="index_quota" label="指标额度" />
      <el-table-column min-width="100" align="center" prop="finish_rate" label="完单率" />
      <el-table-column min-width="100" align="center" prop="pre_finish_rate" label="预期完单率" />
      <el-table-column min-width="100" align="center" prop="efficient_rate" label="任务完成率" />
      <el-table-column min-width="90" align="center" prop="offer_status" label="Offer状态" fixed="right">
        <template #default="{ row }">
          <el-tag :type="row.offer_status ? 'danger' : 'success'">{{ row.offer_status ? "已过期" : "未过期" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="260" align="center" label="操作" fixed="right">
        <template #default="{ row, $index }">
          <el-button size="small" type="primary" @click="previewOrder(row)">查看</el-button>
          <el-button size="small" type="warning" @click="editOrder(row)">编辑</el-button>
          <el-button size="small" type="info" @click="visibleOrder(row, 0)" v-if="row.visible">隐藏</el-button>
          <el-button size="small" type="success" @click="visibleOrder(row, 1)" v-else>显示</el-button>
          <el-button size="small" type="danger" @click="deleteOrderPrompt($index, row)">删除</el-button>

          <!-- <el-tooltip content="查看" placement="top">
              <el-button size="small" @click="editOrder(row)">
                <Icon name="fa fa-search" />
              </el-button>
            </el-tooltip> -->

          <!-- <el-button size="small" plain type="warning" icon="Edit" name="编辑" @click="editOrder(row)" />
            <el-button size="small" plain type="info" icon="Hide" name="隐藏" @click="editOrder(row)" v-if="$index % 2 == 0" />
            <el-button size="small" plain type="success" icon="View" name="显示" @click="editOrder(row)" v-else />
            <el-button size="small" plain type="danger" @click="deleteOrderPrompt($index, row)" icon="Delete" /> -->
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

    <DialogByOrderInfo
      :visible="state.visibleByOrderInfo"
      :doType="state.doType"
      :doItem="state.doItem"
      @changeVisible="changeVisible"
      @setPreviewOrderInfo="setPreviewOrderInfo"
      @searchData="searchData"
    />
    <DialogByOrderPreview :visible="state.visibleByOrderPreview" :previewOrderInfo="state.previewOrderInfo" @changeVisible="changeVisible" />
  </div>
</template>

<script setup>
import DialogByOrderInfo from "./components/DialogByOrderInfo.vue";
import DialogByOrderPreview from "./components/DialogByOrderPreview.vue";

import { onMounted, reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { useServer } from "@/stores/server";
import { GetFormatZoomDateBySeconds } from "@/utils/timeTools";
import { EleLoading, EleNBox } from "@/utils/ele";
import $api from "@/axios/api.js";
import $BigNumber from "bignumber.js";

const server = useServer();

const state = reactive({
  pageTitle: "商单管理 - 商单列表",
  loading: false,

  requestResult: [],
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

  visibleByOrderInfo: false,
  visibleByOrderPreview: false,

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
      item.utcExpired = GetFormatZoomDateBySeconds(item.expired_time_admin, "America/Sao_Paulo");
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
    $api.orderManagement.orderList
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

const createOrder = (type, value) => {
  state.doType = 1;
  changeVisible(type, value);
};

const visibleOrder = (e, type) => {
  ElMessageBox.confirm(`确定${type == 0 ? "隐藏" : "显示"}该商单?`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $api.orderManagement.orderList
      .VisibleOrder({
        offer_id: e.offer_id,
        visible: type,
      })
      .then((res) => {
        EleNBox.success("修改成功");
        searchData();
      });
  });
};

const tableRowClassName = ({ row, rowIndex }) => {
  if (!row.visible) {
    return "info-row";
  }
  return "";
};

const previewOrder = async (e) => {
  EleLoading.show();

  try {
    const requestData = await getOrderDetail(e);
    state.previewOrderInfo = formatRequestData(requestData);
    changeVisible(2, true);
  } catch (error) {}

  EleLoading.hide();
};

const editOrder = async (e) => {
  EleLoading.show();

  try {
    state.doType = 2;
    const requestData = await getOrderDetail(e);
    state.doItem = formatRequestData(requestData);
    changeVisible(1, true);
  } catch (error) {}

  EleLoading.hide();
};

const getOrderDetail = (e) => {
  return new Promise((resolve, reject) => {
    $api.orderManagement.orderList
      .GetOrderDetail({
        offer_id: e.offer_id,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const formatRequestData = (requestData) => {
  return {
    offer_id: requestData.offer_id,
    offer_name: requestData.offer_name,
    package_name: requestData.package_name,
    video: requestData.video,
    posterImg: requestData.image,
    iconImg: requestData.icon,
    introduce: requestData.introduce,
    expired: GetFormatZoomDateBySeconds(requestData.expired_time_admin),
    weights: requestData.weights,
    taskList: requestData.taskList,
    offer_source: requestData.offer_source,
    offer_source_input: requestData.associate_data,
    index_quota: requestData.index_quota,
    pre_finish_rate: requestData.pre_finish_rate,
    cost_price: requestData.cost_price,
    novice_task_offer: requestData.novice_task_offer,
    taskList: requestData.task_list.map((item) => {
      return {
        task_db_id: item.task_db_id,
        admin_task_id: item.admin_task_id,
        task_type: item.task_type,
        task_type_intro: state.taskConfig.find((subItem) => subItem.value == item.task_type).label,
        task_param: item.task_param,
        award: item.gold_reward,
        task_experience: item.ex_reward,
        parent_id: item.pre_task_id,
        task_name: item.name,
        task_done_time: item.task_done_time,
        task_description: item.task_introduce,
        limit_time_gold: item.limit_time_gold,
        limit_time_count: item.limit_time_count,
      };
    }),
  };
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
  $api.orderManagement.orderList
    .DeleteOrder({
      offer_id: value.offer_id,
    })
    .then(() => {
      EleNBox.success("删除成功");
      searchData();
    });
};

const changeVisible = (_type, _flag) => {
  switch (_type) {
    case 1:
      state.visibleByOrderInfo = _flag;
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
  state.taskConfig = server.adminConfig.supported_task_type;

  searchData();
});
</script>
