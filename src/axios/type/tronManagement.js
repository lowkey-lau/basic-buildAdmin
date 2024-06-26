/**
 * 提现管理
 */

import createAxios from "@/axios/index.js";

const tronManagement = {
  config: {
    CreateAccount(params) {
      return createAxios({
        url: `/api/tron/createAccount`,
        data: params,
      });
    },
    ImportMnemonic(params) {
      return createAxios({
        url: `/api/tron/importMnemonic`,
        data: params,
      });
    },
    ImportPrivateKey(params) {
      return createAxios({
        url: `/api/tron/importPrivateKey`,
        data: params,
      });
    },
    GetBalance(params) {
      return createAxios({
        url: `/api/tron/getBalance`,
        data: params,
      });
    },
    GetContractBalance(params) {
      return createAxios({
        url: `/api/tron/getContractBalance`,
        data: params,
      });
    },
    GetTransactionInfoById(params) {
      return createAxios({
        url: `/api/tron/getTransactionInfoById`,
        data: params,
      });
    },
    GetTransactionInfoByBlockNum(params) {
      return createAxios({
        url: `/api/tron/getTransactionInfoByBlockNum`,
        data: params,
      });
    },
    GetLatestBlock(params) {
      return createAxios({
        url: `/api/tron/getLatestBlock`,
        data: params,
      });
    },
    SendTransaction(params) {
      return createAxios({
        url: `/api/tron/sendTransaction`,
        data: params,
      });
    },
    SendContractTransaction(params) {
      return createAxios({
        url: `/api/tron/sendContractTransaction`,
        data: params,
      });
    },
    GetTransactionList(params) {
      return createAxios({
        url: `/api/tron/getTransactionList`,
        data: params,
      });
    },
    GetApiTradeLog(params) {
      return createAxios({
        url: `/api/tron/getApiTradeLog`,
        data: params,
      });
    },
  },
};

export default tronManagement;
