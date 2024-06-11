<template>
  <div class="logoBox">
    <div class="logoBox-icon" v-if="!config.layout.menuCollapse">
      <img src="https://placehold.co/300" alt="logo" />
    </div>

    <div class="logoBox-content" v-if="!config.layout.menuCollapse">
      <div class="logoBox-title">{{ adminInfo.account }}</div>
      <el-tag size="small">{{ server.server }}</el-tag>
    </div>

    <Icon
      class="logoBox-menuCollapse"
      color="config.getColorVal('menuActiveColor')"
      :name="config.layout.menuCollapse ? 'fa fa-indent' : 'fa fa-dedent'"
      size="18"
      @click="toggleMenuCollapse"
    />
  </div>
</template>

<script setup>
import { useConfig } from "@/stores/config";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";

const config = useConfig();
const server = useServer();
const adminInfo = useAdminInfo();

const toggleMenuCollapse = () => {
  if (config.layout.shrink && !config.layout.menuCollapse) {
    closeShade();
  }

  config.setLayout("menuCollapse", !config.layout.menuCollapse);

  //   Session.set(BEFORE_RESIZE_LAYOUT, {
  //     layoutMode: config.layout.layoutMode,
  //     menuCollapse: config.layout.menuCollapse,
  //   });
};
</script>

<style lang="scss" scoped>
@import "./scss/Logo";
</style>
