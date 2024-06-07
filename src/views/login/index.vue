<template>
  <div class="loginBox">
    <div class="loginBox-wrapper">
      <div class="loginBox-title">XXX - 后台管理系统</div>
      <div class="loginBox-container">
        <el-form :model="form">
          <el-form-item>
            <template #label>
              <div class="loginBox-form__list-icon">
                <Icon color="#000" name="el-icon-User" size="20px" />
              </div>
            </template>
            <el-input v-model="form.account" clearable placeholder="用户名" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="loginBox-form__list-icon">
                <Icon color="#000" name="el-icon-Lock" size="20px" />
              </div>
            </template>
            <el-input type="password" v-model="form.password" clearable show-password placeholder="密码" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="loginBox-form__list-icon">
                <Icon color="#000" name="el-icon-Connection" size="20px" />
              </div>
            </template>
            <el-select v-model="form.server" placeholder="服务器">
              <el-option v-for="item in serverList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="loginBox-btn">
          <div class="initButton">
            <div class="initButton-btn" @click="handleLogin()"><span>登录</span></div>
          </div>
        </div>

        <el-link type="primary" style="margin-top: 12px" @click="changeVisible(1, true)">新增账户</el-link>
      </div>
    </div>

    <vue-particles id="tsparticles" :particlesLoaded="particlesLoaded" :options="particlesConfig" />

    <DialogByRegister :visible="visibleByRegister" @changeVisible="changeVisible" />
  </div>
</template>

<script setup>
import DialogByRegister from "./components/DialogByRegister.vue";

import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useServer } from "@/stores/server";
import { useAdminInfo } from "@/stores/adminInfo";
import { EleLoading, EleNBox } from "@/utils/ele";
import { onKeyStroke } from "@vueuse/core";
import { loadFull } from "tsparticles";
import { particlesConfig } from "@/assets/js/particlesConfig.js";

import $api from "@/axios/api.js";

onKeyStroke("Enter", (e) => {
  e.preventDefault();

  if (!clickDisabled.value) {
    handleLogin();
  }
});

const visibleByRegister = ref(false);

const server = useServer();
const adminInfo = useAdminInfo();
const router = useRouter();

const form = reactive({
  account: "",
  password: "",
  server: "dev",
});

const serverList = [
  {
    value: "dev",
    label: "测试环境",
  },
  // {
  //   value: "local",
  //   label: "本地环境",
  // },
];

const handleLogin = () => {
  EleLoading.show();

  let data = {
    params: {
      account: form.account,
      password: form.password,
    },
    server: form.server,
  };

  server.dataFill({ server: form.server });
  // router.push("/");

  $api.login
    .Login(data)
    .then((res) => {
      adminInfo.dataFill(Object.assign({ token: res.data.token }, { account: form.account }));
      EleNBox.success("登录成功");
      EleLoading.hide();
      console.warning(res.data.token, "当前登录Token");
      router.push("/");
    })
    .finally(() => {
      EleLoading.hide();
    });
};

const changeVisible = (type, e) => {
  switch (type) {
    case 1:
      visibleByRegister.value = e;
      break;
  }
};

// const particlesLoaded = async (engine) => {
//   await loadFull(engine);
// };

const particlesLoaded = async (container) => {
  console.log("Particles container loaded", container);
};

const clickDisabled = computed(() => form.account == "" || form.password == "");
</script>

<style lang="scss" scoped>
@import "./scss/index";
</style>
