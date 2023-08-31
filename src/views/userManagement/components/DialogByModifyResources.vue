<template>
  <el-dialog :model-value="computedDialogVisible" :close-on-press-escape="false" center :before-close="beforeClose" @open="init()">
    <template #header>
      <h2>增减资源</h2>
    </template>
    <el-form :model="dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="formRules">
      <el-form-item label="类别" prop="type">
        <el-select v-model="dialogForm.type" placeholder="请选择类别">
          <el-option v-for="(item, index) in state.typeList" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="参数" prop="parameter">
        <el-input v-model="dialogForm.parameter" />
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
import $api from "@/axios/api";

const server = useServer();

const $props = defineProps({
  visible: Boolean,
  userInfo: Object,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const state = reactive({
  typeList: [
    {
      label: "加钱",
      value: 1,
    },
  ],
});

const dialogForm = reactive({
  type: 1,
  parameter: "",
});

const formRules = reactive({
  type: [{ required: true, message: "请选择类别", trigger: "change" }],
  parameter: [{ required: true, message: "请输入参数", trigger: "blur" }],
});

const init = () => {
  // state.typeList = server.adminConfig.user_modify_action;
  // dialogForm.type = state.typeList[0].value;
};

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
    EleNBox.success("操作成功");
    dialogFormRef.value.resetFields();
    $emits("changeVisible", 1, false);
    $emits("searchData");
    // $api.userManagement.search
    //   .ModifyUserAssets({
    //     query_user_id: $props.userInfo.user_id,
    //     action: dialogForm.type,
    //     param: dialogForm.parameter,
    //   })
    //   .then(() => {

    //   });
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
</script>
