// 치트시트 A4 PDF와 링크 미리보기 이미지를 만든다: node build-pdf.mjs → claude-saturi-cheatsheet.pdf, og.jpg
// data.js나 cheatsheet.html을 고치면 다시 돌린다. 치트시트 화면의 「PDF로 저장」과 실전 가이드가 이 파일을 받게 한다
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const req = createRequire(execSync("npm root -g").toString().trim() + "/");
const browser = await req("playwright").chromium.launch();
const page = await browser.newPage();
await page.goto("file://" + join(here, "cheatsheet.html"), { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: join(here, "claude-saturi-cheatsheet.pdf"), preferCSSPageSize: true, printBackground: true });
// 링크 미리보기: 단어가 쌓인 첫 화면(1200×630)
const hero = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await hero.goto("file://" + join(here, "index.html"), { waitUntil: "networkidle" });
await hero.waitForTimeout(4000);
await hero.screenshot({ path: join(here, "og.jpg"), type: "jpeg", quality: 82 });
await browser.close();
console.log("claude-saturi-cheatsheet.pdf와 og.jpg를 만들었다");
