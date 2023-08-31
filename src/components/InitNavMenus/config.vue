<template>
  <div class="layout-config-drawer">
    <el-drawer :model-value="configStore.layout.showDrawer" title="布局配置" size="310px" @close="onCloseDrawer">
      <el-scrollbar class="layout-mode-style-scrollbar">
        <el-form ref="formRef" :model="configStore.layout">
          <div class="layout-mode-styles-box">
            <el-divider border-style="dashed">全局</el-divider>
            <div class="layout-config-global">
              <el-form-item size="large" label="暗黑模式">
                <DarkSwitch @click="toggleDark()" />
              </el-form-item>
              <el-form-item label="页面切换动画">
                <el-select @change="onCommitState($event, 'mainAnimation')" :model-value="configStore.layout.mainAnimation">
                  <el-option label="slide-right" value="slide-right"></el-option>
                  <el-option label="slide-left" value="slide-left"></el-option>
                  <el-option label="el-fade-in-linear" value="el-fade-in-linear"></el-option>
                  <el-option label="el-fade-in" value="el-fade-in"></el-option>
                  <el-option label="el-zoom-in-center" value="el-zoom-in-center"></el-option>
                  <el-option label="el-zoom-in-top" value="el-zoom-in-top"></el-option>
                  <el-option label="el-zoom-in-bottom" value="el-zoom-in-bottom"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="背景图">
                <el-upload
                  ref="uploadPackageRef"
                  v-model:file-list="state.filesList"
                  multiple
                  :auto-upload="false"
                  :limit="1"
                  :on-change="handlePackageChange"
                  :on-exceed="handlePackageExceed"
                >
                  <el-button type="primary">Click to upload</el-button>
                </el-upload>
              </el-form-item> -->
            </div>

            <el-divider border-style="dashed">侧边栏</el-divider>
            <div class="layout-config-aside">
              <el-form-item label="侧边菜单栏背景色">
                <el-color-picker @change="onCommitColorState($event, 'menuBackground')" :model-value="configStore.getColorVal('menuBackground')" />
              </el-form-item>
              <el-form-item label="侧边菜单文字颜色">
                <el-color-picker @change="onCommitColorState($event, 'menuColor')" :model-value="configStore.getColorVal('menuColor')" />
              </el-form-item>
              <el-form-item label="侧边菜单激活项背景色">
                <el-color-picker @change="onCommitColorState($event, 'menuActiveBackground')" :model-value="configStore.getColorVal('menuActiveBackground')" />
              </el-form-item>
              <el-form-item label="侧边菜单激活项文字色">
                <el-color-picker @change="onCommitColorState($event, 'menuActiveColor')" :model-value="configStore.getColorVal('menuActiveColor')" />
              </el-form-item>
              <el-form-item label="显示侧边菜单顶栏(LOGO栏)">
                <el-switch @change="onCommitState($event, 'menuShowTopBar')" :model-value="configStore.layout.menuShowTopBar"></el-switch>
              </el-form-item>
              <el-form-item label="侧边菜单顶栏背景色">
                <el-color-picker @change="onCommitColorState($event, 'menuTopBarBackground')" :model-value="configStore.getColorVal('menuTopBarBackground')" />
              </el-form-item>
              <el-form-item label="侧边菜单宽度(展开时)">
                <el-input @input="onCommitState($event, 'menuWidth')" type="number" :step="10" :model-value="configStore.layout.menuWidth">
                  <template #append>px</template>
                </el-input>
              </el-form-item>
              <el-form-item label="侧边菜单水平折叠">
                <el-switch @change="onCommitState($event, 'menuCollapse')" :model-value="configStore.layout.menuCollapse"></el-switch>
              </el-form-item>
              <el-form-item label="侧边菜单手风琴">
                <el-switch @change="onCommitState($event, 'menuUniqueOpened')" :model-value="configStore.layout.menuUniqueOpened"></el-switch>
              </el-form-item>
            </div>

            <el-divider border-style="dashed">顶栏</el-divider>
            <div class="layout-config-aside">
              <el-form-item label="顶栏背景色">
                <el-color-picker @change="onCommitColorState($event, 'headerBarBackground')" :model-value="configStore.getColorVal('headerBarBackground')" />
              </el-form-item>
              <el-form-item label="顶栏文字色">
                <el-color-picker @change="onCommitColorState($event, 'headerBarTabColor')" :model-value="configStore.getColorVal('headerBarTabColor')" />
              </el-form-item>
              <el-form-item label="顶栏悬停时背景色">
                <el-color-picker
                  @change="onCommitColorState($event, 'headerBarHoverBackground')"
                  :model-value="configStore.getColorVal('headerBarHoverBackground')"
                />
              </el-form-item>
              <el-form-item label="顶栏菜单激活项背景色">
                <el-color-picker
                  @change="onCommitColorState($event, 'headerBarTabActiveBackground')"
                  :model-value="configStore.getColorVal('headerBarTabActiveBackground')"
                />
              </el-form-item>
              <el-form-item label="顶栏菜单激活项文字色">
                <el-color-picker
                  @change="onCommitColorState($event, 'headerBarTabActiveColor')"
                  :model-value="configStore.getColorVal('headerBarTabActiveColor')"
                />
              </el-form-item>
            </div>
            <el-popconfirm @confirm="restoreDefault" title="确定要恢复全部配置到默认值吗？">
              <template #reference>
                <div class="ba-center">
                  <el-button class="w80" type="info">恢复默认</el-button>
                </div>
              </template>
            </el-popconfirm>
          </div>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup>
