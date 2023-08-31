/**
 * 运营管理
 */

import createAxios from "@/axios/index.js";

const operationsManagement = {
  // 用户反馈
  userFeedback: {
    GetData(params) {
      return createAxios({
        url: `/web_backend/query_feedback_data`,
        data: params,
      });
    },
  },

  // 签到配置
  signInConfiguration: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/query_signin_configuration`,
        data: params,
      });
    },
    UpdateConfiguration(params) {
      return createAxios({
        url: `/web_backend/update_signin_configuration`,
        data: params,
      });
    },
  },

  // 排行榜
  leaderboard: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/query_rank_configuration`,
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

  // 日常任务
  dailyTasks: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/query_daily_task_config`,
        data: params,
      });
    },
    UpdateConfiguration(params) {
      return createAxios({
        url: `/web_backend/update_daily_task_config`,
        data: params,
      });
    },
  },

  // 等级奖励
  levelRewards: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/query_level_config`,
        data: params,
      });
    },
    UpdateConfiguration(params) {
      return createAxios({
        url: `/web_backend/update_level_config`,
        data: params,
      });
    },
  },
};

export default operationsManagement;
