/**
 * 登录接口
 */

import createAxios from "@/axios/index.js";
import requestUrl from "@/axios/url.js";

const login = {
  // 登录
  Login(params) {
    return createAxios({
      url: `${requestUrl[params.server]}/web_backend/login`,
      data: params.params,
    });
  },
};

export default login;
