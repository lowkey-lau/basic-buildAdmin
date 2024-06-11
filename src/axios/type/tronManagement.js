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
  },
};

export default tronManagement;
