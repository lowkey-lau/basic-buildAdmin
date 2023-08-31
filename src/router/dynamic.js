/**
 * 图标库 https://fontawesome.com.cn/v4/icons
 */

const menus = [
  formatMenuItem("数据概览", "dashboard/index", "fa fa-tachometer"),
  formatMenuDir("用户信息", "userManagement", "fa fa-drivers-license", [formatMenuItem("用户信息查询", "userManagement/search", "fa fa-user")]),
  formatMenuDir("数据管理", "dataManagement", "fa fa-database", [formatMenuItem("综合数据", "dataManagement/comprehensiveData")]),
  formatMenuDir("提现管理", "withdrawalManagement", "fa fa-money", [formatMenuItem("提现审核", "withdrawalManagement/withdrawalAudit", "fa fa-gavel")]),
];

function formatMenuDir(title, path, icon = "fa fa-th-list", children = null) {
  return {
    title: title,
    path: path,
    name: path,
    component: "",
    icon,
    menu_type: null,
    type: "menu_dir",
    extend: "none",
    children,
  };
}

function formatMenuItem(title, path, icon = "fa fa-list-alt") {
  return {
    title: title,
    path: path,
    name: path,
    component: `/src/views/${path}.vue`,
    keepalive: path,
    icon,
    menu_type: "tab",
    type: "menu",
  };
}

export { menus };
