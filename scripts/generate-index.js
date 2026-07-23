import fs from "fs";
import path from "path";

const clientDir = path.resolve(process.cwd(), "dist/client");
const assetsDir = path.join(clientDir, "assets");

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

  if (jsFile) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FCC NetLink — Ultra Fast Fiber Broadband & 4K IPTV</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body class="bg-[#141414] text-white selection:bg-[#D2F500] selection:text-black">
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;

    fs.writeFileSync(path.join(clientDir, "index.html"), htmlContent, "utf-8");
    console.log(`[generate-index] Successfully created dist/client/index.html pointing to /assets/${jsFile}`);
  } else {
    console.warn("[generate-index] No index-*.js file found in dist/client/assets");
  }
} else {
  console.warn("[generate-index] dist/client/assets directory does not exist");
}
