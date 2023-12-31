// import { nextTick } from "vue";
import * as elIcons from "@element-plus/icons-vue";
// import router from "@/router/index";
import Icon from "@/components/InitIcon/index.vue";
// import { useNavTabs } from "@/stores/navTabs";
// import { useMemberCenter } from "@/stores/memberCenter";
// import { useSiteConfig } from "../stores/siteConfig";
// import { useTitle } from "@vueuse/core";
// import { getUrl } from "./axios";
// import { adminBaseRoute } from "@/router/static";
// import { trim, trimStart } from "lodash-es";

export function registerIcons(app) {
  /*
   * 全局注册 Icon
   * 使用方式: <Icon name="name" size="size" color="color" />
   * 详见<待完善>
   */
  app.component("Icon", Icon);

  /*
   * 全局注册element Plus的icon
   */
  const icons = elIcons;
  for (const i in icons) {
    app.component(`el-icon-${icons[i].name}`, icons[i]);
  }
}

/**
 * 加载网络css文件
 * @param url css资源url
 */
// export function loadCss(url) {
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.href = url;
//   link.crossOrigin = "anonymous";
//   document.getElementsByTagName("head")[0].appendChild(link);
// }

// /**
//  * 加载网络js文件
//  * @param url js资源url
//  */
// export function loadJs(url) {
//   const link = document.createElement("script");
//   link.src = url;
//   document.body.appendChild(link);
// }

// /**
//  * 根据路由 meta.title 设置浏览器标题
//  */
// export function setTitleFromRoute() {
//   if (typeof router.currentRoute.value.meta.title != "string") {
//     return;
//   }
//   nextTick(() => {
//     let webTitle = "";
//     if (router.currentRoute.value.meta.title.indexOf("pagesTitle.") === -1) {
//       webTitle = router.currentRoute.value.meta.title;
//     } else {
//       webTitle = i18n.global.t(router.currentRoute.value.meta.title);
//     }
//     const title = useTitle();
//     const siteConfig = useSiteConfig();
//     title.value = `${webTitle}${siteConfig.siteName ? " - " + siteConfig.siteName : ""}`;
//   });
// }

// /**
//  * 设置浏览器标题-只能在路由加载完成后调用
//  * @param webTitle 新的标题
//  */
// export function setTitle(webTitle) {
//   const title = useTitle();
//   const siteConfig = useSiteConfig();
//   title.value = `${webTitle}${siteConfig.siteName ? " - " + siteConfig.siteName : ""}`;
// }

/**
 * 是否是外部链接
 * @param path
 */
export function isExternal(path) {
  return /^(https?|ftp|mailto|tel):/.test(path);
}

/**
 * 在数值前面添加符号
 * @param {*} value 数值
 * @param {*} type 符号文案
 * @returns
 */
export function AddSymbol(value, type = "R$") {
  return type + value;
}

// /**
//  * 防抖
//  * @param fn 执行函数
//  * @param ms 间隔毫秒数
//  */
// export const debounce = (fn, ms) => {
//   return (...args) => {
//     if (window.lazy) {
//       clearTimeout(window.lazy);
//     }
//     window.lazy = window.setTimeout(() => {
//       fn(...args);
//     }, ms);
//   };
// };

// /**
//  * 根据pk字段的值从数组中获取key
//  * @param arr
//  * @param pk
//  * @param value
//  */
// export const getArrayKey = (arr, pk, value) => {
//   for (const key in arr) {
//     if (arr[key][pk] == value) {
//       return key;
//     }
//   }
//   return false;
// };

// /**
//  * 表单重置
//  * @param formEl
//  */
// export const onResetForm = (formEl) => {
//   if (!formEl) return;
//   formEl.resetFields && formEl.resetFields();
// };

// /**
//  * 将数据构建为ElTree的data {label:'', children: []}
//  * @param data
//  */
// export const buildJsonToElTreeData = (data) => {
//   if (typeof data == "object") {
//     const childrens = [];
//     for (const key in data) {
//       childrens.push({
//         label: key + ": " + data[key],
//         children: buildJsonToElTreeData(data[key]),
//       });
//     }
//     return childrens;
//   } else {
//     return [];
//   }
// };

