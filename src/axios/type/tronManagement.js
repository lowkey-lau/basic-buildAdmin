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
    GetAddressBalance(params) {
      return createAxios({
        url: `/api/tron/getAddressBalance`,
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
    GetNowBlock(params) {
      return createAxios({
        url: `/api/tron/getNowBlock`,
        data: params,
      });
    },
    SendTransaction(params) {
      return createAxios({
        url: `/api/tron/sendTransaction`,
        data: params,
      });
    },
    SendAddressTransaction(params) {
      return createAxios({
        url: `/api/tron/sendAddressTransaction`,
        data: params,
      });
    },
  },
};

export default tronManagement;
