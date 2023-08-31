/**
 * 公用配置接口
 */

import createAxios from "@/axios/index.js";
import Mock from "mockjs";
import { configurationData } from "@/mock/data.js";

const configuration = {
  // 获取基础配置
  GetAdminConfig(params) {
    return createAxios({
      url: "/web_backend/config",
      data: params,
    });
  },
};

export default configuration;

Mock.mock("/web_backend/config", { code: 0, data: configurationData });
