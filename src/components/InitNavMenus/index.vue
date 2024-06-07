<template>
  <div class="nav-menus">
    <div @click="onFullScreen" class="nav-menu-item" :class="state.isFullScreen ? 'hover' : ''">
      <Icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" v-if="!state.isFullScreen" name="local-full-screen-cancel" size="18" />
      <Icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" v-else name="el-icon-FullScreen" size="18" />
    </div>

    <!-- <el-popover
      @show="onCurrentNavMenu(true, 'system')"
      @hide="onCurrentNavMenu(false, 'system')"
      placement="bottom"
      width="auto"
      :hide-after="0"
      trigger="click"
      popper-class="admin-info-box"
    >
      <template #reference>
        <div class="nav-menu-item" :class="state.currentNavMenu == 'system' ? 'hover' : ''">
          <Icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" name="el-icon-SetUp" size="18" />
        </div>
      </template>

      <div>
        <div class="buttonBox">
          <el-button @click="getAdminConfig" type="warning" plain :loading="state.configLoading">获取最新配置</el-button>
        </div>
      </div>
    </el-popover> -->

    <el-popover
      @show="onCurrentNavMenu(true, 'adminInfo')"
      @hide="onCurrentNavMenu(false, 'adminInfo')"
      placement="bottom-end"
      width="auto"
      :hide-after="0"
      trigger="click"
      popper-class="admin-info-box"
    >
      <template #reference>
        <div class="admin-info" :class="state.currentNavMenu == 'adminInfo' ? 'hover' : ''">
          <el-avatar :size="25" fit="fill">
            <img :src="adminInfo.avatar" alt="" />
          </el-avatar>
          <div class="admin-name">{{ adminInfo.nickname }}</div>
        </div>
      </template>
      <div>
        <div class="buttonBox">
          <el-button @click="onLogout" type="danger" plain>退出登录</el-button>
        </div>
      </div>
    </el-popover>
    <div @click="config.setLayout('showDrawer', true)" class="nav-menu-item">
      <Icon :color="config.getColorVal('headerBarTabColor')" class="nav-menu-icon" name="fa fa-cogs" size="18" />
    </div>
    <Config />
  </div>
</template>

<script setup>
import Config from "./config.vue";

import { reactive } from "vue";
import screenfull from "screenfull";
import { useConfig } from "@/stores/config";
import { ElMessage } from "element-plus";
import { useAdminInfo } from "@/stores/adminInfo";
import { Local, Session } from "@/utils/storage";
import { ADMIN_INFO, BA_ACCOUNT } from "@/stores/constant/cacheKey";
// import { routePush } from "@/utils/router";
// import { logout } from "@/api/backend/index";
import { useRouter } from "vue-router";
import { useServer } from "@/stores/server";
import { EleNBox } from "@/utils/ele";

// import { postClearCache } from "@/api/common";

const adminInfo = useAdminInfo();
const config = useConfig();
const router = useRouter();
const server = useServer();

const state = reactive({
  isFullScreen: false,
  currentNavMenu: "",
  showLayoutDrawer: false,
  configLoading: false,
});

const onCurrentNavMenu = (status, name) => {
  state.currentNavMenu = status ? name : "";
};

const onFullScreen = () => {
  if (!screenfull.isEnabled) {
    ElMessage.warning("不支持全屏");
    return false;
  }
  screenfull.toggle();
  screenfull.onchange(() => {
    state.isFullScreen = screenfull.isFullscreen;
  });
};

const getAdminConfig = () => {
  state.configLoading = true;

  server
    .getAdminConfig()
    .then((res) => {
      EleNBox.success("加载配置成功");
    })
    .finally(() => {
      state.configLoading = false;
    });
};

const onLogout = () => {
  Local.remove(ADMIN_INFO);
  router.go(0);
};

const onClearCache = (type) => {
  if (type == "storage" || type == "all") {
    const adminInfo = Local.get(ADMIN_INFO);
    const baAccount = Local.get(BA_ACCOUNT);
    Session.clear();
    Local.clear();
    Local.set(ADMIN_INFO, adminInfo);
    Local.set(BA_ACCOUNT, baAccount);
    if (type == "storage") return;
  }
  postClearCache(type).then(() => {});
};
</script>

<style scoped lang="scss">
.nav-menus.Default {
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
}
.nav-menus {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: auto;
  background-color: v-bind('config.getColorVal("headerBarBackground")');
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);

  .nav-menu-item {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .nav-menu-icon {
      box-sizing: content-box;
      color: v-bind('config.getColorVal("headerBarTabColor")');
    }
    &:hover {
      .icon {
        animation: twinkle 0.3s ease-in-out;
      }
    }
  }
  .admin-info {
    display: flex;
    height: 100%;
    padding: 0 10px;
    align-items: center;
    cursor: pointer;
    user-select: none;
    color: v-bind('config.getColorVal("headerBarTabColor")');
  }
  .admin-name {
    padding-left: 6px;
    white-space: nowrap;
  }
  .nav-menu-item:hover,
  .admin-info:hover,
  .nav-menu-item.hover,
  .admin-info.hover {
    background: v-bind('config.getColorVal("headerBarHoverBackground")');
  }
}
.dropdown-menu-box :deep(.el-dropdown-menu__item) {
  justify-content: center;
}
.admin-info-base {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 10px;
  .admin-info-other {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    .admin-info-name {
      font-size: var(--el-font-size-large);
    }
  }
}
.admin-info-footer {
  display: flex;
  justify-content: space-around;
  min-width: fit-content;
  // width: 100%;
}
.pt2 {
  padding-top: 2px;
}

@keyframes twinkle {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.buttonBox {
  .el-button {
    width: 100%;
  }
}
</style>
