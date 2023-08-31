/**
 * 用户管理
 */

import createAxios from "@/axios/index.js";
import Mock from "mockjs";
import { userManagementData } from "@/mock/data.js";

const userManagement = {
  // 用户信息查询
  search: {
    GetUserInfo(params) {
      return createAxios({
        url: `/web_backend/query_user_info`,
        data: params,
      });
    },
  },
};

export default userManagement;

Mock.mock("/web_backend/query_user_info", { code: 0, data: userManagementData.search.GetUserInfo });
