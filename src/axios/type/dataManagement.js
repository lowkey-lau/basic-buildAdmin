/**
 * 综合数据
 */

import createAxios from "@/axios/index.js";
import Mock from "mockjs";
import { dataManagementData } from "@/mock/data.js";

const dataManagement = {
  // 获取综合数据
  GetComprehensiveData(params) {
    return createAxios({
      url: `/web_backend/comprehensive_data`,
      data: params,
    });
  },
};

export default dataManagement;

Mock.mock("/web_backend/comprehensive_data", {
  code: 0,
  data: {
    count: 1,
    page: 1,
    data: dataManagementData.GetComprehensiveData,
  },
});
