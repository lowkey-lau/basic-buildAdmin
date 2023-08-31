/**
 * H5小游戏管理
 */

import createAxios from "@/axios/index.js";

const gameManagement = {
  // H5小游戏配置
  gameConfiguration: {
    GetConfigurationList(params) {
      return createAxios({
        url: `/web_backend/get_game_list`,
        data: params,
      });
    },
    GetConfigurationDetail(params) {
      return createAxios({
        url: `/web_backend/get_game_data`,
        data: params,
      });
    },
    DeleteConfiguration(params) {
      return createAxios({
        url: `/web_backend/delete_game_data`,
        data: params,
      });
    },
  },
};

export default gameManagement;
