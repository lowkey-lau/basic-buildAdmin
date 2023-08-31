<template>
  <div class="quickItemBox">
    <div class="quickItemBox-title">快捷操作</div>
    <div class="quickItemBox-container">
      <div class="quickItemBox-item" v-for="(item, index) in state.itemList" :key="index" @click="toPath(item.path)">
        <div class="quickItemBox-icon">
          <Icon :name="item.icon" size="36" />
        </div>
        <div class="quickItemBox-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  itemList: [
    {
      label: "审核提现",
      icon: "el-icon-Stamp",
      path: "/withdrawalManagement/withdrawalAudit",
    },
    {
      label: "新增Offer",
      icon: "el-icon-Ticket",
      path: "/orderManagement/orderList",
    },
    {
      label: "用户反馈",
      icon: "el-icon-ChatDotSquare",
      path: "/operationsManagement/userFeedback",
    },
    {
      label: "用户查询",
      icon: "el-icon-UserFilled",
      path: "/userManagement/search",
    },
  ],
});

const toPath = (path) => {
  router.push(path);
};
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as *;
.quickItemBox {
  background: var(--lowkey-bg-color-overlay);
  margin-bottom: 20px;

  &-container {
    @include flexCenter;
    padding: 20px;
  }

  &-title {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color);
  }

  &-item {
    @include flexCenterColumn;
    @include initTransition(0.3);
    background-color: var(--lowkey-bg-color-item);
    border-radius: var(--el-border-radius-base);
    padding: 24px;
    flex: 1;
    margin-right: 30px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      -webkit-transform: translateY(-4px) scale(1.02);
      -moz-transform: translateY(-4px) scale(1.02);
      -ms-transform: translateY(-4px) scale(1.02);
      -o-transform: translateY(-4px) scale(1.02);
      transform: translateY(-4px) scale(1.02);
      z-index: 999;
      box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
    }
  }

  &-icon {
    margin-bottom: 10px;
  }

  &-label {
    color: #92969a;
    font-size: 16px;
    width: 100%;
    text-align: center;
  }

  &-content {
    @include flexCenter;
    align-items: flex-end;
    color: #2c3f5d;
    width: 100%;
    margin-top: 15px;
  }

  &-num {
    flex: 1;
    font-size: 28px;
    font-weight: bold;
  }

  &-rate {
    font-size: 14px;
  }
}
</style>
