import { defineStore } from "pinia";
import { ADMIN_INFO } from "@/stores/constant/cacheKey";

export const useAdminInfo = defineStore("adminInfo", {
  state: () => {
    return {
      token: "",
      user_id: "",
      nickname: "",
      avatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      last_login_time: "",
      refresh_token: "",

      // 是否是superAdmin，用于判定是否显示终端按钮等，不做任何权限判断
      super: false,
    };
  },
  actions: {
    dataFill(state) {
      this.$state = { ...this.$state, ...state };
    },
    removeToken() {
      this.token = "";
      this.refresh_token = "";
    },
    setToken(token) {
      this.token = token;
    },
    getToken() {
      return this.token;
    },
    getUserId() {
      return this.user_id;
    },
    setSuper(val) {
      this.super = val;
    },
  },
  persist: {
    key: ADMIN_INFO,
  },
});
