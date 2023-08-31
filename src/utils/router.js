import router from "@/router/index";
import { isNavigationFailure, NavigationFailureType } from "vue-router";
import { ElNotification } from "element-plus";
import { useConfig } from "@/stores/config";
import { useNavTabs } from "@/stores/navTabs";
// import { useSiteConfig } from "@/stores/siteConfig";
// import { useMemberCenter } from "@/stores/memberCenter";
import { closeShade } from "@/utils/pageShade";
// import { adminBaseRoute, memberCenterBaseRoute } from "@/router/static";
// import { i18n } from "@/lang/index";
// import { isAdminApp } from "@/utils/common";
import { compact, isEmpty, reverse } from "lodash-es";

/**
 * 导航失败有错误消息的路由push
 * @param to — 导航位置，同 router.push
 */
export const routePush = async (to) => {
  try {
    const failure = await router.push(to);
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      ElNotification({
        message: "utils.Navigation failed, navigation guard intercepted!",
        type: "error",
      });
    } else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      ElNotification({
        message: "导航失败，已在导航目标位置！",
        type: "warning",
      });
    }
  } catch (error) {
    ElNotification({
      message: "utils.Navigation failed, invalid route!",
      type: "error",
    });
    console.error(error);
  }
};

/**
 * 获取第一个菜单
 */
export const getFirstRoute = (routes) => {
  const routerPaths = [];
  const routers = router.getRoutes();
  routers.forEach((item) => {
    if (item.path) routerPaths.push(item.path);
  });
  let find = false;
  for (const key in routes) {
    if (routes[key].meta?.menu_type == "tab" && routerPaths.indexOf(routes[key].path) !== -1) {
      return routes[key];
    } else if (routes[key].children && routes[key].children?.length) {
      find = getFirstRoute(routes[key].children);
      if (find) return find;
    }
  }
  return find;
};

/**
 * 打开侧边菜单
 * @param menu 菜单数据
 */
export const onClickMenu = (menu) => {
  switch (menu.meta?.menu_type) {
    case "iframe":
    case "tab":
      routePush({ path: menu.path });
      break;
    case "link":
      window.open(menu.path, "_blank");
      break;

    default:
      ElNotification({
        message: "跳转失败，找不到页面",
        type: "error",
      });
      break;
  }

  const config = useConfig();
  if (config.layout.shrink) {
    closeShade(() => {
      config.setLayout("menuCollapse", true);
    });
  }
};

/**
 * 处理后台的路由
 */
export const handleAdminRoute = (routes) => {
  const viewsComponent = import.meta.glob("/src/views/**/*.vue");
  addRouteAll(viewsComponent, routes, "/");
  const menuAdminBaseRoute = "/";

  // 更新stores中的路由菜单数据
  const navTabs = useNavTabs();
  navTabs.setTabsViewRoutes(handleMenuRule(routes, menuAdminBaseRoute));

  // navTabs.fillAuthNode(handleAuthNode(routes, menuAdminBaseRoute));
};

/**
 * 获取菜单的paths
 */
export const getMenuPaths = (menus) => {
  let menuPaths = [];
  menus.forEach((item) => {
    menuPaths.push(item.path);
    if (item.children && item.children.length > 0) {
      menuPaths = menuPaths.concat(getMenuPaths(item.children));
    }
  });
  return menuPaths;
};

/**
 * 会员中心和后台的菜单处理
 */
