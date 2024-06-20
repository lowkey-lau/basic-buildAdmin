/**
 * 提现管理
 */

import createAxios from "@/axios/index.js";

const ethManagement = {
  config: {
    CreateAccount(params) {
      return createAxios({
        url: `/api/eth/createAccount`,
        data: params,
      });
    },
    ImportMnemonic(params) {
      return createAxios({
        url: `/api/eth/importMnemonic`,
        data: params,
      });
    },
    ImportPrivateKey(params) {
      return createAxios({
        url: `/api/eth/importPrivateKey`,
        data: params,
      });
    },
    GetBalance(params) {
      return createAxios({
        url: `/api/eth/getBalance`,
        data: params,
      });
    },
    GetContractBalance(params) {
      return createAxios({
        url: `/api/eth/getContractBalance`,
        data: params,
      });
    },
    GetTransactionInfoById(params) {
      return createAxios({
        url: `/api/eth/getTransactionInfoById`,
        data: params,
      });
    },
    GetTransactionInfoByBlockNum(params) {
      return createAxios({
        url: `/api/eth/getTransactionInfoByBlockNum`,
        data: params,
      });
    },
    GetLatestBlock(params) {
      return createAxios({
        url: `/api/eth/getLatestBlock`,
        data: params,
      });
    },
    SendTransaction(params) {
      return createAxios({
        url: `/api/eth/sendTransaction`,
        data: params,
      });
    },
    SendContractTransaction(params) {
      return createAxios({
        url: `/api/eth/sendContractTransaction`,
        data: params,
      });
    },
    GetTransactionList(params) {
      return createAxios({
        url: `/api/eth/getTransactionList`,
        data: params,
      });
    },
    GetApiTradeLog(params) {
      return createAxios({
        url: `/api/eth/getApiTradeLog`,
        data: params,
      });
    },
  },
};

export default ethManagement;