// /**
//  * 是否在后台应用内
//  * @param path 不传递则通过当前路由 path 检查
//  */
// export const isAdminApp = (path = "") => {
//   if (path) {
//     return /^\/admin/.test(path);
//   }
//   if (/^\/admin/.test(getCurrentRoutePath())) {
//     return true;
//   }
//   return false;
// };

// /**
//  * 是否为手机设备
//  */
// export const isMobile = () => {
//   return !!navigator.userAgent.match(/android|webos|ip(hone|ad|od)|opera (mini|mobi|tablet)|iemobile|windows.+(phone|touch)|mobile|fennec|kindle (Fire)|Silk|maemo|blackberry|playbook|bb10\; (touch|kbd)|Symbian(OS)|Ubuntu Touch/i);
// };

// /**
//  * 从一个文件路径中获取文件名
//  * @param path 文件路径
//  */
// export const getFileNameFromPath = (path) => {
//   const paths = path.split("/");
//   return paths[paths.length - 1];
// };

// /**
//  * 页面按钮鉴权
//  * @param name
//  */
// export const auth = (name) => {
//   const path = getCurrentRoutePath();
//   const store = isAdminApp() ? useNavTabs() : useMemberCenter();
//   if (store.state.authNode.has(path)) {
//     if (store.state.authNode.get(path).some((v) => v == path + "/" + name)) {
//       return true;
//     }
//   }
//   return false;
// };

// /**
//  * 获取资源完整地址
//  * @param relativeUrl 资源相对地址
//  * @param domain 指定域名
//  */
// export const fullUrl = (relativeUrl, domain = "") => {
//   const siteConfig = useSiteConfig();
//   if (!domain) {
//     domain = siteConfig.cdnUrl ? siteConfig.cdnUrl : getUrl();
//   }
//   if (!relativeUrl) return domain;

//   const regUrl = new RegExp(/^http(s)?:\/\//);
//   const regexImg = new RegExp(/^((?:[a-z]+:)?\/\/|data:image\/)(.*)/i);
//   if (!domain || regUrl.test(relativeUrl) || regexImg.test(relativeUrl)) {
//     return relativeUrl;
//   }
//   return domain + relativeUrl;
// };

// /**
//  * 获取路由 path
//  */
// export const getCurrentRoutePath = () => {
//   let path = router.currentRoute.value.path;
//   if (path == "/") path = trimStart(window.location.hash, "#");
//   if (path.indexOf("?") !== -1) path = path.replace(/\?.*/, "");
//   return path;
// };

// /**
//  * 获取根据当前路由路径动态加载的语言翻译
//  * @param key 无需语言路径的翻译key，亦可使用完整路径
//  * @param named — 命名插值的值
//  * @param options — 其他翻译选项
//  * @returns — Translated message
//  */
// export const __ = (key, named, options) => {
//   let langPath = "";
//   const path = getCurrentRoutePath();
//   if (isAdminApp()) {
//     langPath = path.slice(path.indexOf(adminBaseRoute.path) + adminBaseRoute.path.length);
//     langPath = trim(langPath, "/").replaceAll("/", ".");
//   } else {
//     langPath = trim(path, "/").replaceAll("/", ".");
//   }
//   langPath = langPath ? langPath + "." + key : key;
//   return i18n.global.te(langPath) ? i18n.global.t(langPath, named ?? {}, options) : i18n.global.t(key, named ?? {}, options);
// };

// /**
//  * 文件类型效验，主要用于云存储
//  * 服务端并不能单纯此函数来限制文件上传
//  * @param {string} fileName 文件名
//  * @param {string} fileType 文件mimetype，不一定存在
//  */
// export const checkFileMimetype = (fileName, fileType) => {
//   if (!fileName) return false;
//   const siteConfig = useSiteConfig();
//   const mimetype = siteConfig.upload.mimetype.toLowerCase().split(",");

//   const fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
//   if (siteConfig.upload.mimetype === "*" || mimetype.includes(fileSuffix) || mimetype.includes("." + fileSuffix)) {
//     return true;
//   }
//   if (fileType) {
//     const fileTypeTemp = fileType.toLowerCase().split("/");
//     if (mimetype.includes(fileTypeTemp[0] + "/*") || mimetype.includes(fileType)) {
//       return true;
//     }
//   }
//   return false;
// };

