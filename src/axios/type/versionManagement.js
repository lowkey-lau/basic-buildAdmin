/**
 * 版本管理
 */

import createAxios from "@/axios/index.js";

const versionManagement = {
  // 审核开关
  auditSwitch: {
    GetChannelVersionAuditList(params) {
      return createAxios({
        url: `/web_backend/get_all_review`,
        data: params,
      });
    },
    CreateChannelVersionAudit(params) {
      return createAxios({
        url: `/web_backend/add_review`,
        data: params,
      });
    },
    EditChannelVersionAudit(params) {
      return createAxios({
        url: `/web_backend/update_review`,
        data: params,
      });
    },
    DeleteChannelVersionAudit(params) {
      return createAxios({
        url: `/web_backend/delete_review`,
        data: params,
      });
    },
  },
  // 版本配置
  versionUpgrade: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/fetch_versions`,
        data: params,
      });
    },
    DeleteConfiguration(params) {
      return createAxios({
        url: `/web_backend/delete_version`,
        data: params,
      });
    },
  },
};

export default versionManagement;
