/**
 * 用户管理
 */

import createAxios from "@/axios/index.js";

const userManagement = {
  // 用户信息查询
  search: {
    GetUserInfo(params) {
      return createAxios({
        url: `/web_backend/query_user_info`,
        data: params,
      });
    },
    ModifyUserAssets(params) {
      return createAxios({
        url: `/web_backend/modify_user_info`,
        data: params,
      });
    },
    ModifyUserState(params) {
      return createAxios({
        url: `/web_backend/modify_user_state`,
        data: params,
      });
    },
  },

  // 用户数据（天）
  userDataDaily: {
    GetUserData(params) {
      return createAxios({
        url: `/web_backend/query_user_data`,
        data: params,
      });
    },
  },

  // 用户金币流水
  userGoldCoinTurnover: {
    GetUserFlow(params) {
      return createAxios({
        url: `/web_backend/query_user_flow`,
        data: params,
      });
    },
  },
};

export default userManagement;
