<template>
  <el-scrollbar ref="menusRef" class="menuPanel-scrollBar">
    <el-menu
      class="menuPanel-panel"
      :default-active="$route.path"
      :collapse="config.layout.menuCollapse"
      :collapse-transition="false"
      :unique-opened="config.layout.menuUniqueOpened"
    >
      <MenuTree :menus="navTabs.state.tabsViewRoutes" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import MenuTree from "./MenuTree.vue";

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useConfig } from "@/stores/config";
import { useNavTabs } from "@/stores/navTabs";

const config = useConfig();
const navTabs = useNavTabs();

const route = useRoute();

const state = reactive({
  defaultActive: "",
});

const menusRef = ref();

const menusScrollbarHeight = computed(() => {
  let menuTopBarHeight = 0;
  if (config.layout.menuShowTopBar) {
    menuTopBarHeight = 60;
  }
  if (config.layout.layoutMode == "Default") {
    return "calc(100vh - " + (32 + menuTopBarHeight) + "px)";
  } else {
    return "calc(100vh - " + menuTopBarHeight + "px)";
  }
});

// 激活当前路由的菜单
const currentRouteActive = (currentRoute) => {
  state.defaultActive = currentRoute.path;
};

// 滚动条滚动到激活菜单所在位置
const menusScroll = () => {
  nextTick(() => {
    let activeMenu = document.querySelector(".el-menu.menuPanel-panel li.is-active");
    if (!activeMenu) return false;
    menusRef.value?.setScrollTop(activeMenu.offsetTop);
  });
};

onMounted(() => {
  currentRouteActive(route);
  menusScroll();
});

onBeforeRouteUpdate((to) => {
  currentRouteActive(to);
});
</script>

<style lang="scss" scoped>
.menuPanel-scrollBar {
  height: v-bind(menusScrollbarHeight);
  background-color: v-bind('config.getColorVal("menuBackground")');
}

.menuPanel-panel {
  border: 0;
  --el-menu-bg-color: v-bind('config.getColorVal("menuBackground")');
  --el-menu-text-color: v-bind('config.getColorVal("menuColor")');
  --el-menu-active-color: v-bind('config.getColorVal("menuActiveColor")');
}
</style>
