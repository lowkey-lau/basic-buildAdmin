<template>
  <el-dialog :model-value="computedDialogVisible" :close-on-press-escape="false" center :before-close="beforeClose">
    <template #header>
      <h2>添加用户</h2>
    </template>
    <el-form :model="state.dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="formRules">
      <el-form-item label="头像" prop="avatar">
        <el-upload action="#" list-type="picture-card" :show-file-list="false" :auto-upload="false" :on-change="handleAvatarChange">
          <img v-if="state.dialogForm.avatar" :src="state.dialogForm.avatar" class="avatar" style="max-width: 100%" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="账号" prop="account">
        <el-input v-model="state.dialogForm.account" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="state.dialogForm.password" clearable show-password />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="state.dialogForm.nickname" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="state.dialogForm.email" />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="state.dialogForm.sex">
          <el-radio :value="0">男</el-radio>
          <el-radio :value="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="info" @click="closeDialog()">取 消</el-button>
      <el-button type="primary" @click="validForm()">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useServer } from "@/stores/server";
import { ElMessageBox } from "element-plus";
import { EleNBox } from "@/utils/ele";
import { Delete, Edit, Plus, ZoomIn } from "@element-plus/icons-vue";
import $api from "@/axios/api";
import axios from "axios";

const server = useServer();

const $props = defineProps({
  visible: Boolean,
});
const $emits = defineEmits(["changeVisible"]);

const state = reactive({
  dialogForm: {
    avatar: "",
    account: "lowkey2",
    password: "123456",
    nickname: "lowkey2",
    email: "lowkey2",
    sex: 0,
  },
  formData: {
    avatar: null,
  },
});

const formRules = reactive({
  avatar: [{ required: true, message: "请选择头像", trigger: "change" }],
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
});

const dialogFormRef = ref(null);
const validForm = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      modifyResources();
    }
  });
};

const modifyResources = () => {
  ElMessageBox.confirm(`确定此操作吗`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let formData = new FormData();

    formData.append("image_url", state.formData.avatar);
    formData.append("account", state.dialogForm.account);
    formData.append("password", state.dialogForm.password);
    formData.append("nickname", state.dialogForm.nickname);
    formData.append("email", state.dialogForm.email);
    formData.append("sex", state.dialogForm.sex);

    axios
      .post("http://127.0.0.1:3007/api/account/register", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {
        if (res.data.status === 0) {
          EleNBox.success("操作成功");
          dialogFormRef.value.resetFields();
          $emits("changeVisible", 1, false);
        } else {
          EleNBox.error(res.data.msg);
        }
      })
      .catch((error) => {
        EleNBox.error(error.data.msg);
      });
  });
};

const beforeClose = (done) => {
  dialogFormRef.value.resetFields();
  $emits("changeVisible", 1, false);
  done();
};

const closeDialog = () => {
  dialogFormRef.value.resetFields();
  $emits("changeVisible", 1, false);
};

const computedDialogVisible = computed(() => {
  return $props.visible;
});

const handleAvatarChange = (response, uploadFile) => {
  state.formData.avatar = response.raw;
  state.dialogForm.avatar = URL.createObjectURL(response.raw);
};
</script>
