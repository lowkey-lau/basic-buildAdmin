import axios from "axios";
import qs from "qs";
import requestUrl from "./url.js";
import { ElNotification } from "element-plus";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import { useRouter } from "vue-router";

window.tokenRefreshing = false;
const pendingMap = new Map();

/**
 * 根据运行环境获取基础请求URL
 */
export const getUrl = () => {
  const server = useServer();
  return requestUrl[server.server];
};

const createAxios = (axiosConfig, options = {}, loading = {}) => {
  const adminInfo = useAdminInfo();
  const router = useRouter();

  const Axios = axios.create({
    baseURL: getUrl(),
    withCredentials: true,
    method: axiosConfig.method || "POST",
    // timeout: 1000 * 50,
    responseType: "json",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json",
    },
  });

  options = Object.assign(
    {
      CancelDuplicateRequest: true, // 是否开启取消重复请求, 默认为 true
      loading: false, // 是否开启loading层效果, 默认为false
      reductDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
      showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
      showCodeMessage: true, // 是否开启code不为1时的信息提示, 默认为true
      showSuccessMessage: false, // 是否开启code为1时的信息提示, 默认为false
      anotherToken: "", // 当前请求使用另外的用户token
    },
    options
  );

  // 请求拦截
  Axios.interceptors.request.use(
    (config) => {
      removePending(config);
      options.CancelDuplicateRequest && addPending(config);

      // let requestData = config.data || {};

      // if (config.headers) {
      //   // const token = adminInfo.getToken();
      //   // if (token) config.headers.Authorization = `Token ${token}`;
      //   config.headers.Cookie =
      //     "CF_Authorization=eyJhbGciOiJSUzI1NiIsImtpZCI6IjMzNDQ2OTVjOGRjYWU0OTY3MzQ3NWIwMTQ2ZTExY2IwZDAyMWNhNGE1YjI0YTllNjBkMmFkMjYwY2E2NmQwYjIifQ.eyJhdWQiOlsiOGQxYjM2OWY1ODRiYTk2ZGJiZTM5MzJiMjNhYWFmYmNiZTkzMDMwY2NiYTg0YzRmYTFjMTcyZjE5NzFlMTRjYiJdLCJlbWFpbCI6ImEzMTc2MDU3NDdAZ21haWwuY29tIiwiZXhwIjoxNzE3NTk1ODIyLCJpYXQiOjE3MTc1MDk0MjIsIm5iZiI6MTcxNzUwOTQyMiwiaXNzIjoiaHR0cHM6Ly9tb3JwaGEtb3BtLmNsb3VkZmxhcmVhY2Nlc3MuY29tIiwidHlwZSI6ImFwcCIsImlkZW50aXR5X25vbmNlIjoiYTN2dExrWE04NUxJQUd3RiIsInN1YiI6ImU4ZThhMGVlLTlmOTAtNWVkNy04NGE3LTc0ZTVjOGQ5MDA1MiIsImNvdW50cnkiOiJISyJ9.kjjm4xOrwZtkJ-MMvCrU5R7AFptfhaI2PvdoKEXGgxBjjyOmaRSTwPI0xTwdfPRHXxy8QFN1qRJ9T4SQB-4Lhh8o3mLu0xanCq8saqIf5XhlI5a11GpwI2S9c0jLXWAMTEqGt48zvELq0zkGldf-niTMpEo9WhJkjXBLSJP_lVn3w9jeX9IZZcboQhebtAHx5PmOfYmYRIyxS4_h7ptvf5uE-EuQKXwYqnG_l5SU6LDyjTTJzrdn0qz_lvvAVDOsqPfr_SfFh675CsOKm9dceyGXNgGwdYUbLyiI-ceMhXa3EDvInl7T-hB1Q5tOQ6PQC47A-6KBZnTZ60k0kaqFkg;CF_AppSession=nfc13045cc02f695d";
      // }

      // if (config.method === "post") {
      //   config.data = qs.stringify({
      //     ...requestData,
      //   });
      // }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截
  Axios.interceptors.response.use(
    (response) => {
      removePending(response.config);
      options.loading && closeLoading(options); // 关闭loading

      if (response.status == 200) {
        if (response.data.code == 0) {
          return Promise.resolve(response.data);
        }

        if (response.data.code == 1001) {
          router.push("/login");
        }
      }
      ElNotification.error(response.data.msg || response.data.error || "Error");
      return Promise.reject(response.data.msg || response.data.error || "Error");
    },
    (error) => {
      error.config && removePending(error.config);
      options.loading && closeLoading(options); // 关闭loading

      if (error.config.timeout >= 50000) {
        ElNotification.error("请求超时");
      }

      return Promise.reject(error);
    }
  );

  return Axios(axiosConfig);
};

export default createAxios;

/**
 * 关闭Loading层实例
 */
function closeLoading(options) {
  if (options.loading && loadingInstance.count > 0) loadingInstance.count--;
  if (loadingInstance.count === 0) {
    loadingInstance.target.close();
    loadingInstance.target = null;
  }
}

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 */
function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
}

/**
 * 删除重复的请求
 */
function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

/**
 * 删除所有请求
 */

export function removeAllPending() {
  pendingMap.forEach((item) => {
    item.cancelToken;
    pendingMap.delete(item);
  });
}

/**
 * 生成每个请求的唯一key
 */
function getPendingKey(config) {
  let { data } = config;

  const { url, method, params, headers } = config;
  if (typeof data === "string") data = qs.parse(data); // response里面返回的config.data是个字符串对象

  return [
    url,
    method,
    headers && headers.batoken ? headers.batoken : "",
    headers && headers["lowkey-user-token"] ? headers["lowkey-user-token"] : "",
    JSON.stringify(params),
    JSON.stringify(data),
  ].join("&");
}

/**
 * 根据请求方法组装请求数据/参数
 */
export function requestPayload(method, data) {
  if (method == "GET") {
    return {
      params: data,
    };
  } else if (method == "POST") {
    return {
      data: data,
    };
  }
}
