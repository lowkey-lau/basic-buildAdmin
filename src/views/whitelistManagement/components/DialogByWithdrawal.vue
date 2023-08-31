<template>
  <el-dialog :model-value="computedVisible" align-center destroy-on-close :before-close="beforeClose" @open="init()">
    <template #header>
      <h2>{{ $props.doType == 1 ? "新增" : "编辑" }}名单</h2>
    </template>

    <el-form ref="dialogFormRef" :model="dialogForm" status-icon label-position="top" :rules="formRules">
      <el-form-item label="用户UID" prop="white_user_id">
        <el-input v-model="dialogForm.white_user_id" />
      </el-form-item>

      <el-row>
        <el-col :span="8" v-for="item in $props.withdrawMap" :key="item">
          <el-form-item :label="item.label" :prop="`${item.value}`">
            <el-switch v-model="dialogForm[`${item.value}`]" :active-value="1" :inactive-value="-1" />
          </el-form-item>
        </el-col>
      </el-row>
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
  withdrawMap: Array,
});
const $emits = defineEmits(["changeVisible", "searchData"]);

const dialogForm = reactive({
  white_user_id: "",
  white_type_1: 1,
  white_type_2: 1,
  white_type_3: 1,
  white_type_4: 1,
  white_type_5: 1,
  white_type_6: 1,
  white_type_7: 1,
  white_type_8: 1,
  white_type_9: 1,
});

const init = () => {
  if ($props.doType == 2) {
    dialogForm.white_user_id = $props.doItem.white_user_id;
    dialogForm.white_type_1 = $props.doItem.white_type_1;
    dialogForm.white_type_2 = $props.doItem.white_type_2;
    dialogForm.white_type_3 = $props.doItem.white_type_3;
    dialogForm.white_type_4 = $props.doItem.white_type_4;
    dialogForm.white_type_5 = $props.doItem.white_type_5;
    dialogForm.white_type_6 = $props.doItem.white_type_6;
    dialogForm.white_type_7 = $props.doItem.white_type_7;
    dialogForm.white_type_8 = $props.doItem.white_type_8;
    dialogForm.white_type_9 = $props.doItem.white_type_9;
  }
};

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];

const formRules = reactive({
  white_user_id: requiredBlur,
});

const dialogFormRef = ref(null);
const checkValidate = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      createUpdateWhitelist();
    }
  });
};

const createUpdateWhitelist = () => {
  EleLoading.show();

  $api.whitelistManagement.withdrawal
    .CreateUpdateWhitelist({
      white_user_id: dialogForm.white_user_id,
      white_type_1: dialogForm.white_type_1,
      white_type_2: dialogForm.white_type_2,
      white_type_3: dialogForm.white_type_3,
      white_type_4: dialogForm.white_type_4,
      white_type_5: dialogForm.white_type_5,
      white_type_6: dialogForm.white_type_6,
      white_type_7: dialogForm.white_type_7,
      white_type_8: dialogForm.white_type_8,
      white_type_9: dialogForm.white_type_9,
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
