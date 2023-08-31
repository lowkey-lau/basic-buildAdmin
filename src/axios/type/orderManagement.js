/**
 * 商单管理
 */
import createAxios from "@/axios/index.js";

const orderManagement = {
  // 商单列表
  orderList: {
    GetOrderList(params) {
      return createAxios({
        url: `/web_backend/fetch_offer_list`,
        data: params,
      });
    },
    GetOrderDetail(params) {
      return createAxios({
        url: `/web_backend/fetch_offer`,
        data: params,
      });
    },
    GetTaskList(params) {
      return createAxios({
        url: `/web_backend/fetch_offer_type`,
        data: params,
      });
    },
    DeleteOrder(params) {
      return createAxios({
        url: `/web_backend/delete_offer`,
        data: params,
      });
    },
    VisibleOrder(params) {
      return createAxios({
        url: `/web_backend/conceal_offer`,
        data: params,
      });
    },
  },
  // 商单数据（天）
  orderDataByDaily: {
    GetList(params) {
      return createAxios({
        url: `/web_backend/query_offer_data_by_day`,
        data: params,
      });
    },
  },
  // 商单数据（生涯）
  orderDataByCareer: {
    GetList(params) {
      return createAxios({
        url: `/web_backend/query_offer_data`,
        data: params,
      });
    },
  },
};

export default orderManagement;
