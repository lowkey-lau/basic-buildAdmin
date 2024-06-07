/**
 * 登录接口
 */

import createAxios from "@/axios/index.js";
import requestUrl from "@/axios/url.js";

const login = {
  // 登录
  Login(params) {
    return createAxios({
      url: `${requestUrl[params.server]}/api/account/login`,
      data: params.params,
    });
  },
  // 注册
  Register(params) {
    return createAxios({
      url: `/api/account/register`,
      data: params.params,
    });
  },
};

export default login;
