try {
  if (typeof console.__proto__.warning !== "function") {
    console.__proto__.warning = function (v, tips, style) {
      if (!style) {
        style = "color:#e6a23c;font-size: 20px;";
      }

      console.log(`%c[${tips || "warning"}]`, style, v || "");
    };
  }
} catch (error) {
  console.log("console proto error.");
}
