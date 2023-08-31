/**
 * 提现管理
 */

import createAxios from "@/axios/index.js";
import Mock from "mockjs";
import { withdrawalManagementData } from "@/mock/data.js";

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

Mock.mock("/web_backend/fetch_withdraw", {
  code: 0,
  data: {
    count: 1,
    page: 1,
    data: withdrawalManagementData.withdrawalAudit.GetWithdrawAuditRecord,
  },
});
