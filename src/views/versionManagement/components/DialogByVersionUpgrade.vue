<template>
  <el-dialog :model-value="computedVisible" align-center :destroy-on-close="true" @open="init" :before-close="beforeClose" @close="closeDialog()">
    <template #header>
      <h2>{{ $props.doType == 1 ? "新增" : "编辑" }}版本</h2>
    </template>

    <el-form :model="state.dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="formRules">
      <el-form-item label="渠道" prop="channel">
        <el-select v-model="state.dialogForm.channel">
          <el-option v-for="item in state.channelList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="state.dialogForm.version" />
      </el-form-item>

      <el-form-item label="预发布时间" prop="release_time">
        <el-date-picker v-model="state.dialogForm.release_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择时间" />
      </el-form-item>

      <el-tabs v-model="state.tabsActive" type="border-card" style="width: 100%; margin-bottom: 15px">
        <el-tab-pane label="APK" name="type_1">
          <el-form-item label="apk 资源包" prop="package">
            <el-upload
              ref="uploadPackageRef"
              v-model:file-list="state.filesList"
              class="upload-package"
              show-file-list
              :limit="1"
              :auto-upload="false"
              :on-change="handlePackageChange"
              :on-exceed="handlePackageExceed"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="谷歌商店" name="type_2">
          <el-form-item label="下载地址" prop="download_path">
            <el-input v-model="state.dialogForm.download_path" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <el-button type="info" @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="checkValidate()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { ElMessageBox, genFileId } from "element-plus";
import { EleLoading, EleNBox } from "@/utils/ele";
import { GetFormatZoomDateBySeconds, GetTimestampByZoom } from "@/utils/timeTools";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import axios from "axios";
import requestUrl from "@/axios/url.js";

const server = useServer();
const adminInfo = useAdminInfo();
const token = adminInfo.getToken();

const $props = defineProps({
  visible: Boolean,
  doType: Number,
  doItem: Object,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const state = reactive({
  channelList: [],
  filesList: [],

  dialogForm: {
    channel: "",
    version: "",
    download_path: "",
    release_time: "",
  },
  formData: {},
  packageStatus: false,

  tabsActive: "type_1",
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];
const requiredChangeDate = [{ required: true, message: "此项必选", trigger: "change", type: "date" }];

const formRules = reactive({
  channel: requiredChange,
  version: requiredBlur,
  release_time: requiredChangeDate,
});

const dialogFormRef = ref(null);

const init = () => {
  state.channelList = JSON.parse(JSON.stringify(server.adminConfig.channel_type));
  state.channelList.splice(0, 1);
  state.dialogForm.channel = state.channelList[0].value;

  if ($props.doType == 1) {
    dialogFormRef.value.resetFields();
  } else if ($props.doType == 2) {
    state.dialogForm.channel = $props.doItem.channel_val;
    state.dialogForm.version = $props.doItem.version;
    state.dialogForm.release_time = GetFormatZoomDateBySeconds($props.doItem.release_time, "America/Sao_Paulo");

    state.tabsActive = `type_${$props.doItem.type}`;

    if ($props.doItem.type == 1) {
      state.filesList.push({
        name: $props.doItem.package_name,
        url: $props.doItem.download_path,
      });
    } else if ($props.doItem.type == 2) {
      state.dialogForm.download_path = $props.doItem.download_path;
    }
  }
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
  formData.append("channel", state.dialogForm.channel);
  formData.append("version", state.dialogForm.version);
  formData.append("release_time", GetTimestampByZoom(state.dialogForm.release_time, "America/Sao_Paulo"));
  formData.append("type", state.tabsActive == "type_1" ? 1 : 2);

  if (state.tabsActive == "type_1") {
    let packageFile = state.formData.package;
    formData.append("package", packageFile.raw);
  } else {
    formData.append("download_path", state.dialogForm.download_path);
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
  formData.append("channel", state.dialogForm.channel);
  formData.append("version", state.dialogForm.version);
  formData.append("release_time", GetTimestampByZoom(state.dialogForm.release_time, "America/Sao_Paulo"));

  if (state.tabsActive == "type_1") {
    if (state.packageStatus) {
      let packageFile = state.formData.package;
      formData.append("package", packageFile.raw);
      formData.append("type", 1);
    } else {
      formData.append("type", 0);
    }
  } else {
    formData.append("download_path", state.dialogForm.download_path);
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

const uploadPackageRef = ref();
const handlePackageExceed = (e) => {
  uploadPackageRef.value.clearFiles();
  const file = e[0];
  file.uid = genFileId();
  uploadPackageRef.value.handleStart(file);
};

const handlePackageChange = (uploadFile) => {
  if (uploadFile.raw.type !== "application/vnd.android.package-archive") {
    EleNBox.warning("仅支持上传APK包");
    state.filesList = state.filesList.slice(1);
  } else {
    state.dialogForm.package = URL.createObjectURL(uploadFile.raw);
    state.formData.package = uploadFile;
    state.packageStatus = true;
  }
};

const beforeClose = (done) => {
  dialogFormRef.value.resetFields();
  state.filesList = [];
  done();
};

const closeDialog = () => {
  dialogFormRef.value.resetFields();
  state.filesList = [];
  $emits("changeVisible", 1, false);
};

const computedVisible = computed(() => {
  return $props.visible;
});
</script>

<style lang="scss" scoped>
.upload-package {
  width: 100%;
}
</style>
