import axios from "axios";
import qs from "qs";
import requestUrl from "./url.js";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import { EleNBox } from "@/utils/ele";
import { useRouter } from "vue-router";

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
    baseURL: "",
    method: axiosConfig.method || "POST",
    timeout: 1000 * 50,
    headers: {
      post: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Accept: "application/json",
      },
    },
    responseType: "json",
  });

  // instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
  // instance.defaults.headers.post["Accept"] = "application/json";

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

  Axios.interceptors.request.use(
    (config) => {
      let requestData = config.data || {};

      if (config.headers) {
        const token = adminInfo.getToken();
        if (token) config.headers.Authorization = token;
      }

      if (config.method === "post") {
        requestData.user_id = adminInfo.getUserId();
        config.data = qs.stringify({
          ...requestData,
        });
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  Axios.interceptors.response.use(
    (resource) => {
      if (resource.status == 200) {
        if (resource.data.code == 0) {
          return Promise.resolve(resource.data);
        }

        if (resource.data.code == 996) {
          router.push("/login");
        }
      }
      EleNBox.error(resource.data.msg);
      return Promise.reject(resource.data.msg);
    },
    (error) => {
      if (error.config.timeout >= 50000) {
        EleNBox.error("请求超时");
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
 * 生成每个请求的唯一key
 */
function getPendingKey(config) {
  let { data } = config;
  const { url, method, params, headers } = config;
  if (typeof data === "string") data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [
    url,
    method,
    headers && headers.batoken ? headers.batoken : "",
    headers && headers["lowey-user-token"] ? headers["lowey-user-token"] : "",
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
