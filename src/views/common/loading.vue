<template>
  <div>
    <div
      v-loading="true"
      element-loading-background="var(--lowkey-bg-color-overlay)"
      element-loading-text="页面加载中"
      class="default-main lowey-main-loading"
    ></div>
    <div v-if="state.showReload" class="loading-footer">
      <el-button @click="refresh" type="warning">重新加载</el-button>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, reactive } from "vue";
import router from "@/router/index";
// import { useMemberCenter } from '@/stores/memberCenter'
import { useNavTabs } from "@/stores/navTabs";
// import { isAdminApp } from "@/utils/common";
import { getFirstRoute, routePush } from "@/utils/router";
let timer;

const navTabs = useNavTabs();
// const memberCenter = useMemberCenter()
const state = reactive({
  maximumWait: 1000 * 6,
  showReload: false,
});

const refresh = () => {
  router.go(0);
};

if (navTabs.state.tabsViewRoutes) {
  let firstRoute = getFirstRoute(navTabs.state.tabsViewRoutes);

  if (firstRoute) routePush(firstRoute.path);
}

timer = window.setTimeout(() => {
  state.showReload = true;
}, state.maximumWait);

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<style scoped lang="scss">
.lowey-main-loading {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
.loading-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
