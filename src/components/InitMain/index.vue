<template>
  <el-main class="layout-main">
    <el-scrollbar class="layout-main-scrollbar" ref="mainScrollbarRef">
      <router-view v-slot="{ Component }">
        <transition :name="config.layout.mainAnimation" mode="out-in">
          <component :is="Component" :key="route.path" :name="route.name" />
        </transition>
      </router-view>
    </el-scrollbar>
  </el-main>
</template>

<script setup>
import { useConfig } from "@/stores/config";
import { useRoute } from "vue-router";

const config = useConfig();
const route = useRoute();
</script>

<style lang="scss" scoped>
.layout-container .layout-main {
  padding: 0 !important;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.layout-main-scrollbar {
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 16px;
  // background-color: orange;

  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}
</style>
