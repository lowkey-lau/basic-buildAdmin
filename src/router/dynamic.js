/**
 * 图标库 https://fontawesome.com.cn/v4/icons
 */

const menus = [
  formatMenuItem("数据概览", "dashboard/index", "fa fa-tachometer"),
  formatMenuDir("商单管理", "orderManagement", "fa fa-briefcase", [
    formatMenuItem("商单列表", "orderManagement/orderList", "fa fa-ticket"),
    formatMenuItem("商单数据（天）", "orderManagement/orderDataByDaily"),
    formatMenuItem("商单数据（生涯）", "orderManagement/orderDataByCareer"),
  ]),
  formatMenuDir("用户信息", "userManagement", "fa fa-drivers-license", [
    formatMenuItem("用户数据", "userManagement/userDataDaily"),
    formatMenuItem("用户信息查询", "userManagement/search", "fa fa-user"),
    formatMenuItem("用户金币流水", "userManagement/userGoldCoinTurnover"),
  ]),
  formatMenuDir("数据管理", "dataManagement", "fa fa-database", [
    formatMenuItem("综合数据", "dataManagement/comprehensiveData"),
    formatMenuItem("新用户数据", "dataManagement/comprehensiveNewUserData"),
    formatMenuItem("留存数据", "dataManagement/retainData"),
    formatMenuItem("邀请数据", "dataManagement/invitationDataByDaily"),
    formatMenuItem("在线数据", "dataManagement/onlineData", "fa fa-line-chart"),
    formatMenuItem("事件数据", "dataManagement/eventData"),
  ]),
  formatMenuDir("运营管理", "operationsManagement", "fa fa-balance-scale", [
    formatMenuItem("Banner管理", "operationsManagement/bannerConfig", "fa fa-photo"),
    formatMenuItem("签到管理", "operationsManagement/signInConfiguration", "fa fa-gears"),
    formatMenuItem("问题反馈", "operationsManagement/userFeedback", "fa fa-comments-o"),
    formatMenuItem("日常任务", "operationsManagement/dailyTasks", "fa fa-bookmark"),
    formatMenuItem("等级奖励", "operationsManagement/levelRewards", "fa fa-signal"),
  ]),
  formatMenuDir("排行榜单管理", "leaderboardManagement", "fa fa-trophy", [
    formatMenuItem("邀请好友榜单配置", "leaderboardManagement/inviteFriends", "fa fa-gears"),
    formatMenuItem("商单收益榜单配置", "leaderboardManagement/businessOrderIncome", "fa fa-gears"),
  ]),
  formatMenuDir("广告配置", "advertisingManagement", "fa fa-bullhorn", [
    formatMenuItem("热冷启动广告配置", "advertisingManagement/adLaunchConfiguration", "fa fa-gears"),
  ]),
  formatMenuDir("提现管理", "withdrawalManagement", "fa fa-money", [
    formatMenuItem("提现审核", "withdrawalManagement/withdrawalAudit", "fa fa-gavel"),
    formatMenuItem("提现配置", "withdrawalManagement/withdrawalConfiguration", "fa fa-gears"),
  ]),
  formatMenuDir("版本管理", "versionManagement", "fa fa-wheelchair-alt", [
    formatMenuItem("版本更新", "versionManagement/versionUpgrade", "fa fa-download"),
    formatMenuItem("审核开关", "versionManagement/auditSwitch", "fa fa-toggle-on"),
  ]),
  formatMenuDir("白名单管理", "whitelistManagement", "fa fa-users", [
    formatMenuItem("邀请白名单", "whitelistManagement/invite"),
    formatMenuItem("提现白名单", "whitelistManagement/withdrawal"),
  ]),
  formatMenuDir("H5游戏管理", "gameManagement", "fa fa-gamepad", [formatMenuItem("游戏配置", "gameManagement/gameConfiguration", "fa fa-gears")]),
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
