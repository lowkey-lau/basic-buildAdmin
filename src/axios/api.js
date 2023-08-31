/**
 * api接口的统一出口
 */
import login from "./type/login";
import configuration from "./type/configuration";
import dashboard from "./type/dashboard";
import orderManagement from "./type/orderManagement";
import dataManagement from "./type/dataManagement";
import operationsManagement from "./type/operationsManagement";
import leaderboardManagement from "./type/leaderboardManagement";
import userManagement from "./type/userManagement";
import versionManagement from "./type/versionManagement";
import whitelistManagement from "./type/whitelistManagement";
import gameManagement from "./type/gameManagement";
import advertisingManagement from "./type/advertisingManagement";
import withdrawalManagement from "./type/withdrawalManagement";

// 导出接口
export default {
  login,
  configuration,
  dashboard,
  orderManagement,
  dataManagement,
  operationsManagement,
  leaderboardManagement,
  userManagement,
  versionManagement,
  whitelistManagement,
  gameManagement,
  advertisingManagement,
  withdrawalManagement,
};
