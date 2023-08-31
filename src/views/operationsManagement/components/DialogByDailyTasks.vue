<template>
  <el-dialog :model-value="computedVisible" align-center destroy-on-close :before-close="beforeClose" @open="init()">
    <template #header>
      <h2>任务配置</h2>
    </template>

    <el-form ref="dialogFormRef" :model="dialogForm" status-icon label-position="top" :rules="formRules">
      <el-form-item label="任务参数" prop="time">
        <el-input v-model="dialogForm.time" />
      </el-form-item>
      <el-form-item label="任务奖励数值" prop="status">
        <el-input v-model="dialogForm.time" />
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
  doType: Number,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const state = reactive({});

const dialogForm = reactive({
  time: "",
  status: false,
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];

const formRules = reactive({
  time: requiredBlur,
  status: requiredChange,
});

const dialogFormRef = ref(null);
const checkValidate = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      createChanneVersionAudio();
    }
  });
};

const init = () => {};

const createChanneVersionAudio = () => {
  EleLoading.show();

  $api.operationsManagement
    .CreateChannelVersionAudit({
      channel_str: dialogForm.channel,
      version: dialogForm.version,
      state: dialogForm.state,
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

const beforeClose = (done) => {
  dialogFormRef.value.resetFields();
  $emits("changeVisible", 1, false);
  done();
};

const closeDialog = () => {
  $emits("changeVisible", 1, false);
};

const computedVisible = computed(() => {
  return $props.visible;
});
</script>
