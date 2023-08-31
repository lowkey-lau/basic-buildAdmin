/**
 * 综合数据
 */

import createAxios from "@/axios/index.js";

const dataManagement = {
  // 获取综合数据
  GetComprehensiveData(params) {
    return createAxios({
      url: `/web_backend/comprehensive_data`,
      data: params,
    });
  },
  // 查询新用户综合数据
  GetNewUserComprehensiveData(params) {
    return createAxios({
      url: `/web_backend/new_user_comprehensive_data`,
      data: params,
    });
  },
  // 获取邀请数据查询
  GetInviteData(params) {
    return createAxios({
      url: `/web_backend/query_invite_data`,
      data: params,
    });
  },
  // 获取留存数据
  GetRetainedData(params) {
    return createAxios({
      url: `/web_backend/query_retained_data`,
      data: params,
    });
  },
  // 获取在线数据
  GetOnlineData(params) {
    return createAxios({
      url: `/web_backend/query_online_data`,
      data: params,
    });
  },
};

export default dataManagement;
