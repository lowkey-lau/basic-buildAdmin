<!-- ETH功能管理 - 测试用例 -->
<template>
  <div class="initPanel overflow-auto">
    <el-collapse v-model="activeName">
      <el-collapse-item :name="index" v-for="(item, index) in list" :key="index">
        <template #title>
          <div class="space-x-2">
            <el-tag type="warning">{{ item.title }}</el-tag>
          </div>
        </template>

        <div class="space-y-2 pt-2">
          <div class="space-y-2">
            <div v-if="item.formList" class="space-y-2">
              <div class="flex items-center space-x-2" v-for="(subItem, subIndex) in item.formList" :key="subIndex">
                <span class="font-bold whitespace-nowrap">{{ subItem.label }}</span>
                <el-input class="w-full" v-model="subItem.value" />
              </div>
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
import { reject } from "lodash-es";

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
    formList: [
      {
        label: "助记词",
        value: "exhaust vapor mixture recycle sad young parent salute chase air curious visit",
        param: "mnemonic",
      },
    ],
  },
  {
    title: "导入私钥生成钱包地址",
    loading: false,
    res: null,
    formList: [
      {
        label: "私钥",
        value: "0xd39825ae8b558e143b0f3e8347520fbf594bb30d4e1bbf3a5c22e1ca58340577",
        param: "privateKey",
      },
    ],
  },
  {
    title: "获取用户主网币余额",
    loading: false,
    res: null,
    formList: [
      {
        label: "用户地址",
        value: "0x13af0a25C8EA8d45A3E20B4f6b987035e01ED302",
        param: "address",
      },
    ],
  },
  {
    title: "获取用户代币余额",
    loading: false,
    res: null,
    formList: [
      {
        label: "代币合约地址",
        value: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        param: "contractAddress",
      },
      {
        label: "用户地址",
        value: "0x13af0a25C8EA8d45A3E20B4f6b987035e01ED302",
        param: "address",
      },
    ],
  },
  {
    title: "根据交易哈希查询交易明细",
    loading: false,
    res: null,
    formList: [
      {
        label: "哈希地址",
        value: "0x5c06763f204d4b33cb9f0311537a44af01e926aaeb9dcc73958ba82cacf16437",
        param: "hxID",
      },
    ],
  },
  {
    title: "根据块高查询交易明细",
    loading: false,
    res: null,
    formList: [
      {
        label: "块高",
        value: "6139215",
        param: "blockNum",
      },
    ],
  },
  {
    title: "获取最新区块信息",
    loading: false,
    res: null,
  },
  {
    title: "主网币转账",
    loading: false,
    res: null,
    formList: [
      {
        label: "私钥",
        value: "0xd39825ae8b558e143b0f3e8347520fbf594bb30d4e1bbf3a5c22e1ca58340577",
        param: "privateKey",
      },
      {
        label: "目标地址",
        value: "0x56eD6Fe8C4A8E7454E727cdA4a531f986332De7E",
        param: "toAddress",
      },
      {
        label: "数量",
        value: "",
        param: "quantity",
      },
    ],
  },
  {
    title: "代币（TRX-20）转账",
    loading: false,
    res: null,
    formList: [
      {
        label: "私钥",
        value: "0xd39825ae8b558e143b0f3e8347520fbf594bb30d4e1bbf3a5c22e1ca58340577",
        param: "privateKey",
      },
      {
        label: "合约地址",
        value: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        param: "contractAddress",
      },
      {
        label: "目标地址",
        value: "0x56eD6Fe8C4A8E7454E727cdA4a531f986332De7E",
        param: "toAddress",
      },
      {
        label: "数量",
        value: "",
        param: "quantity",
      },
    ],
  },
  {
    title: "获取用户所有交易记录（上限1000条）",
    loading: false,
    res: null,
    formList: [
      {
        label: "用户地址",
        value: "0x13af0a25C8EA8d45A3E20B4f6b987035e01ED302",
        param: "address",
      },
    ],
  },
]);

const handleFunc = async (key = 0) => {
  let params = {};

  if (list[key].formList && checkIsEmpty(list[key].formList)) {
    return ElMessage.warning("参数不能为空");
  }

  if (list[key].formList) {
    list[key].formList.forEach((item, index) => {
      params[item.param] = item.value;
    });
  }

  try {
    list[key].loading = true;

    switch (key) {
      case 0:
        list[key].res = await handleCreateAccount(params);
        break;
      case 1:
        list[key].res = await handleImportMnemonic(params);
        break;
      case 2:
        list[key].res = await handleImportPrivateKey(params);
        break;
      case 3:
        list[key].res = await handleGetBalance(params);
        break;
      case 4:
        list[key].res = await handleGetAddressBalance(params);
        break;
      case 5:
        list[key].res = await handleGetTransactionInfoById(params);
        break;
      case 6:
        list[key].res = await handleGetTransactionInfoByBlockNum(params);
        break;
      case 7:
        list[key].res = await handleGetNowBlock(params);
        break;
      case 8:
        list[key].res = await handleSendTransaction(params);
        break;
      case 9:
        list[key].res = await handleSendAddressTransaction(params);
        break;
      case 10:
        list[key].res = await handleGetTransactionList(params);
        break;
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    list[key].loading = false;
  }
};

const checkIsEmpty = (arr) => {
  let bool = false;

  arr.forEach((element) => {
    if (element.value == "") {
      bool = true;
    }
  });

  return bool;
};

const handleCreateAccount = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .CreateAccount(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleImportMnemonic = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .ImportMnemonic(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleImportPrivateKey = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .ImportPrivateKey(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleGetBalance = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .GetBalance(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleGetAddressBalance = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .GetContractBalance(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleGetTransactionInfoById = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .GetTransactionInfoById(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleGetTransactionInfoByBlockNum = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .GetTransactionInfoByBlockNum(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleGetNowBlock = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .GetLatestBlock(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleSendTransaction = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .SendTransaction(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleSendAddressTransaction = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .SendContractTransaction(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

const handleGetTransactionList = (params) => {
  return new Promise((resolve, reject) => {
    $api.ethManagement.config
      .GetTransactionList(params)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};
</script>
