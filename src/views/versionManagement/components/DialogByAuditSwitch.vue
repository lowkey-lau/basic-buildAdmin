<template>
  <el-dialog :model-value="computedVisible" align-center :destroy-on-close="true" @close="closeDialog()">
    <template #header>
      <h2>添加渠道大版本号</h2>
    </template>

    <el-form :model="state.dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="formRules">
      <el-form-item label="渠道号" prop="channel">
        <el-input v-model="state.dialogForm.channel" />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="state.dialogForm.version" />
      </el-form-item>
      <el-form-item label="审核状态" prop="state">
        <el-select v-model="state.dialogForm.state">
          <el-option v-for="item in state.stateList" :key="item.value" :label="item.label" :value="item.value" />
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
import { EleLoading, EleNBox } from "@/utils/ele";
import $api from "@/axios/api.js";

const $props = defineProps({
  visible: Boolean,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const state = reactive({
  dialogForm: {
    channel: "",
    version: "",
    state: 0,
  },
  stateList: [
    { label: "未开启", value: 0 },
    { label: "已开启", value: 1 },
  ],
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];

const formRules = reactive({
  channel: requiredBlur,
  version: requiredBlur,
  state: requiredChange,
});

const dialogFormRef = ref(null);
const checkValidate = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      createChanneVersionAudio();
    }
  });
};

const createChanneVersionAudio = () => {
  EleLoading.show();

  $api.versionManagement.auditSwitch
    .CreateChannelVersionAudit({
      channel_str: state.dialogForm.channel,
      version: state.dialogForm.version,
      state: state.dialogForm.state,
    })
    .then((res) => {
      EleNBox.success("添加成功");
      dialogFormRef.value.resetFields();
      $emits("searchData");
      $emits("changeVisible", 1, false);
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const closeDialog = () => {
  $emits("changeVisible", 1, false);
};

const computedVisible = computed(() => {
  return $props.visible;
});
</script>
