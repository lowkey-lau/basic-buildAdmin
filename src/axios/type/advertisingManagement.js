/**
 * 广告管理
 */

import createAxios from "@/axios/index.js";

const advertisingManagement = {
  // 冷热广告启动配置
  adLaunchConfiguration: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/query_boot_configuration`,
        data: params,
      });
    },
    UpdateConfiguration(params) {
      return createAxios({
        url: `/web_backend/update_boot_configuration`,
        data: params,
      });
    },
  },
};

export default advertisingManagement;
