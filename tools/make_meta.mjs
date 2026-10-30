// 목록 페이지에서 쓰는 과정 요약(시간·화면 수)을 static/lessons/meta.js 로 만듭니다.  사용: node tools/make_meta.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "static", "lessons");
const meta = {};
for (const f of readdirSync(dir).filter((f) => /^\d\d\.js$/.test(f)).sort()) {
  const n = Number(f.slice(0, 2));
  const ctx = vm.createContext({ LESSON_CONTENT: {} });
  vm.runInContext(readFileSync(join(dir, f), "utf-8"), ctx);
  const c = ctx.LESSON_CONTENT[n];
  if (c) meta[n] = { minutes: c.minutes, screens: c.blocks.filter((b) => b.t === "h").length };
}
writeFileSync(join(dir, "meta.js"),
  "/* 자동 생성 파일: node tools/make_meta.mjs 로 다시 만들어요. (목록 페이지에서 시간·화면 수를 보여주기 위한 요약) */\nvar LESSON_META = " + JSON.stringify(meta) + ";\n", "utf-8");
console.log("meta.js 갱신:", Object.keys(meta).join(", ") || "(과정 파일 없음)");
