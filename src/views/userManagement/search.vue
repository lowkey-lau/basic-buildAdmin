<!-- 用户信息 - 用户信息查询 -->
<template>
  <div class="bgFix">
    <div class="initPanel">
      <el-space wrap :size="20">
        <InitInput v-model="state.userId" title="用户ID" :placeholder="state.demoUserId" />
      </el-space>

      <el-divider />

      <el-space wrap :size="15">
        <el-button type="primary" @click="searchData()" :loading="state.loading">查询</el-button>
        <el-button type="warning" @click="changeVisible(1, true)" v-if="state.userInfo">增减资源</el-button>
      </el-space>

      <template v-if="state.userInfo">
        <el-divider />

        <el-descriptions title="基础信息" border direction="vertical" :column="2">
          <el-descriptions-item label="昵称：">{{ state.userInfo?.nickname }}</el-descriptions-item>
          <el-descriptions-item label="渠道号：">{{ state.userInfo?.channel_key }}</el-descriptions-item>
          <el-descriptions-item label="金币余额：">{{ state.userInfo?.gold }}</el-descriptions-item>
          <el-descriptions-item label="用户等级：">{{ `${state.userInfo?.level} (exp ${state.userInfo?.ex}/${state.userInfo?.max_ex})` }}</el-descriptions-item>
          <el-descriptions-item label="注册IP/最近登录IP：" span="2">{{ `${state.userInfo?.register_ip} / ${state.userInfo?.login_ip}` }}</el-descriptions-item>
          <el-descriptions-item label="注册时间/最近登录时间：" span="2">{{
            `${state.userInfo?.register_time} / ${state.userInfo?.last_login_time}`
          }}</el-descriptions-item>
          <el-descriptions-item label="账号状态：" span="2">
            <el-radio-group v-model="state.accountStatus" @change="radioChange">
              <el-radio :label="item.value" v-for="(item, index) in state.accountStatusList" :key="index">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <el-space fill :size="15">
          <el-descriptions title="生涯数据" direction="vertical" :column="8" border>
            <el-descriptions-item label="接单数">{{ state.userInfo?.take_offer_count }}</el-descriptions-item>
            <el-descriptions-item label="有效商单">{{ state.userInfo?.valid_offer_count }}</el-descriptions-item>
            <el-descriptions-item label="总提现">{{ state.userInfo?.total_withdraw }}</el-descriptions-item>
            <el-descriptions-item label="总收益">{{ state.userInfo?.total_income }}</el-descriptions-item>
            <el-descriptions-item label="商单收益">{{ state.userInfo?.offer_income }}</el-descriptions-item>
            <el-descriptions-item label="邀请收益">{{ state.userInfo?.invite_income }}</el-descriptions-item>
            <el-descriptions-item label="返佣收益">{{ state.userInfo?.commission_income }}</el-descriptions-item>
          </el-descriptions>
        </el-space>
      </template>

      <DialogByModifyResources :visible="state.visibleByModifyResources" :userInfo="state.userInfo" @changeVisible="changeVisible" @searchData="searchData" />
    </div>
  </div>
</template>

<script setup>
import DialogByModifyResources from "./components/DialogByModifyResources.vue";

import { reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { GetFormatDateBySeconds } from "@/utils/timeTools";
import { EleNBox } from "@/utils/ele";
import $api from "@/axios/api.js";

const state = reactive({
  pageTitle: "用户信息 - 用户信息查询",
  loading: false,

  userId: "", //用户ID
  demoUserId: "600000002",
  userInfo: null,

  accountStatusList: [
    { label: "正常", value: 0 },
    { label: "封禁", value: 1 },
  ],
  accountStatus: 0, //账户状态
  accountOldStatus: 0, //账户旧状态

  visibleByModifyResources: false,
  subordinateDetailsDalogVisible: false,
});

const searchData = async () => {
  state.loading = true;

  try {
    let requestResult = await getUserInfo();
    state.userInfo = requestResult;
    state.accountStatus = requestResult.state;

    state.userInfo.register_time = GetFormatDateBySeconds(state.userInfo.register_time);
    state.userInfo.last_login_time = GetFormatDateBySeconds(state.userInfo.last_login_time);
  } catch (error) {}

  state.loading = false;
};

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    $api.userManagement.search
      .GetUserInfo({
        query_user_id: state.userId || state.demoUserId,
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const radioChange = (e, i) => {
  let optionMsg = "";
  switch (e) {
    case 0:
      optionMsg = "确定解冻/解封该账号吗？";
      break;
    case 1:
      optionMsg = "确定封禁该账号吗？";
      break;
  }

  ElMessageBox.confirm(`${optionMsg}`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      EleNBox.success("操作成功");
    })
    .catch(() => {
      state.accountStatus = state.accountOldStatus;
    });
};

const changeVisible = (type, e) => {
  switch (type) {
    case 1:
      state.visibleByModifyResources = e;
      break;

    case 2:
      state.subordinateDetailsDalogVisible = e;
      break;
  }
};
</script>

<style scoped>
.bgFix {
  background-color: var(--lowkey-bg-color-overlay);
}
</style>
