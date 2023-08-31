<template>
  <el-dialog :model-value="computedVisible" align-center destroy-on-close :before-close="beforeClose" @open="init()">
    <template #header>
      <h2>奖励配置</h2>
    </template>

    <el-form ref="dialogFormRef" :model="dialogForm" status-icon label-position="top" :rules="formRules">
      <el-form-item label="签到天数">
        <el-tag type="warning">{{ $props.doItem.day }}</el-tag>
      </el-form-item>
      <el-form-item label="签到档位">
        <el-tag type="success">{{ $props.doItem.gear }}</el-tag>
      </el-form-item>
      <el-form-item label="奖励数值" prop="signin_award">
        <el-input v-model="dialogForm.signin_award" />
      </el-form-item>
      <el-form-item label="观看视频奖励" prop="video_award">
        <el-input v-model="dialogForm.video_award" />
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
  doItem: Object,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const init = () => {
  dialogForm.signin_award = $props.doItem.signin_award;
  dialogForm.video_award = $props.doItem.video_award;
};

const dialogForm = reactive({
  signin_award: "",
  video_award: "",
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];

const formRules = reactive({
  signin_award: requiredBlur,
  video_award: requiredBlur,
});

const dialogFormRef = ref(null);
const checkValidate = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      updateConfiguration();
    }
  });
};

const updateConfiguration = () => {
  EleLoading.show();

  $api.operationsManagement.signInConfiguration
    .UpdateConfiguration({
      signin_award: dialogForm.signin_award,
      video_award: dialogForm.video_award,
      config_id: $props.doItem.config_id,
    })
    .then(() => {
      EleNBox.success("更新成功");
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
