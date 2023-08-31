import { defineStore } from "pinia";
import { SERVER_CONFIG } from "@/stores/constant/cacheKey";
import $api from "@/axios/api";

export const useServer = defineStore("website", {
  state: () => {
    return {
      server: "", //服务器
      adminConfig: null, //服务器请求参数配置
    };
  },
  actions: {
    dataFill(state) {
      this.$state = { ...this.$state, ...state };
    },

    getAdminConfig() {
      return new Promise((resolve, reject) => {
        $api.configuration
          .GetAdminConfig()
          .then((res) => {
            let adminConfig = this.$state.adminConfig;
            adminConfig = res.data;

            adminConfig.channel_type = unshiftAll(adminConfig.channel_type);
            adminConfig.user_channel_type = unshiftAll(adminConfig.user_channel_type);
            adminConfig.source_type_map = unshiftAll(adminConfig.source_type_map);

            this.$state.adminConfig = adminConfig;
            resolve();
          })
          .catch((error) => reject(error));
      });
    },
  },
  persist: {
    key: SERVER_CONFIG,
  },
});

const unshiftAll = (array) => {
  let allObj = {
    label: "全部",
    value: "",
  };
  return array ? [allObj, ...array] : [allObj];
};
