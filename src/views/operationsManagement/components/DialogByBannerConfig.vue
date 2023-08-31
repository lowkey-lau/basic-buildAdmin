<template>
  <el-dialog :model-value="computedVisible" align-center destroy-on-close :before-close="beforeClose" @open="init">
    <template #header>
      <h2>{{ $props.doType == 1 ? "添加" : "编辑" }}Banner</h2>
    </template>

    <el-form :model="dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="formRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dialogForm.title" />
      </el-form-item>

      <el-form-item label="是否启用" prop="flag">
        <el-switch v-model="dialogForm.flag" inline-prompt />
      </el-form-item>

      <el-form-item label="Banner" prop="banner">
        <el-upload
          ref="uploadRef"
          list-type="picture-card"
          v-model:file-list="state.filesList"
          class="initUpload"
          :show-file-list="false"
          :limit="1"
          :auto-upload="false"
          :on-change="handleChange"
          :on-exceed="handleExceed"
        >
          <img v-if="dialogForm.banner" :src="dialogForm.banner" class="uploader-img" />
          <Icon v-else name="el-icon-Plus" />
          <!-- <el-button type="primary">点击上传</el-button> -->
        </el-upload>
      </el-form-item>

      <el-form-item label="链接" prop="link">
        <el-input v-model="dialogForm.link" />
      </el-form-item>

      <el-form-item label="所属模块" prop="modules">
        <el-select v-model="dialogForm.modules">
          <el-option v-for="item in state.modulesList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="info" @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="checkValidate()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { genFileId } from "element-plus";
import { EleLoading, EleNBox } from "@/utils/ele";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import { GetTimestampByZoom } from "@/utils/timeTools";

import axios from "axios";
import requestUrl from "@/axios/url.js";

const server = useServer();
const adminInfo = useAdminInfo();

const $props = defineProps({
  visible: Boolean,
  doType: Number,
  doItem: Object,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const state = reactive({
  modulesList: [],
  filesList: [],
  formData: {},

  bannerUploadStatus: false,
});

const dialogFormRef = ref(null);
const dialogForm = reactive({
  title: "",
  flag: true,
  banner: "",
  link: "",
  modules: "",
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];

const formRules = reactive({
  title: requiredBlur,
  banner: requiredChange,
  link: requiredBlur,
  modules: requiredChange,
});

const init = () => {
  // state.channelList = JSON.parse(JSON.stringify($store.state.adminConfig.channel_type));
  // state.channelList.splice(0, 1);
  // dialogForm.channel = state.channelList[0].value;
  // if ($props.doType == 1) {
  //   dialogFormRef.value.resetFields();
  // } else if ($props.doType == 2) {
  //   dialogForm.channel = $props.doItem.channel_val;
  //   dialogForm.version = $props.doItem.version;
  //   dialogForm.release_time = GetFormatZoomDateBySeconds($props.doItem.release_time, "America/Sao_Paulo");
  //   state.tabsActive = `type_${$props.doItem.type}`;
  //   if ($props.doItem.type == 1) {
  //     state.filesList.push({
  //       name: $props.doItem.banner_name,
  //       url: $props.doItem.download_path,
  //     });
  //   } else if ($props.doItem.type == 2) {
  //     dialogForm.download_path = $props.doItem.download_path;
  //   }
  // }
};

const checkValidate = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      if ($props.doType == 1) {
        createVersionConfig();
      } else {
        editVersionConfig();
      }
    }
  });
};

const createVersionConfig = () => {
  EleLoading.show();

  let formData = new FormData();
  formData.append("user_id", adminInfo.getUserId());
  formData.append("channel", dialogForm.channel);
  formData.append("version", dialogForm.version);
  formData.append("release_time", GetTimestampByZoom(dialogForm.release_time, "America/Sao_Paulo"));
  formData.append("type", state.tabsActive == "type_1" ? 1 : 2);

  if (state.tabsActive == "type_1") {
    let bannerFile = state.formData.banner;
    formData.append("banner", bannerFile.raw);
  } else {
    formData.append("download_path", dialogForm.download_path);
  }

  axios({
    method: "POST",
    url: `${requestUrl[server.server]}/web_backend/create_version`,
    data: formData,
    headers: {
      Authorization: `${adminInfo.getToken()}`,
    },
  })
    .then((res) => {
      if (res.data.code == 0) {
        EleNBox.success("操作成功");
        dialogFormRef.value.resetFields();
        state.filesList = [];
        $emits("changeVisible", 1, false);
        $emits("searchData");
      } else {
        EleNBox.error(res.data.msg);
      }
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const editVersionConfig = () => {
  EleLoading.show();

  let formData = new FormData();
  formData.append("user_id", adminInfo.getUserId());
  formData.append("version_id", $props.doItem.id);
  formData.append("channel", dialogForm.channel);
  formData.append("version", dialogForm.version);
  formData.append("release_time", GetTimestampByZoom(dialogForm.release_time, "America/Sao_Paulo"));

  if (state.tabsActive == "type_1") {
    if (state.bannerStatus) {
      let bannerFile = state.formData.banner;
      formData.append("banner", bannerFile.raw);
      formData.append("type", 1);
    } else {
      formData.append("type", 0);
    }
  } else {
    formData.append("download_path", dialogForm.download_path);
    formData.append("type", 2);
  }

  axios({
    method: "POST",
    url: `${requestUrl[server.server]}/web_backend/update_version`,
    data: formData,
    headers: {
      Authorization: `${adminInfo.getToken()}`,
    },
  })
    .then((res) => {
      if (res.data.code == 0) {
        EleNBox.success("操作成功");
        dialogFormRef.value.resetFields();
        state.filesList = [];
        $emits("changeVisible", 1, false);
        $emits("searchData");
      } else {
        EleNBox.error(res.data.msg);
      }
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const uploadRef = ref();
const handleExceed = (e) => {
  uploadRef.value.clearFiles();
  const file = e[0];
  file.uid = genFileId();
  uploadRef.value.handleStart(file);
};

const handleChange = (uploadFile) => {
  dialogForm.banner = URL.createObjectURL(uploadFile.raw);
  state.formData.banner = uploadFile;
  state.bannerStatus = true;
};

const beforeClose = (done) => {
  dialogFormRef.value.resetFields();
  state.filesList = [];
  state.bannerStatus = false;
  $emits("changeVisible", 1, false);
  done();
};

const closeDialog = () => {
  dialogFormRef.value.resetFields();
  state.filesList = [];
  state.bannerStatus = false;
  $emits("changeVisible", 1, false);
};

const computedVisible = computed(() => {
  return $props.visible;
});
</script>