const handleMenuRule = (routes, pathPrefix = "/", type = ["menu", "menu_dir"]) => {
  const menuRule = [];

  for (const key in routes) {
    if (routes[key].extend == "add_rules_only") {
      continue;
    }
    if (!type.includes(routes[key].type)) {
      continue;
    }
    if (routes[key].type == "menu_dir" && routes[key].children && !routes[key].children.length) {
      continue;
    }
    if (
      ["route", "menu", "nav_user_menu", "nav"].includes(routes[key].type) &&
      ((routes[key].menu_type == "tab" && !routes[key].component) || (["link", "iframe"].includes(routes[key].menu_type) && !routes[key].url))
    ) {
      continue;
    }
    const currentPath = ["link", "iframe"].includes(routes[key].menu_type) ? routes[key].url : pathPrefix + routes[key].path;
    let children = [];
    if (routes[key].children && routes[key].children.length > 0) {
      children = handleMenuRule(routes[key].children, pathPrefix, type);
    }
    menuRule.push({
      path: currentPath,
      name: routes[key].name,
      component: routes[key].component,
      meta: {
        title: routes[key].title,
        icon: routes[key].icon,
        keepalive: routes[key].keepalive ? true : false,
        menu_type: routes[key].menu_type,
        type: routes[key].type,
        addtab: routes[key].addtab,
      },
      children: children,
    });
  }
  return menuRule;
};

/**
 * 处理权限节点
 * @param routes 路由数据
 * @param prefix 节点前缀
 * @returns 组装好的权限节点
 */
const handleAuthNode = (routes, prefix = "/") => {
  const authNode = new Map([]);
  assembleAuthNode(routes, authNode, prefix, prefix);
  return authNode;
};
const assembleAuthNode = (routes, authNode, prefix = "/", parent = "/") => {
  const authNodeTemp = [];
  for (const key in routes) {
    if (routes[key].type == "button") authNodeTemp.push(prefix + routes[key].name);
    if (routes[key].children && routes[key].children.length > 0) {
      assembleAuthNode(routes[key].children, authNode, prefix, prefix + routes[key].name);
    }
  }
  if (authNodeTemp && authNodeTemp.length > 0) {
    authNode.set(parent, authNodeTemp);
  }
};

/**
 * 动态添加路由-带子路由
 * @param viewsComponent
 * @param routes
 * @param parentName
 * @param analyticRelation 根据 name 从已注册路由分析父级路由
 */
export const addRouteAll = (viewsComponent, routes, parentName, analyticRelation = false) => {
  for (const idx in routes) {
    if (routes[idx].extend == "add_menu_only") {
      continue;
    }

    if ((routes[idx].menu_type == "tab" && viewsComponent[routes[idx].component]) || routes[idx].menu_type == "iframe") {
      addRouteItem(viewsComponent, routes[idx], parentName, analyticRelation);
    }

    if (routes[idx].children && routes[idx].children.length > 0) {
      addRouteAll(viewsComponent, routes[idx].children, parentName, analyticRelation);
    }
  }
};

/**
 * 动态添加路由
 * @param viewsComponent
 * @param route
 * @param parentName
 * @param analyticRelation 根据 name 从已注册路由分析父级路由
 */
export const addRouteItem = (viewsComponent, route, parentName, analyticRelation) => {
  let path = "",
    component;

  path = parentName ? route.path : "/" + route.path;
  component = viewsComponent[route.component];

  if (route.menu_type == "tab" && analyticRelation) {
    const parentNames = getParentNames(route.name);
    if (parentNames.length) {
      for (const key in parentNames) {
        if (router.hasRoute(parentNames[key])) {
          parentName = parentNames[key];
          break;
        }
      }
    }
  }

  const routeBaseInfo = {
    path: path,
    name: route.name,
    component: component,
    meta: {
      title: route.title,
      extend: route.extend,
      icon: route.icon,
      keepalive: route.keepalive,
      menu_type: route.menu_type,
      type: route.type,
      url: route.url,
      addtab: true,
    },
  };

  // console.log("addRouteItem ->", routeBaseInfo);

  if (parentName) {
    router.addRoute(parentName, routeBaseInfo);
  } else {
    router.addRoute(routeBaseInfo);
  }
};

/**
 * 根据name字符串，获取父级name组合的数组
 * @param name
 */
const getParentNames = (name) => {
  const names = compact(name.split("/"));
  const tempNames = [];
  const parentNames = [];
  for (const key in names) {
    tempNames.push(names[key]);
    if (parseInt(key) != names.length - 1) {
      parentNames.push(tempNames.join("/"));
    }
  }
  return reverse(parentNames);
};
