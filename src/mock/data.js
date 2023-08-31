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
      "channel_001|7": ["@integer(0, 100)"],
      "channel_002|7": ["@integer(0, 100)"],
    },
    "date|7": ["@datetime"],
  }),
  GetUserActiveData: {
    data: {
      "channel_001|7": ["@integer(0, 100)"],
      "channel_002|7": ["@integer(0, 100)"],
    },
    "date|7": ["@datetime"],
  },
  GetCollectedData: Mock.mock({
    "channel_data|3": [
      {
        "channel_key|+1": 1,
        "channel_val|+1": ["渠道一", "渠道二", "渠道三"],
        "count|1-100": 1,
        "ratio|0.1-10": 0,
        "week_ratio|0.1-10": 0,
      },
    ],
    "table_data|5": [
      {
        "chain_ratio|0.1-10": 0,
        "current|1-100.1-10": 0,
        "label|+1": ["激活人数", "接单人数", "接单总数", "商单总数", "总支出"],
      },
    ],
    "version_data|3": [
      {
        "user_count|1-100": 1,
        "version|+1": ["v1.01", "v1.02", "v1.03"],
      },
    ],
  }),
};

export const userManagementData = {
  search: {
    GetUserInfo: {
      channel_key: "channel_001",
      channel_val: 1,
      commission_income: 0,
      commission_income_from_1: 0,
      commission_income_from_2: 0,
      commission_income_from_3: 0,
      down_line_one: 0,
      down_line_three: 0,
      down_line_two: 0,
      ex: 370,
      gold: 300,
      invite_income: 0,
      invite_user_id: 0,
      invite_user_name: "",
      last_login_time: 1686823496,
      level: 5,
      login_ip: "192.168.1.1",
      max_ex: 400,
      nickname: "test123",
      offer_income: 0,
      register_ip: "192.168.1.1",
      register_time: 1686801554,
      retention_rate: "0%",
      state: 0,
      take_offer_count: 1,
      total_income: 300,
      total_withdraw: 0,
      user_id: 600000002,
      valid_offer_count: 1,
      valid_offer_rate: "0%",
      video_count: 0,
    },
  },
};

export const dataManagementData = {
  GetComprehensiveData: [
    {
      all_award: 0,
      all_withdraw: 0,
      aver_count: 0,
      channel_key: "channel_001",
      channel_val: 1,
      commission_award: 0,
      incentive_video_count: 0,
      invite_award: 0,
      invite_count: 0,
      login_count: 1,
      offer_award: 0,
      register_count: 0,
      task_finish_rate: "0%",
      time: 1693450800.0,
      user_count: 0,
      user_count_valid: 0,
      withdraw_count: 0,
    },
  ],
};

export const withdrawalManagementData = {
  withdrawalAudit: {
    GetWithdrawAuditRecord: [
      {
        account: "test@gmail.com",
        amount: 10.0,
        apply_time: 1693275959,
        id: 1035,
        invitation_active_ratio: "0.0%",
        invite_award: 2500,
        method: 1,
        nickname: "test001",
        state: 4,
        total_award: 2033798,
        total_withdraw: 0.0,
        user_id: 600002510,
      },
    ],
  },
};
