import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/mock/index.js";
import createAxios from "@/axios/index.js";

import pinia from "@/stores";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import { registerIcons } from "@/utils/common";

import "default-passive-events";

import "normalize.css/normalize.css";
import "font-awesome/css/font-awesome.min.css";

import "@/utils/console.js";

// 引入全局组件
import InitInput from "./components/InitInput/index.vue";
import InitSelect from "./components/InitSelect/index.vue";
import InitDatePicker from "./components/InitDatePicker/index.vue";
import InitData from "./components/InitData/index.vue";
import Particles from "vue3-particles";

async function start() {
  const app = createApp(App);
  app.use(pinia);

  app.use(router);
  app.use(ElementPlus, {
    locale: zhCn,
  });
  app.use(Particles);

  // 全局注册组件
  registerIcons(app);
  app.component("InitInput", InitInput);
  app.component("InitSelect", InitSelect);
  app.component("InitDatePicker", InitDatePicker);
  app.component("InitData", InitData);

  app.mount("#app");
  app.config.globalProperties.$createAxios = createAxios;
}

start();
