<!-- 数据管理 - 用户列表 -->
<template>
  <div class="initPanel">
    <div class="flex space-x-2 h-full">
      <div class="flex flex-col space-y-2 min-w-[120px] bg-black/20">
        <div
          v-for="item in state.userList"
          :key="item.id"
          class="cursor-pointer hover:bg-orange/20 p-2"
          :class="[{ 'bg-orange': item.account == state.selectAccount }]"
          @click="handleSelectAccount(item.account)"
        >
          <div class="">{{ item.account }}</div>
        </div>
      </div>
      <div class="flex flex-col h-full border-2 border-solid border-black w-full">
        <div class="flex-1 p-2 space-y-3 overflow-auto">
          <div v-for="item in state.msgList" :key="item.id" class="space-y-1">
            <div class="text-black font-[12px]">lowkey</div>
            <div class="bg-green/40 text-white p-2 inline-block">{{ item }}</div>
          </div>
        </div>
        <div class="flex bg-black/50 p-2 space-x-2">
          <input class="flex-1 border-none px-2" type="text" v-model="inputValue" />
          <button class="bg-blue p-2" @click="handleCommit">Send</button>
          <button class="bg-blue p-2" @click="handleDiscover">{{ state.socket && state.socket.connected ? "Discover" : "Connect" }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useServer } from "@/stores/server";
import $api from "@/axios/api.js";
import { ElMessage } from "element-plus";
import { io } from "socket.io-client";
import { useAdminInfo } from "@/stores/adminInfo";

const server = useServer();

const state = reactive({
  pageTitle: "数据管理 - 综合数据",
  loading: false,

  userList: [],
  socket: null,

  msgList: [],

  selectAccount: "",
});

const inputValue = ref("");

const handleCommit = () => {
  if (inputValue.value) {
    state.socket.emit("send_message", {
      to_account: state.selectAccount,
      data: inputValue.value,
    });
    inputValue.value = "";
  }
};

const handleDiscover = () => {
  if (state.socket.connected) {
    state.socket.disconnect();
  } else {
    state.socket.connect();
  }
};

const handleSelectAccount = (e) => {
  console.log(e);
  if (e != state.selectAccount) {
    state.selectAccount = e;
    state.msgList = [];
  }
};

const getList = () => {
  const adminInfo = useAdminInfo();

  $api.userManagement
    .GetList({
      pageNum: 1,
      pageSize: 20,
    })
    .then((res) => {
      state.userList = res.data.list.filter((item) => item.account != adminInfo.account);
    })
    .catch((error) => console.log(error));
};

onMounted(() => {
  getList();

  const adminInfo = useAdminInfo();

  state.socket = io("ws://127.0.0.1:3000", {
    auth: {
      serverOffset: 0,
    },
  });

  state.socket.on("connect", () => {
    state.socket.emit("login", { account: adminInfo.account });
  });

  state.socket.on("send_message", (msg, serverOffset) => {
    state.msgList.push(msg);
    state.socket.auth.serverOffset = serverOffset;
  });
});
</script>
