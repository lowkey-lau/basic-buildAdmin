import Mock from "mockjs";

export const configurationData = {
  boot_type_map: [],
  channel_type: [],
  daily_task_map: [],
  invite_limit_map: [],
  level_reward_type: [],
  offer_source_type: [],
  rank_type_map: [],
  source_type_map: [],
  supported_task_type: [],
  user_channel_type: [],
  user_modify_action: [],
  user_state_modify_action: [],
  withdraw_limit_map: [],
  withdraw_method: [],
  withdraw_state: [],
};

export const dashboardData = {
  GetUserOnlineData: Mock.mock({
    data: {
      "AND_BRA_GG_001|7": ["@integer(0, 100)"],
      "AND_BRA_GG_002|7": ["@integer(0, 100)"],
    },
    "date|7": ["@datetime"],
  }),
  GetUserActiveData: {},
  GetCollectedData: Mock.mock({
    "channel_data|3": [
      {
        "channel_key|+1": 1,
        "channel_val|+1": ["渠道一", "渠道二", "渠道三"],
        "count|1-100": 1,
        "ratio|0-1.1-10": 1,
        "week_ratio|0-1.1-10": 1,
      },
    ],
    "table_data|5": [
      {
        "chain_ratio|0-1.1-10": 1,
        "current|1-100.1-10": 1,
        "label|+1": ["激活人数", "接单人数", "接单总数", "商单总数", "总支出"],
      },
    ],
    "version_data|3": [
      {
        "user_count|1-100.1-10": 1,
        "version|+1": 1,
      },
    ],
  }),
};
