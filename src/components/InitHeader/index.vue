<template>
  <el-header class="layout-header">
    <div class="nav-bar">
      <NavTabs />
      <NavMenus />
    </div>
  </el-header>
</template>

<script setup>
import NavTabs from "@/components/InitNavTabs/index.vue";
import NavMenus from "@/components/InitNavMenus/index.vue";
</script>

<style lang="scss" scoped>
.layout-header {
  height: auto;
  padding: 0;
}

.nav-bar {
  display: flex;
  height: 50px;
  margin: 20px var(--lowkey-main-space) 0 var(--lowkey-main-space);
}
</style>
