<template>
  <el-dialog class="DialogByOrderInfo" :model-value="computedDialogVisible" width="80%" center :before-close="beforeClose" @open="init">
    <template #header>
      <h2>{{ $props.doType == 1 ? "创建" : "编辑" }}商单</h2>
    </template>
    <el-form :model="dialogForm" ref="dialogFormRef" status-icon label-position="top" :rules="dialogFormRules" scroll-to-error>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="offer名称" prop="offer_name">
            <el-input v-model="dialogForm.offer_name" />
          </el-form-item>
          <el-form-item label="包名" prop="package_name">
            <el-input v-model="dialogForm.package_name" />
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="点击上传宣传视频（可选）" prop="videoFile">
                <el-upload
                  ref="uploadVideoRef"
                  v-model:file-list="state.videoFileList"
                  class="upload-video"
                  show-file-list
                  :limit="1"
                  :auto-upload="false"
                  :on-change="handleVideoChange"
                  :on-exceed="handleVideoExceed"
                  :on-remove="handleVideoRemove"
                >
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点击上传宣传图" prop="posterImg">
                <el-upload class="uploader poster-uploader" :auto-upload="false" :show-file-list="false" :on-change="handlePosterChange">
                  <img v-if="dialogForm.posterImg" :src="dialogForm.posterImg" class="uploader-img" />
                  <Icon v-else name="el-icon-Plus" />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="点击上传ICON" prop="iconImg">
                <el-upload class="uploader icon-uploader" :auto-upload="false" :show-file-list="false" :on-change="handleIconChange">
                  <img v-if="dialogForm.iconImg" :src="dialogForm.iconImg" class="uploader-img" />
                  <Icon v-else name="el-icon-Plus" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-form-item label="offer介绍" prop="introduce">
        <el-input type="textarea" rows="4" v-model="dialogForm.introduce" />
      </el-form-item>

      <el-space>
        <el-form-item label="过期时间" prop="expired">
          <el-date-picker v-model="dialogForm.expired" placeholder="请选择时间" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="排序权重" prop="weights">
          <el-input v-model.number="dialogForm.weights" />
        </el-form-item>
        <el-form-item label="指标额度" prop="index_quota">
          <el-input v-model="dialogForm.index_quota" />
        </el-form-item>
        <el-form-item label="预期完单率" prop="pre_finish_rate">
          <el-input v-model.number="dialogForm.pre_finish_rate">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价" prop="cost_price">
          <el-input v-model="dialogForm.cost_price" />
        </el-form-item>
        <el-form-item label="是否新手任务" prop="novice_task_offer">
          <el-switch v-model="dialogForm.novice_task_offer" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-space>

      <el-divider />

      <el-form-item>
        <template #label>
          <el-row justify="space-between">
            <label class="el-form-item__label">任务预览</label>
            <el-space>
              <el-select v-model="state.taskType" size="small" placeholder="请选择任务类型">
                <el-option v-for="(item, index) in state.taskConfig" :label="item.label" :value="item.value" :key="item.value" />
              </el-select>
              <el-button type="primary" size="small" @click="createTaskConfig()">添加任务</el-button>
            </el-space>
          </el-row>
        </template>

        <el-table :data="dialogForm.taskList" :table-layout="'auto'" class="taskTable">
          <el-table-column label="任务类型" prop="task_type_intro" width="120px" />

          <el-table-column width="80px">
            <template #header>
              <el-tooltip content="递增，从1开始" effect="customized" placement="top">
                <el-link underline>
                  <span>ID</span>
                  <Icon name="fa fa-info-circle" size="16px" />
                </el-link>
              </el-tooltip>
            </template>

            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.admin_task_id`" :rules="dialogFormRules.taskList.admin_task_id">
                <el-input v-model.number="row.admin_task_id" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column width="100px">
            <template #header>
              <el-tooltip content="时长任务：单位是（秒）" effect="customized" placement="top">
                <el-link underline>
                  <span>任务参数</span>
                  <Icon name="fa fa-info-circle" size="16px" />
                </el-link>
              </el-tooltip>
            </template>

            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.task_param`" :rules="dialogFormRules.taskList.task_param">
                <el-input v-model.number="row.task_param" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="奖励金币" width="100px">
            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.award`" :rules="dialogFormRules.taskList.award">
                <el-input v-model.number="row.award" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="奖励经验" width="100px">
            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.task_experience`" :rules="dialogFormRules.taskList.task_experience">
                <el-input v-model.number="row.task_experience" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column width="100px">
            <template #header>
              <el-tooltip content="需要父级任务的：填上一个任务的序号；<br />不需要父级任务的：填 0；" effect="customized" placement="top" raw-content>
                <el-link underline>
                  <span>父任务ID</span>
                  <Icon name="fa fa-info-circle" size="16px" />
                </el-link>
              </el-tooltip>
            </template>

            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.parent_id`" :rules="dialogFormRules.taskList.parent_id">
                <el-input v-model.number="row.parent_id" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="任务名" width="140px">
            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.task_name`" :rules="dialogFormRules.taskList.task_name">
                <el-input v-model.number="row.task_name" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column width="140px">
            <template #header>
              <el-tooltip content="单位是（秒）" effect="customized" placement="top" raw-content>
                <el-link underline>
                  <span>任务持续时间</span>
                  <Icon name="fa fa-info-circle" size="16px" />
                </el-link>
              </el-tooltip>
            </template>

            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.task_done_time`" :rules="dialogFormRules.taskList.task_done_time">
                <el-input :disabled="row.task_type != 21001" v-model.number="row.task_done_time" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="限量奖励" width="100px">
            <template #default="{ row }">
              <el-input v-model="row.limit_time_gold" />
            </template>
          </el-table-column>

          <el-table-column label="限量额度" width="100px">
            <template #default="{ row }">
              <el-input v-model="row.limit_time_count" />
            </template>
          </el-table-column>

          <el-table-column label="任务描述">
            <template #default="{ row, $index }">
              <el-form-item :prop="`taskList.${$index}.task_description`" :rules="dialogFormRules.taskList.task_description">
                <el-input type="textarea" v-model.number="row.task_description" rows="4" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="right" width="90px">
            <template #default="scope">
              <el-button size="small" type="danger" @click="handleDeleteTask(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-divider />

      <el-form-item label="渠道选择" prop="offer_source_input">
        <el-input v-model="dialogForm.offer_source_input" class="input-with-select">
          <template #prepend>
            <el-select v-model="dialogForm.offer_source" style="width: 160px">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in state.offerSourceList" :key="index" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="changeOrder()">{{ $props.doType == 1 ? "创建" : "修改" }}</el-button>
      <el-button type="warning" @click="previewOrder()">预览</el-button>
      <el-button @click="closeDialog()">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessageBox, genFileId } from "element-plus";

import { computed, onMounted, reactive, ref } from "vue";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import { EleLoading, EleNBox } from "@/utils/ele";
import { GetFormatZoomDateBySeconds, GetTimestampByZoom } from "@/utils/timeTools";

import requestUrl from "@/axios/url.js";
import axios from "axios";

const server = useServer();
const adminInfo = useAdminInfo();

const $props = defineProps({
  visible: Boolean,
  taskConfig: Array,
  doType: Number,
  doItem: Object,
});
const $emits = defineEmits(["changeVisible", "setPreviewOrderInfo", "searchData"]);

const state = reactive({
  taskType: null,
  videoStatus: false,
  posterStatus: false,
  iconStatus: false,
  videoFileList: [],
  taskConfig: [],
  offerSourceList: [],
  formData: {},

  latestId: 0,
});

const dialogForm = reactive({
  offer_name: "", //offer名称
  package_name: "", //包名
  videoFile: "", //宣传视频
  posterImg: "", //宣传图
  iconImg: "", //ICON
  introduce: "", //offer介绍
  expired: "", //过期时间
  weights: "", //排序权重
  taskList: [], //任务列表
  offer_source: "", //offer来源
  offer_source_input: "", //offer_source 是1 传 download_url；反之last_offer_id
  index_quota: "", //指标额度
  pre_finish_rate: "", //预期完单率
  cost_price: "", //成本价
  novice_task_offer: 1, //是否新手任务
});

const init = () => {
  state.offerSourceList = server.adminConfig.offer_source_type;
  dialogForm.offer_source = state.offerSourceList[0].value;
  state.taskConfig = server.adminConfig.supported_task_type;
  state.taskType = state.taskConfig[0].value;

  if ($props.doType == 2) {
    dialogForm.offer_name = $props.doItem.offer_name;
    dialogForm.package_name = $props.doItem.package_name;
    dialogForm.video = $props.doItem.video;
    dialogForm.posterImg = $props.doItem.posterImg;
    dialogForm.iconImg = $props.doItem.iconImg;
    dialogForm.introduce = $props.doItem.introduce;
    dialogForm.expired = $props.doItem.expired;
    dialogForm.weights = $props.doItem.weights;
    dialogForm.taskList = $props.doItem.taskList;
    dialogForm.offer_source = $props.doItem.offer_source;
    dialogForm.offer_source_input = $props.doItem.offer_source_input;
    dialogForm.index_quota = $props.doItem.index_quota;
    dialogForm.pre_finish_rate = $props.doItem.pre_finish_rate;
    dialogForm.cost_price = $props.doItem.cost_price;
    dialogForm.novice_task_offer = $props.doItem.novice_task_offer;

    if (dialogForm.video) {
      state.videoFileList.push({
        name: "video",
        url: dialogForm.video,
      });
    }
  } else {
    state.videoFileList = [];
  }
};

const requiredBlur = [{ required: true, message: "此项必填", trigger: "blur" }];
const requiredBlurNumber = [
  { required: true, message: "此项必填", trigger: "blur" },
  { type: "number", message: "此项参数必须是整数" },
];
const requiredChange = [{ required: true, message: "此项必选", trigger: "change" }];
const requiredChangeDate = [{ required: true, message: "此项必选", trigger: "change", type: "date" }];

const validateCheckTaskId = (rule, value, callback) => {
  const index = rule.field.split(".")[1];
  if (value != "" && !Number.isInteger(value)) {
    callback(new Error("此项参数必须是整数"));
  } else if (dialogForm.taskList[index].admin_task_id != "" && dialogForm.taskList[index].admin_task_id == value) {
    callback(new Error("父ID不能和当前ID相同"));
  } else {
    callback();
  }
};
const validateCheckNumber = (rule, value, callback) => {
  const reg = /^(\-|\+)?\d+(\.\d+)?$/;
  if (value != "" && !reg.test(value)) {
    callback(new Error("此项必须是数字"));
  } else {
    callback();
  }
};

const dialogFormRules = reactive({
  offer_name: requiredBlur,
  package_name: requiredBlur,
  posterImg: requiredChange,
  iconImg: requiredChange,
  introduce: requiredBlur,
  expired: requiredChangeDate,
  weights: requiredBlurNumber,
  taskList: {
    id: requiredBlurNumber,
    task_param: requiredBlurNumber,
    award: requiredBlurNumber,
    task_experience: requiredBlurNumber,
    parent_id: [{ validator: validateCheckTaskId, trigger: "blur" }],
    task_name: requiredBlur,
    task_done_time: requiredBlur,
    task_description: requiredBlur,
  },
  offer_source: requiredChange,
  offer_source_input: requiredBlur,
  index_quota: requiredBlur,
  pre_finish_rate: requiredBlurNumber,
  cost_price: [{ validator: validateCheckNumber, trigger: "blur" }],
});

const createTaskConfig = () => {
  dialogForm.taskList.push({
    task_db_id: 0,
    admin_task_id: "",
    task_type: state.taskType, //任务ID
    task_id: 0, //已创建时的任务ID，为0时为新建
    task_type_intro: state.taskConfig.find((item) => state.taskType == item.value).label, //任务类型
    task_param: "", //任务参数
    award: "", //奖励金币
    task_experience: "", //奖励经验
    parent_id: "", //父ID
    task_name: "", //任务名称
    task_done_time: state.taskType != 21001 ? 0 : "", //任务持续时长
    task_description: "", //任务描述
    limit_time_gold: "", //限量奖励
    limit_time_count: "", //限量额度
  });
};

const handleDeleteTask = (index, row) => {
  dialogForm.taskList.splice(index, 1);
};

const dialogFormRef = ref(null);
const changeOrder = () => {
  if (dialogForm.taskList.length == 0) {
    return EleNBox.warning("至少选择一种任务");
  }

  dialogFormRef.value.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(`确认${$props.doType == 1 ? "创建" : "修改"}商单吗?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if ($props.doType == 1) {
          createOrderFunc();
        } else {
          editOrderFunc();
        }
      });
    }
  });
};

