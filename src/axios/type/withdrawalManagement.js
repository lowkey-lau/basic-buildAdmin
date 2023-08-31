/**
 * 提现管理
 */

import createAxios from "@/axios/index.js";

const withdrawalManagement = {
  // 提现审核
  withdrawalAudit: {
    GetWithdrawAuditRecord(params) {
      return createAxios({
        url: `/web_backend/fetch_withdraw`,
        data: params,
      });
    },
    AuditWithdraw(params) {
      return createAxios({
        url: `/web_backend/audit_withdraw`,
        data: params,
      });
    },
  },
};

export default withdrawalManagement;
