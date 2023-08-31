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
            <el-input v-model="form.username" clearable placeholder="用户名" />
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
      </div>
    </div>

    <vue-particles id="tsparticles" :particlesInit="particlesInit" :options="particlesConfig" />
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
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

const server = useServer();
const adminInfo = useAdminInfo();
const router = useRouter();

const form = reactive({
  username: "admin",
  password: "admin",
  server: "dev",
});

const serverList = [
  {
    value: "dev",
    label: "测试环境",
  },
  {
    value: "local",
    label: "本地环境",
  },
];

const handleLogin = () => {
  EleLoading.show();

  let data = {
    params: {
      username: form.username,
      password: form.password,
    },
    server: form.server,
  };

  server.dataFill({ server: form.server });
  adminInfo.dataFill(Object.assign({ token: "test123456789" }, { nickname: form.username }));
  EleNBox.success("登录成功");
  router.push("/");
  console.warning("test123456789", "当前登录Token");

  EleLoading.hide();

  // $api.login
  //   .Login(data)
  //   .then((res) => {

  //   })
  //   .finally(() => {
  //     EleLoading.hide();
  //   });
};

const particlesInit = async (engine) => {
  await loadFull(engine);
};

const clickDisabled = computed(() => form.username == "" || form.password == "");
</script>

<style lang="scss" scoped>
@import "./scss/index";
</style>
