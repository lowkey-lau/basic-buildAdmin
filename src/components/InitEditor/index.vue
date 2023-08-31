<template>
  <div class="initEditor">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="'default'" style="border-bottom: 1px solid #ccc" v-if="$props.showToolBar" />
    <Editor :defaultConfig="editorConfig" :defaultContent="jsonContent" :mode="'default'" v-model="valueHtml" :style="{ height: `${$props.height}px` }" style="overflow-y: hidden" @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus" @onBlur="handleBlur" @customAlert="customAlert" @customPaste="customPaste" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";

const $props = defineProps({
  value: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 200,
  },
  showToolBar: {
    type: Boolean,
    default: true,
  },
});

const $emit = defineEmits(["change"]);

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("");

watch(
  () => $props.value,
  (e1, _e1) => {
    valueHtml.value = e1;
  }
);

// 模拟 ajax 异步获取内容
// onMounted(() => {
//   console.log($props.value);

//   valueHtml.value = $props.value;
//   setTimeout(() => {
//     console.log("999", $props.value);
//     //   // valueHtml.value = "";
//   }, 1000);
// });

const toolbarConfig = {
  toolbarKeys: ["bold", "underline", "italic", "through", "color", "bgColor", "fontSize", "fontFamily", "insertLink", "indent", "delIndent", "justifyLeft", "justifyRight", "justifyCenter", "justifyJustify", "lineHeight"],
};
const editorConfig = { placeholder: "请输入内容..." };
const jsonContent = ref([
  {
    type: "paragraph",
    lineHeight: 2.5,
    children: [{ text: "", fontFamily: "", fontSize: "" }],
  },
]);

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  // console.log("change:", editor.getHtml());
  // let returnHtml =  editor.getHtml() === "<p><br></p>" ? "" : editor.getHtml();
  let returnHtml = editor.isEmpty() ? "" : editor.getHtml();
  $emit("change", returnHtml);
};
const handleDestroyed = (editor) => {
  // console.log("destroyed", editor);
};
const handleFocus = (editor) => {
  // console.log("focus", editor);
};
const handleBlur = (editor) => {
  // console.log("blur", editor);
};
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = (editor, event, callback) => {
  console.log("ClipboardEvent 粘贴事件对象", event);

  // 自定义插入内容
  // editor.insertText("xxx");

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false); // 返回 false ，阻止默认粘贴行为
  callback(true); // 返回 true ，继续默认的粘贴行为
};

const insertText = (e) => {
  const editor = editorRef.value;
  if (editor == null) return;

  console.log("666", $props.value);

  editor.insertText(e);
};

const printHtml = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  console.log(editor.getHtml());
};

const disable = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.disable();
};

// export default {
//   components: { Editor, Toolbar },
//   setup() {

//     return {
//       editorRef,
//       mode: "default",
//       valueHtml,
//       toolbarConfig,
//       editorConfig,
//       handleCreated,
//       handleChange,
//       handleDestroyed,
//       handleFocus,
//       handleBlur,
//       customAlert,
//       customPaste,
//       insertText,
//       printHtml,
//       disable,
//     };
//   },
// };
</script>

<style lang="scss" scoped>
.initEditor {
  border: 1px solid #ccc;
  width: 100%;
}
</style>