import DarkSwitch from "./darkSwitch.vue";

import { reactive, ref } from "vue";
import { useConfig } from "@/stores/config";
import { useRouter } from "vue-router";
import { STORE_CONFIG, BEFORE_RESIZE_LAYOUT } from "@/stores/constant/cacheKey";
import { Local, Session } from "@/utils/storage";
import { genFileId } from "element-plus";
import toggleDark from "@/utils/useDark";

const configStore = useConfig();
const router = useRouter();

const state = reactive({
  filesList: [],
});

const onCommitState = (value, name) => {
  configStore.setLayout(name, value);
};

const onCommitColorState = (value, name) => {
  if (value === null) return;
  const colors = configStore.layout[name];
  if (configStore.layout.isDark) {
    colors[1] = value;
  } else {
    colors[0] = value;
  }
  configStore.setLayout(name, colors);
};

const onCloseDrawer = () => {
  configStore.setLayout("showDrawer", false);
};

const restoreDefault = () => {
  Local.remove(STORE_CONFIG);
  Session.remove(BEFORE_RESIZE_LAYOUT);
  router.go(0);
};

const uploadPackageRef = ref();
const handlePackageExceed = (e) => {
  uploadPackageRef.value.clearFiles();
  const file = e[0];
  file.uid = genFileId();
  uploadPackageRef.value.handleStart(file);
};

const handlePackageChange = (uploadFile) => {
  // if (uploadFile.raw.type !== "application/vnd.android.package-archive") {
  //   EleNBox.warning("仅支持上传APK包");
  //   state.filesList = state.filesList.slice(1);
  // } else {
  //   state.dialogForm.package = URL.createObjectURL(uploadFile.raw);
  //   state.formData.package = uploadFile;
  //   state.packageStatus = true;
  // }
  console.log(uploadFile);
};
</script>

<style scoped lang="scss">
.layout-config-drawer :deep(.el-input__inner) {
  padding: 0 0 0 6px;
}
.layout-config-drawer :deep(.el-input-group__append) {
  padding: 0 10px;
}
.layout-config-drawer :deep(.el-drawer__header) {
  margin-bottom: 0 !important;
}
.layout-config-drawer :deep(.el-drawer__body) {
  padding: 0;
}
.layout-mode-styles-box {
  padding: 20px;
}
.layout-mode-box-style-row {
  margin-bottom: 15px;
}
.layout-mode-style {
  position: relative;
  height: 100px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-small);
  &:hover,
  &.active {
    border: 1px solid var(--el-color-primary);
  }
  .layout-mode-style-name {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-color-primary-light-5);
    border-radius: 50%;
    height: 50px;
    width: 50px;
    border: 1px solid var(--el-color-primary-light-3);
  }
  .layout-mode-style-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &.default {
    display: flex;
    align-items: center;
    justify-content: center;
    .layout-mode-style-aside {
      width: 18%;
      height: 90%;
      background-color: var(--el-border-color-lighter);
    }
    .layout-mode-style-container-box {
      width: 68%;
      height: 90%;
      margin-left: 4%;
      .layout-mode-style-header {
        width: 100%;
        height: 10%;
        background-color: var(--el-border-color-lighter);
      }
      .layout-mode-style-container {
        width: 100%;
        height: 85%;
        background-color: var(--el-border-color-extra-light);
        margin-top: 5%;
      }
    }
  }
  &.classic {
    display: flex;
    align-items: center;
    justify-content: center;
    .layout-mode-style-aside {
      width: 18%;
      height: 100%;
      background-color: var(--el-border-color-lighter);
    }
    .layout-mode-style-container-box {
      width: 82%;
      height: 100%;
      .layout-mode-style-header {
        width: 100%;
        height: 10%;
        background-color: var(--el-border-color);
      }
      .layout-mode-style-container {
        width: 100%;
        height: 90%;
        background-color: var(--el-border-color-extra-light);
      }
    }
  }
  &.streamline {
    display: flex;
    align-items: center;
    justify-content: center;
    .layout-mode-style-container-box {
      width: 100%;
      height: 100%;
      .layout-mode-style-header {
        width: 100%;
        height: 10%;
        background-color: var(--el-border-color);
      }
      .layout-mode-style-container {
        width: 100%;
        height: 90%;
        background-color: var(--el-border-color-extra-light);
      }
    }
  }
  &.double {
    display: flex;
    align-items: center;
    justify-content: center;
    .layout-mode-style-aside {
      width: 18%;
      height: 100%;
      background-color: var(--el-border-color);
    }
    .layout-mode-style-container-box {
      width: 82%;
      height: 100%;
      .layout-mode-style-header {
        width: 100%;
        height: 10%;
        background-color: var(--el-border-color);
      }
      .layout-mode-style-container {
        width: 100%;
        height: 90%;
        background-color: var(--el-border-color-extra-light);
      }
    }
  }
}
.w80 {
  width: 90%;
}
</style>
