<template>
  <el-dialog :model-value="computedVisible" align-center destroy-on-close :before-close="beforeClose" @open="init()">
    <template #header>
      <h2>{{ $props.doType == 1 ? "新增" : "编辑" }}奖励配置</h2>
    </template>

    <el-form ref="dialogFormRef" :model="dialogForm" status-icon label-position="top" :rules="formRules">
      <el-form-item label="等级" prop="level" v-if="$props.doType == 1">
        <el-input v-model="dialogForm.level" />
      </el-form-item>
      <el-form-item label="经验值" prop="exp">
        <el-input v-model="dialogForm.exp" />
      </el-form-item>
      <el-form-item label="奖励类型" prop="reward_type">
        <el-select v-model="dialogForm.reward_type">
          <el-option v-for="item in state.rewardTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="奖励值" prop="reward">
        <el-input v-model="dialogForm.reward" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button reward_type="info" @click="closeDialog()">取消</el-button>
      <el-button reward_type="primary" @click="checkValidate()">确定</el-button>
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

const state = reactive({
  rewardTypeList: [],
});

const dialogForm = reactive({
  level: "",
  exp: "",
  reward_type: "",
  reward: "",
});

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];

const formRules = reactive({
  level: requiredBlur,
  exp: requiredBlur,
  reward_type: requiredChange,
  reward: requiredBlur,
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

  $api.operationsManagement.levelRewards
    .UpdateConfiguration({
      channel_str: dialogForm.channel,
      version: dialogForm.version,
      state: dialogForm.state,
    })
    .then((res) => {
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
