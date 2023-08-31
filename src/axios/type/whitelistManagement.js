/**
 * 白名单管理
 */

import createAxios from "@/axios/index.js";

const whitelistManagement = {
  // 邀请白名单
  invite: {
    GetWhitelistRecord(params) {
      return createAxios({
        url: `/web_backend/query_invite_white_list`,
        data: params,
      });
    },
    CreateWhitelist(params) {
      return createAxios({
        url: `/web_backend/create_invite_white_list`,
        data: params,
      });
    },
    UpdateWhitelist(params) {
      return createAxios({
        url: `/web_backend/update_invite_white_list`,
        data: params,
      });
    },
    DeleteWhitelist(params) {
      return createAxios({
        url: `/web_backend/delete_invite_white_list`,
        data: params,
      });
    },
  },
  // 提现白名单
  withdrawal: {
    GetWhitelistRecord(params) {
      return createAxios({
        url: `/web_backend/get_white_record`,
        data: params,
      });
    },
    GetWhitelistDetail(params) {
      return createAxios({
        url: `/web_backend/get_one_withdraw_white`,
        data: params,
      });
    },
    CreateUpdateWhitelist(params) {
      return createAxios({
        url: `/web_backend/update_withdraw_white`,
        data: params,
      });
    },
    DeleteWhitelist(params) {
      return createAxios({
        url: `/web_backend/delete_withdraw_white`,
        data: params,
      });
    },
  },
};

export default whitelistManagement;
