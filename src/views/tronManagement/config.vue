<!-- Tron功能管理 - 测试用例 -->
<template>
  <div class="initPanel">
    <el-collapse v-model="activeName">
      <el-collapse-item :name="index" v-for="(item, index) in list" :key="index">
        <template #title>
          <el-tag type="warning" size="large">{{ item.title }}</el-tag>
        </template>

        <div class="space-y-2 pt-2">
          <div class="space-y-2">
            <div v-if="item.form">
              <el-input type="textarea" v-model="item.form.mnemonic" placeholder="助记词" v-if="index == 1" />
              <el-input type="textarea" v-model="item.form.privateKey" placeholder="私钥地址" v-if="index == 2" />
            </div>
            <el-button type="primary" :loading="item.loading" size="small" @click="handleFunc(index)">调用接口</el-button>
          </div>

          <el-card v-if="item.res">
            <template #header><span class="font-bold">Result</span></template>
            <pre class="overflow-auto">{{ item.res }}</pre>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import $api from "@/axios/api.js";
import { ElMessage } from "element-plus";

const activeName = ref(null);
const list = reactive([
  {
    title: "生成钱包（包含助记词/私钥）",
    loading: false,
    res: null,
  },
  {
    title: "导入助记词生成钱包地址",
    loading: false,
    res: null,
    form: {
      mnemonic: "",
    },
  },
  {
    title: "导入私钥生成钱包地址",
    loading: false,
    res: null,
    form: {
      privateKey: "",
    },
  },
]);

const form = reactive({
  privateKey: "",
});

const handleFunc = (key = 0) => {
  console.log(key);
  switch (key) {
    case 0:
      handleCreateAccount(key);
      break;
    case 1:
      handleImportMnemonic(key);
      break;
    case 2:
      handleImportPrivateKey(key);
      break;
  }
};

const handleCreateAccount = (e) => {
  list[e].loading = true;
  $api.tronManagement.config
    .CreateAccount()
    .then((res) => {
      list[e].loading = false;
      list[e].res = res;
    })
    .catch((error) => {
      console.log(error);
      list[e].loading = false;
    });
};

const handleImportMnemonic = (e) => {
  if (list[e].form.mnemonic == "") {
    return ElMessage.warning("请输入助记词");
  }

  list[e].loading = true;
  $api.tronManagement.config
    .ImportMnemonic({
      mnemonic: list[e].form.mnemonic,
    })
    .then((res) => {
      list[e].loading = false;
      list[e].res = res;
    })
    .catch((error) => {
      console.log(error);
      list[e].loading = false;
    });
};

const handleImportPrivateKey = (e) => {
  if (list[e].form.privateKey == "") {
    return ElMessage.warning("请输入私钥");
  }

  list[e].loading = true;
  $api.tronManagement.config
    .ImportPrivateKey({
      privateKey: list[e].form.privateKey,
    })
    .then((res) => {
      list[e].loading = false;
      list[e].res = res;
    })
    .catch((error) => {
      console.log(error);
      list[e].loading = false;
    });
};
</script>
