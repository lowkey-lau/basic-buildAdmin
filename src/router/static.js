/*
 * 静态路由
 */
const staticRoutes = [
  {
    // 首页
    path: "/",
    name: "/",
    redirect: "/loading",
    component: () => import("@/views/index.vue"),
    children: [
      {
        path: "loading/:to?",
        name: "adminMainLoading",
        component: () => import("@/views/common/loading.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "adminLogin",
    component: () => import("@/views/login/index.vue"),
  },
  // {
  //   path: "/index",
  //   name: "index",
  //   component: () => import("@/views/index.vue"),
  //   redirect: "adminMainLoading",
  // },
  {
    // 后台找不到页面了-可能是路由未加载上
    path: "/:path(.*)*",
    redirect: (to) => {
      return {
        name: "adminMainLoading",
        params: {
          to: JSON.stringify({
            path: to.path,
            query: to.query,
          }),
        },
      };
    },
  },
  // {
  //   path: "/loading/:to?",
  //   name: "adminMainLoading",
  //   component: () => import("@/views/common/loading.vue"),
  // },
  // {
  //   path: "/:path(.*)*",
  //   redirect: "/404",
  // },
  // {
  //   // 404
  //   path: "/404",
  //   name: "notFound",
  //   component: () => import("@/views/common/error/404.vue"),
  //   meta: {
  //     title: "404", // 页面不存在
  //   },
  // },
];

export { staticRoutes };
