<template>
  <el-aside class="initAside">
    <Logo v-if="config.layout.menuShowTopBar" />
    <MenuPanel />
  </el-aside>
</template>

<script setup>
import Logo from "./Logo.vue";
import MenuPanel from "./MenuPanel.vue";

import { reactive, computed } from "vue";
import { useConfig } from "@/stores/config";

const config = useConfig();
const menuWidth = computed(() => config.menuWidth());
</script>

<style scope lang="scss">
.el-aside.initAside {
  margin: 16px 0 16px 16px;
  height: calc(100vh - 32px);
  background: var(--lowkey-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
  transition: width 0.3s ease;
  width: v-bind(menuWidth);
  transition: width 0.3s ease;

  border: 0;
  --el-menu-bg-color: v-bind('config.getColorVal("menuBackground")');
  --el-menu-text-color: v-bind('config.getColorVal("menuColor")');
  --el-menu-active-color: v-bind('config.getColorVal("menuActiveColor")');
}
</style>