const createOrderFunc = () => {
  EleLoading.show();

  let tasks = dialogForm.taskList.map((item) => {
    return {
      task_db_id: item.task_db_id,
      admin_task_id: item.admin_task_id,
      task_type: item.task_type,
      task_param: item.task_param,
      award: item.award,
      task_experience: item.task_experience,
      parent_id: item.parent_id,
      task_name: item.task_name,
      task_done_time: item.task_done_time,
      task_description: item.task_description,
      limit_time_gold: item.limit_time_gold,
      limit_time_count: item.limit_time_count,
    };
  });
  tasks = JSON.stringify(tasks);

  let formData = new FormData();
  let video = state.formData.video;
  let poster = state.formData.poster;
  let icon = state.formData.icon;

  formData.append("user_id", adminInfo.getUserId());
  formData.append("offer_name", dialogForm.offer_name);
  formData.append("package_name", dialogForm.package_name);

  if (state.videoStatus) {
    formData.append("video", video.raw);
  }
  formData.append("ad_map", poster.raw);
  formData.append("icon", icon.raw);

  formData.append("introduce", dialogForm.introduce);

  formData.append("expired", GetTimestampByZoom(dialogForm.expired, "America/Sao_Paulo"));

  formData.append("weights", dialogForm.weights);
  formData.append("tasks", tasks);
  formData.append("offer_source", dialogForm.offer_source);
  formData.append("associate_data", dialogForm.offer_source_input);
  formData.append("index_quota", dialogForm.index_quota);
  formData.append("pre_finish_rate", dialogForm.pre_finish_rate);
  formData.append("cost_price", dialogForm.cost_price);
  formData.append("novice_task_offer", dialogForm.novice_task_offer);

  axios({
    method: "POST",
    url: `${requestUrl[server.server]}/web_backend/create_offer`,
    data: formData,
    headers: {
      Authorization: adminInfo.getToken(),
    },
  })
    .then((res) => {
      if (res.data.code == 0) {
        EleNBox.success("添加成功");
        dialogFormRef.value.resetFields();
        dialogForm.taskList = [];
        state.videoFileList = [];
        state.videoStatus = false;
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

  let tasks = dialogForm.taskList.map((item) => {
    return {
      task_db_id: item.task_db_id,
      admin_task_id: item.admin_task_id,
      task_type: item.task_type,
      task_param: item.task_param,
      award: item.award,
      task_experience: item.task_experience,
      parent_id: item.parent_id,
      task_name: item.task_name,
      task_done_time: item.task_done_time,
      task_description: item.task_description,
      limit_time_gold: item.limit_time_gold,
      limit_time_count: item.limit_time_count,
    };
  });
  tasks = JSON.stringify(tasks);

  let formData = new FormData();
  let video = state.formData.video;
  let poster = state.formData.poster;
  let icon = state.formData.icon;

  formData.append("user_id", adminInfo.getUserId());
  formData.append("offer_id", $props.doItem.offer_id);
  formData.append("offer_name", dialogForm.offer_name);
  formData.append("package_name", dialogForm.package_name);

  if (state.videoStatus) {
    if (state.videoFileList.length >= 1) {
      formData.append("video", video.raw);
    } else {
      formData.append("is_delete_video", 1);
    }
  }

  if (state.posterStatus) {
    formData.append("ad_map", poster.raw);
  }

  if (state.iconStatus) {
    formData.append("icon", icon.raw);
  }

  formData.append("introduce", dialogForm.introduce);

  formData.append("expired", GetTimestampByZoom(dialogForm.expired, "America/Sao_Paulo"));

  formData.append("weights", dialogForm.weights);
  formData.append("tasks", tasks);
  formData.append("offer_source", dialogForm.offer_source);
  formData.append("associate_data", dialogForm.offer_source_input);
  formData.append("index_quota", dialogForm.index_quota);
  formData.append("pre_finish_rate", dialogForm.pre_finish_rate);
  formData.append("cost_price", dialogForm.cost_price);
  formData.append("novice_task_offer", dialogForm.novice_task_offer);

  axios({
    method: "POST",
    url: `${requestUrl[server.server]}/web_backend/update_offer`,
    data: formData,
    headers: {
      Authorization: adminInfo.getToken(),
    },
  })
    .then((res) => {
      if (res.data.code == 0) {
        EleNBox.success("修改成功");
        dialogFormRef.value.resetFields();
        dialogForm.taskList = [];
        state.videoFileList = [];
        state.videoStatus = false;
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
  ElMessageBox.confirm("确认将清空列表数据，是否取消?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    dialogFormRef.value.resetFields();
    dialogForm.taskList = [];
    state.videoFileList = [];
    state.videoStatus = false;
    state.posterStatus = false;
    state.iconStatus = false;

    $emits("changeVisible", 1, false);
    done();
  });
};

const closeDialog = () => {
  ElMessageBox.confirm("确认将清空列表数据，是否取消?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    dialogFormRef.value.resetFields();
    dialogForm.taskList = [];
    state.videoFileList = [];
    state.videoStatus = false;
    state.posterStatus = false;
    state.iconStatus = false;
    $emits("changeVisible", 1, false);
  });
};

const previewOrder = () => {
  dialogFormRef.value.validate((valid) => {
    if (valid) {
      $emits("setPreviewOrderInfo", dialogForm);
      $emits("changeVisible", 2, true);
    }
  });
};

const uploadVideoRef = ref();
const handleVideoExceed = (e) => {
  uploadVideoRef.value.clearFiles();
  const file = e[0];
  file.uid = genFileId();
  uploadVideoRef.value.handleStart(file);
};

const handleVideoChange = async (uploadFile) => {
  if (uploadFile.raw.type !== "video/mp4" && uploadFile.raw.type !== "video/webm" && uploadFile.raw.type !== "video/ogg") {
    EleNBox.warning("视频仅支持MP4/WebM/Ogg格式");
    state.videoFileList = state.videoFileList.slice(1);
    return;
  }

  dialogForm.video = URL.createObjectURL(uploadFile.raw);
  state.formData.video = uploadFile;
  state.videoStatus = true;
};

const handleVideoRemove = (uploadFile, uploadFiles) => {
  state.videoStatus = true;
};

const handlePosterChange = async (uploadFile) => {
  if (uploadFile.raw.type !== "image/jpeg" && uploadFile.raw.type !== "image/png" && uploadFile.raw.type !== "image/webp") {
    EleNBox.warning("图片仅支持JPG/PNG/webp格式");
    return;
  }

  state.formData.poster = uploadFile;
  state.posterStatus = true;
  dialogForm.posterImg = URL.createObjectURL(uploadFile.raw);
};

const handleIconChange = async (uploadFile) => {
  if (uploadFile.raw.type !== "image/jpeg" && uploadFile.raw.type !== "image/png" && uploadFile.raw.type !== "image/webp") {
    EleNBox.warning("图片仅支持JPG/PNG/webp格式");
    return;
  }
  state.formData.icon = uploadFile;
  state.iconStatus = true;
  dialogForm.iconImg = URL.createObjectURL(uploadFile.raw);
};

const computedDialogVisible = computed(() => {
  return $props.visible;
});
</script>

<style lang="scss">
.DialogByOrderInfo {
  .poster-uploader,
  .icon-uploader {
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      width: 100%;
      height: 100%;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .el-icon {
    &.poster-uploader-icon,
    &.icon-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      // width: 178px;
      height: 178px;
      text-align: center;
    }
  }

  .uploadLabel {
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
    margin-bottom: 8px;
    line-height: 22px;
  }

  .uploader {
    height: 120px;
    width: 100%;

    &-img {
      font-size: 0;
      height: 100%;
      width: auto;
      display: block;
    }
  }
}

.upload-video {
  width: 100%;
}

.taskTable {
  .el-form-item.is-error {
    padding-bottom: 20px;
  }
}

.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}

.el-link .icon {
  margin-left: 5px;
  vertical-align: middle;
}

.el-link:hover .icon {
  color: var(--el-link-hover-text-color) !important;
}
</style>