// /**
//  * 获取一组资源的完整地址
//  * @param relativeUrls 资源相对地址
//  * @param domain 指定域名
//  */
// export const arrayFullUrl = (relativeUrls, domain = "") => {
//   if (typeof relativeUrls === "string") {
//     relativeUrls = relativeUrls == "" ? [] : relativeUrls.split(",");
//   }
//   for (const key in relativeUrls) {
//     relativeUrls[key] = fullUrl(relativeUrls[key], domain);
//   }
//   return relativeUrls;
// };

// /**
//  * 格式化时间戳
//  * @param dateTime 时间戳
//  * @param fmt 格式化方式，默认：yyyy-mm-dd hh:MM:ss
//  */
// export const timeFormat = (dateTime = null, fmt = "yyyy-mm-dd hh:MM:ss") => {
//   if (dateTime == "none") return i18n.global.t("None");
//   if (!dateTime) dateTime = Number(new Date());
//   if (dateTime.toString().length === 10) {
//     dateTime = +dateTime * 1000;
//   }

//   const date = new Date(dateTime);
//   let ret;
//   const optObj = {
//     "y+": date.getFullYear().toString(), // 年
//     "m+": (date.getMonth() + 1).toString(), // 月
//     "d+": date.getDate().toString(), // 日
//     "h+": date.getHours().toString(), // 时
//     "M+": date.getMinutes().toString(), // 分
//     "s+": date.getSeconds().toString(), // 秒
//   };
//   for (const k in opt) {
//     ret = new RegExp("(" + k + ")").exec(fmt);
//     if (ret) {
//       fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : padStart(opt[k], ret[1].length, "0"));
//     }
//   }
//   return fmt;
// };

// /**
//  * 字符串补位
//  */
// const padStart = (str, maxLength, fillString = " ") => {
//   if (str.length >= maxLength) return str;

//   const fillLength = maxLength - str.length;
//   let times = Math.ceil(fillLength / fillString.length);
//   while ((times >>= 1)) {
//     fillString += fillString;
//     if (times === 1) {
//       fillString += fillString;
//     }
//   }
//   return fillString.slice(0, fillLength) + str;
// };

// /**
//  * 根据当前时间生成问候语
//  */
// export const getGreet = () => {
//   const now = new Date();
//   const hour = now.getHours();
//   let greet = "";

//   if (hour < 5) {
//     greet = i18n.global.t("utils.Late at night, pay attention to your body!");
//   } else if (hour < 9) {
//     greet = i18n.global.t("utils.good morning!") + i18n.global.t("utils.welcome back");
//   } else if (hour < 12) {
//     greet = i18n.global.t("utils.Good morning!") + i18n.global.t("utils.welcome back");
//   } else if (hour < 14) {
//     greet = i18n.global.t("utils.Good noon!") + i18n.global.t("utils.welcome back");
//   } else if (hour < 18) {
//     greet = i18n.global.t("utils.good afternoon") + i18n.global.t("utils.welcome back");
//   } else if (hour < 24) {
//     greet = i18n.global.t("utils.Good evening") + i18n.global.t("utils.welcome back");
//   } else {
//     greet = i18n.global.t("utils.Hello!") + i18n.global.t("utils.welcome back");
//   }
//   return greet;
// };

/* ------------------------------------ 数据筛选处理 ----------------------------------------- */
/**
 * 根据 id 找出列表里对应 id 的 name
 * @param { Array } list 需要索引的列表
 * @param { any } id 需要查找的值
 * @returns
 */
export function FilterLabelById(list, id) {
  let findItem = list.find((item) => item.id == id);
  return findItem ? findItem.name : id;
}

/**
 * 根据 value 找出列表里对应 value 的 label
 * @param { Array } list 需要索引的列表
 * @param { any } value 需要查找的值
 * @returns
 */
export function FilterLabelByValue(list, value) {
  let findItem = list.find((item) => item.value === value);
  return findItem ? findItem.label : value;
}
