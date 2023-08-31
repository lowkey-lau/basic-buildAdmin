/**
 * 排行榜管理
 */

import createAxios from "@/axios/index.js";

const leaderboardManagement = {
  // 排行榜
  leaderboard: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/query_rank_configuration`,
        data: params,
      });
    },
    GetRankLimitData(params) {
      return createAxios({
        url: `/web_backend/query_rank_limit_configuration`,
        data: params,
      });
    },
    UpdateConfiguration(params) {
      return createAxios({
        url: `/web_backend/update_rank_configuration`,
        data: params,
      });
    },
  },
};

export default leaderboardManagement;
