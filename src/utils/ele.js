/** ------------------------------------- ElementUI Plus ------------------------------------- **/
import { ElMessage, ElNotification, ElLoading } from "element-plus";

let loadingInstance; //Loading实例
export const EleLoading = {
  /**
   * 弹出全局Loading效果
   * @param {Object} options 配置
   */
  show(options = { fullscreen: true, text: "加载中" }) {
    loadingInstance = ElLoading.service(options);
  },

  /**
   * 隐藏全局Loading效果
   */
  hide() {
    loadingInstance.close();
  },
};

export const EleMsg = {
  /**
   * 弹出成功信息
   * @param {string} msg 显示内容
   */
  success(msg) {
    ElMessage.success(msg);
  },

  /**
   * 弹出错误信息
   * @param {string} msg 显示内容
   */
  error(msg) {
    ElMessage.error(msg);
  },

  /**
   * 弹出提示信息
   * @param {string} msg 显示内容
   */
  warning(msg) {
    ElMessage.warning(msg);
  },
};

export const EleNBox = {
  /**
   * 弹出成功信息
   * @param {string} msg 显示内容
   */
  success(msg) {
    ElNotification.success(msg);
  },

  /**
   * 弹出提示信息
   * @param {string} msg 显示内容
   */
  error(msg) {
    ElNotification.error(msg);
  },

  /**
   * 弹出错误信息
   * @param {string} msg 显示内容
   */
  warning(msg) {
    ElNotification.warning(msg);
  },
};
