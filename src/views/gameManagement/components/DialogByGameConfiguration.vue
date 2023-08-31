<template>
  <el-dialog class="DialogByOrderInfo" :model-value="computedDialogVisible" width="80%" center :before-close="beforeClose" @open="init">
    <template #header>
      <h2>{{ $props.doType == 1 ? "创建" : "编辑" }}H5小游戏</h2>
    </template>

    <el-form :model="dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="dialogFormRules" scroll-to-error>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialogForm.name" />
      </el-form-item>

      <el-form-item label="简介" prop="introduce">
        <el-input type="textarea" rows="3" v-model="dialogForm.introduce" />
      </el-form-item>

      <el-form-item label="图标" prop="icon">
        <el-upload class="initUpload" :auto-upload="false" :show-file-list="false" :on-change="handleIconChange">
          <img v-if="dialogForm.icon" :src="dialogForm.icon" class="initUpload-img" />
          <Icon v-else name="el-icon-Plus" class="initUpload-icon" size="28" />
        </el-upload>
      </el-form-item>

      <el-form-item label="宣传图" prop="poster">
        <el-upload class="initUpload" :auto-upload="false" :show-file-list="false" :on-change="handlePosterChange">
          <img v-if="dialogForm.poster" :src="dialogForm.poster" class="initUpload-img" />
          <Icon v-else name="el-icon-Plus" class="initUpload-icon" size="28" />
        </el-upload>
      </el-form-item>

      <el-form-item label="链接" prop="url">
        <el-input v-model="dialogForm.url" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="large" type="info" @click="closeDialog()">取消</el-button>
      <el-button size="large" type="warning" @click="changeConfiguration()">{{ $props.doType == 1 ? "创建" : "修改" }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import { EleLoading, EleNBox } from "@/utils/ele";
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
  posterStatus: false,
  iconStatus: false,
  formData: {},
});

const dialogForm = reactive({
  name: "",
  introduce: "",
  icon: "",
  poster: "",
  url: "",
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];

const dialogFormRules = reactive({
  name: requiredBlur,
  icon: requiredChange,
  poster: requiredChange,
  url: requiredBlur,
});

const init = () => {
  if ($props.doType == 2) {
    dialogForm.name = $props.doItem.game_name;
    dialogForm.introduce = $props.doItem.introduce;
    dialogForm.icon = $props.doItem.icon;
    dialogForm.poster = $props.doItem.image;
    dialogForm.url = $props.doItem.url;
  }
};

const dialogFormRef = ref(null);
const changeConfiguration = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      if ($props.doType == 1) {
        createConfigurationFunc();
      } else {
        editOrderFunc();
      }
    }
  });
};

const createConfigurationFunc = () => {
  EleLoading.show();
  let formData = new FormData();
  let poster = state.formData.poster;
  let icon = state.formData.icon;

  formData.append("user_id", adminInfo.getUserId());
  formData.append("game_name", dialogForm.name);
  formData.append("introduce", dialogForm.introduce);
  formData.append("icon", icon.raw);
  formData.append("image", poster.raw);
  formData.append("url", dialogForm.url);

  axios({
    method: "POST",
    url: `${requestUrl[server.server]}/web_backend/create_game_data`,
    data: formData,
    headers: {
      Authorization: `${adminInfo.getToken()}`,
    },
  })
    .then((res) => {
      if (res.data.code == 0) {
        EleNBox.success("添加成功");
        dialogFormRef.value.resetFields();
        state.posterStatus = false;
        state.iconStatus = false;
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

const editOrderFunc = () => {
  EleLoading.show();

  let formData = new FormData();
  let poster = state.formData.poster;
  let icon = state.formData.icon;

  formData.append("user_id", adminInfo.getUserId());
  formData.append("db_id", $props.doItem.db_id);
  formData.append("game_name", dialogForm.name);
  formData.append("introduce", dialogForm.introduce);

  if (state.posterStatus) {
    formData.append("image", poster.raw);
  }

  if (state.iconStatus) {
    formData.append("icon", icon.raw);
  }

  formData.append("url", dialogForm.url);

  axios({
    method: "POST",
    url: `${requestUrl[server.server]}/web_backend/update_game_data`,
    data: formData,
    headers: {
      Authorization: `${adminInfo.getToken()}`,
    },
  })
    .then((res) => {
      if (res.data.code == 0) {
        EleNBox.success("修改成功");
        dialogFormRef.value.resetFields();
        state.posterStatus = false;
        state.iconStatus = false;
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

const beforeClose = (done) => {
  dialogFormRef.value.resetFields();
  state.posterStatus = false;
  state.iconStatus = false;
  $emits("changeVisible", 1, false);
  done();
};

const closeDialog = () => {
  dialogFormRef.value.resetFields();
  state.posterStatus = false;
  state.iconStatus = false;
  $emits("changeVisible", 1, false);
};

const handleIconChange = async (uploadFile) => {
  if (uploadFile.raw.type !== "image/jpeg" && uploadFile.raw.type !== "image/png" && uploadFile.raw.type !== "image/webp") {
    EleNBox.error("图片仅支持JPG/PNG/webp格式");
    return;
  }
  state.formData.icon = uploadFile;
  state.iconStatus = true;
  dialogForm.icon = URL.createObjectURL(uploadFile.raw);
};

const handlePosterChange = async (uploadFile) => {
  if (uploadFile.raw.type !== "image/jpeg" && uploadFile.raw.type !== "image/png" && uploadFile.raw.type !== "image/webp") {
    EleNBox.error("图片仅支持JPG/PNG/webp格式");
    return;
  }

  state.formData.poster = uploadFile;
  state.posterStatus = true;
  dialogForm.poster = URL.createObjectURL(uploadFile.raw);
};

const computedDialogVisible = computed(() => {
  return $props.visible;
});
</script>
