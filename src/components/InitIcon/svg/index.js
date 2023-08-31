import { readFileSync, readdirSync } from "fs";

let idPerfix = "";
const iconNames = [];
const svgTitle = /<svg([^>+].*?)>/;
const clearHeightWidth = /(width|height)="([^>+].*?)"/g;
const hasViewBox = /(viewBox="[^>+].*?")/g;
const clearReturn = /(\r)|(\n)/g;
// 清理 svg 的 fill
const clearFill = /(fill="[^>+].*?")/g;

function findSvgFile(dir) {
  const svgRes = [];
  const dirents = readdirSync(dir, {
    withFileTypes: true,
  });
  for (const dirent of dirents) {
    iconNames.push(`${idPerfix}-${dirent.name.replace(".svg", "")}`);

    console.log("iconNames", iconNames);

    if (dirent.isDirectory()) {
      svgRes.push(...findSvgFile(dir + dirent.name + "/"));
    } else {
      const svg = readFileSync(dir + dirent.name)
        .toString()
        .replace(clearReturn, "")
        .replace(clearFill, 'fill=""')
        .replace(svgTitle, ($1, $2) => {
          let width = 0;
          let height = 0;
          let content = $2.replace(clearHeightWidth, (s1, s2, s3) => {
            if (s2 === "width") {
              width = s3;
            } else if (s2 === "height") {
              height = s3;
            }
            return "";
          });
          if (!hasViewBox.test($2)) {
            content += `viewBox="0 0 ${width} ${height}"`;
          }
          return `<symbol id="${idPerfix}-${dirent.name.replace(".svg", "")}" ${content}>`;
        })
        .replace("</svg>", "</symbol>");
      svgRes.push(svg);
    }
  }
  return svgRes;
}

export const svgBuilder = (path, perfix = "local") => {
  if (path === "") return;
  idPerfix = perfix;
  const res = findSvgFile(path);
  return {
    name: "svg-transform",
    transformIndexHtml(html) {
      /* eslint-disable */
      return html.replace(
        "<body>",
        `
                <body>
                <svg id="local-icon" data-icon-name="${iconNames.join(",")}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
                ${res.join("")}
                </svg>
                `
      );
      /* eslint-enable */
    },
  };
};
