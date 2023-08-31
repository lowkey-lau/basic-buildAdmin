/**
 * 数据概览
 */

import createAxios from "@/axios/index.js";
import Mock from "mockjs";
import { dashboardData } from "@/mock/data.js";

const dashboard = {
  GetUserOnlineData(params) {
    return createAxios({
      url: "/web_backend/query_online_data",
      data: params,
    });
  },
  GetUserActiveData(params) {
    return createAxios({
      url: "/web_backend/query_date_active_data",
      data: params,
    });
  },
  GetCollectedData(params) {
    return createAxios({
      url: "/web_backend/query_overview_data",
      data: params,
    });
  },
};

export default dashboard;

Mock.mock("/web_backend/query_online_data", { code: 0, data: dashboardData.GetUserOnlineData });
Mock.mock("/web_backend/query_date_active_data", { code: 0, data: dashboardData.GetUserActiveData });
Mock.mock("/web_backend/query_overview_data", { code: 0, data: dashboardData.GetCollectedData });
