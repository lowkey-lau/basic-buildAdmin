import { isEmpty } from "lodash-es";
import { reactive } from "vue";
import { defineStore } from "pinia";
import { STORE_TAB_VIEW_CONFIG } from "@/stores/constant/cacheKey";

export const useNavTabs = defineStore(
  "navTabs",
  () => {
    const state = reactive({
      // 激活tab的index
      activeIndex: 0,
      // 激活的tab
      activeRoute: null,
      // tab列表
      tabsView: [],
      // 当前tab是否全屏
      tabFullScreen: false,
      // 从后台加载到的菜单路由列表
      tabsViewRoutes: [],
      // 按钮权限节点
      authNode: new Map(),
    });

    function addTab(route) {
      if (!route.meta.addtab) return;

      for (const key in state.tabsView) {
        if (state.tabsView[key].path === route.path) {
          state.tabsView[key].params = !isEmpty(route.params) ? route.params : state.tabsView[key].params;
          state.tabsView[key].query = !isEmpty(route.query) ? route.query : state.tabsView[key].query;
          return;
        }
      }
      if (typeof route.meta.title == "string") {
        route.meta.title = route.meta.title;
      }

      state.tabsView.push(route);
    }

    function closeTab(route) {
      state.tabsView.map((v, k) => {
        if (v.path == route.path) {
          state.tabsView.splice(k, 1);
          return;
        }
      });
    }

    /**
     * 关闭多个标签
     * @param retainMenu 需要保留的标签，否则关闭全部标签
     */
    const closeTabs = (retainMenu = false) => {
      if (retainMenu) {
        state.tabsView = [retainMenu];
      } else {
        state.tabsView = [];
      }
    };

    const setActiveRoute = (route) => {
      const currentRouteIndex = state.tabsView.findIndex((item) => {
        return item.path === route.path;
      });
      if (currentRouteIndex === -1) return;
      state.activeRoute = route;
      state.activeIndex = currentRouteIndex;
    };

    const setTabsViewRoutes = (data) => {
      state.tabsViewRoutes = data;
    };

    const setAuthNode = (key, data) => {
      state.authNode.set(key, data);
    };

    const fillAuthNode = (data) => {
      state.authNode = data;
    };

    const setFullScreen = (fullScreen) => {
      state.tabFullScreen = fullScreen;
    };

    return { state, addTab, closeTab, closeTabs, setActiveRoute, setTabsViewRoutes, setAuthNode, fillAuthNode, setFullScreen };
  },
  {
    persist: {
      key: STORE_TAB_VIEW_CONFIG,
      paths: ["state.tabFullScreen"],
    },
  }
);

/**
 * 对iframe的url进行编码
 */
function encodeRoutesURI(data) {
  data.forEach((item) => {
    if (item.meta?.menu_type == "iframe") {
      item.path = "/admin/iframe/" + encodeURIComponent(item.path);
    }

    if (item.children && item.children.length) {
      item.children = encodeRoutesURI(item.children);
    }
  });
  return data;
}
