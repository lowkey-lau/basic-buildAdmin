/**
 * 用户管理
 */

import createAxios from "@/axios/index.js";
import Mock from "mockjs";
import { userManagementData } from "@/mock/data.js";

const userManagement = {
  GetList(params) {
    return createAxios({
      url: `/api/user/getUserList`,
      data: params,
    });
  },
  GetUserInfo(params) {
    return createAxios({
      url: `/api/user/getUserInfo`,
      data: params,
    });
  },
  DeleteAccount(params) {
    return createAxios({
      url: "/api/user/deleteAccount",
      data: params,
    });
  },
};

export default userManagement;

// Mock.mock("/web_backend/query_user_info", { code: 0, data: userManagementData.search.GetUserInfo });
