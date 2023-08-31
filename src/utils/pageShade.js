import { useEventListener } from "@vueuse/core";

/*
 * 显示页面遮罩
 */
export const showShade = function (className = "shade", closeCallBack) {
  const containerEl = document.querySelector(".layout-container");
  const shadeDiv = document.createElement("div");
  shadeDiv.setAttribute("class", "lowey-layout-shade " + className);
  containerEl.appendChild(shadeDiv);
  useEventListener(shadeDiv, "click", () => closeShade(closeCallBack));
};

/*
 * 隐藏页面遮罩
 */
export const closeShade = function (closeCallBack = () => {}) {
  const shadeEl = document.querySelector(".lowey-layout-shade");
  shadeEl && shadeEl.remove();

  closeCallBack();
};
