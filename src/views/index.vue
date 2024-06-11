<template>
  <el-container class="layout-container">
    <Aside />

    <el-container class="content-wrapper">
      <Header />
      <Main />
    </el-container>
  </el-container>
</template>

<script setup>
import Header from "@/components/InitHeader/index.vue";
import Aside from "@/components/InitAside/index.vue";
import Main from "@/components/InitMain/index.vue";

import { onMounted } from "vue";
import { isEmpty } from "lodash-es";
import { handleAdminRoute, getFirstRoute, routePush } from "@/utils/router";
import { menus } from "@/router/dynamic";
import { useNavTabs } from "@/stores/navTabs";
import { useAdminInfo } from "@/stores/adminInfo";
import { useRoute, useRouter } from "vue-router";
import { useServer } from "@/stores/server";
import { EleNBox } from "@/utils/ele";

const navTabs = useNavTabs();
const route = useRoute();
const router = useRouter();
const adminInfo = useAdminInfo();
const server = useServer();

onMounted(async () => {
  if (!adminInfo.token) {
    EleNBox.warning("请先登录");
    return router.push({ name: "adminLogin" });
  }

  // if (!server.adminConfig) {
  //   await server.getAdminConfig();
  // }

  handleAdminRoute(menus);

  if (route.params.to) {
    const lastRoute = JSON.parse(route.params.to);
    if (lastRoute.path != "/") {
      let query = !isEmpty(lastRoute.query) ? lastRoute.query : {};
      routePush({ path: lastRoute.path, query: query });
      return;
    }
  }

  //  跳转到第一个菜单
  let firstRoute = getFirstRoute(navTabs.state.tabsViewRoutes);
  if (firstRoute) routePush(firstRoute.path);
});
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;
  width: 100%;
}
.content-wrapper {
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
