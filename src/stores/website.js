import { defineStore } from "pinia";
import { WEBSITE_CONFIG } from "@/stores/constant/cacheKey";

export const useWebsite = defineStore("website", {
  state: () => {
    return {
      title: "Joy Coin",
    };
  },
  actions: {
    dataFill(state) {
      this.$state = { ...this.$state, ...state };
    },
  },
  persist: {
    key: WEBSITE_CONFIG,
  },
});
