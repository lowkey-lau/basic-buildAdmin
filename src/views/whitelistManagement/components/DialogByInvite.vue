<template>
  <el-dialog :model-value="computedVisible" align-center destroy-on-close :before-close="beforeClose" @open="init()">
    <template #header>
      <h2>{{ $props.doType == 1 ? "新增" : "编辑" }}名单</h2>
    </template>

    <el-form ref="dialogFormRef" :model="dialogForm" status-icon label-position="top" :rules="formRules">
      <el-form-item label="用户UID" prop="create_user_id" v-if="$props.doType == 1">
        <el-input v-model="dialogForm.create_user_id" />
      </el-form-item>
      <el-form-item label="同IP限制" prop="same_ip">
        <el-switch v-model="dialogForm.same_ip" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="同设备限制" prop="same_device">
        <el-switch v-model="dialogForm.same_device" :active-value="1" :inactive-value="0" />
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
  doItem: Object,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const dialogForm = reactive({
  create_user_id: "",
  same_ip: 1,
  same_device: 1,
});

const init = () => {
  if ($props.doType == 2) {
    dialogForm.same_ip = $props.doItem.same_ip ? 1 : 0;
    dialogForm.same_device = $props.doItem.same_device ? 1 : 0;
  }
};

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];

const formRules = reactive({
  create_user_id: requiredBlur,
});

const dialogFormRef = ref(null);
const checkValidate = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      if ($props.doType == 1) {
        createWhitelist();
      } else {
        updateWhitelist();
      }
    }
  });
};

const createWhitelist = () => {
  EleLoading.show();

  $api.whitelistManagement.invite
    .CreateWhitelist({
      create_user_id: dialogForm.create_user_id,
      same_ip: dialogForm.same_ip,
      same_device: dialogForm.same_device,
    })
    .then(() => {
      EleNBox.success("操作成功");
      dialogFormRef.value.resetFields();
      $emits("searchData");
      $emits("changeVisible", 1, false);
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const updateWhitelist = () => {
  EleLoading.show();

  $api.whitelistManagement.invite
    .UpdateWhitelist({
      record_id: $props.doItem.id,
      same_ip: dialogForm.same_ip,
      same_device: dialogForm.same_device,
    })
    .then(() => {
      EleNBox.success("操作成功");
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
