// 과정 내용 검사기.  사용: node tools/check_lessons.mjs [과정번호 ...]   (번호를 안 주면 static/lessons/ 의 모든 과정)
//  1) 구조/문체 규칙 검사 (오류 = 반드시 고칠 것, 경고 = 가능하면 고칠 것)
//  2) 코드 실제 실행 검사: 편집기(editor)의 정답 코드와 py:true 인 code 블록의 "out" 이 진짜 파이썬 결과와 같은지 확인
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "static");
const wanted = process.argv.slice(2).map(Number).filter(Number.isFinite);

// ---------- 불러오기 ----------
function loadFile(path) {
  const ctx = vm.createContext({ LESSON_CONTENT: {}, console });
  vm.runInContext(readFileSync(path, "utf-8"), ctx, { filename: path });
  return ctx.LESSON_CONTENT;
}
const lessons = {};
const BUILTIN = [1, 2, 7]; // static/lessons.js 안에 있는 완성 과정: 구조 검사는 건너뛰고 코드 실행 검사만 함
function loadBuiltin() {
  const ctx = vm.createContext({ console });
  vm.runInContext(readFileSync(join(STATIC, "lessons.js"), "utf-8") + "\n;globalThis.__LC = LESSON_CONTENT;", ctx);
  return ctx.__LC;
}
const dir = join(STATIC, "lessons");
for (const f of readdirSync(dir).filter((f) => /^\d\d\.js$/.test(f))) {
  const n = Number(f.slice(0, 2));
  if (wanted.length && !wanted.includes(n)) continue;
  try { const lc = loadFile(join(dir, f)); if (lc[n]) lessons[n] = lc[n]; else lessons[n] = null; }
  catch (e) { lessons[n] = { __loadError: String(e.message || e) }; }
}
const builtin = BUILTIN.filter((n) => !wanted.length || wanted.includes(n));
if (builtin.length) { const lc = loadBuiltin(); for (const n of builtin) lessons[n] = Object.assign({ __builtin: true }, lc[n]); }
if (wanted.length) for (const n of wanted) if (!(n in lessons)) lessons[n] = undefined;

const iconNames = new Set([...readFileSync(join(STATIC, "icons.js"), "utf-8").matchAll(/^ "([a-z0-9-]+)":/gm)].map((m) => m[1]));
const allowedLinks = new Set(JSON.parse(readFileSync(join(ROOT, "tools", "allowed-links.json"), "utf-8")).urls.map((u) => decodeURI(u)));

const ALLOWED = new Set(["h", "h3", "p", "list", "steps", "code", "compare", "cards", "anat", "tree", "table", "img", "video", "key", "tip", "warn", "quiz", "refs", "editor", "boxes", "flow"]);
const TEXT = new Set(["p", "list", "steps", "key", "tip", "warn", "h3"]);
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B50}\u{2B06}\u{2705}\u{274C}]/u;
const PY_LESSON = (n) => n >= 7;

let errors = 0, warnings = 0;
const snippets = []; // 실제 실행해서 확인할 코드들

for (const [nStr, lesson] of Object.entries(lessons)) {
  const n = Number(nStr);
  const E = (m) => { errors++; console.log(`  ✘ 오류 [${n}] ${m}`); };
  const W = (m) => { warnings++; console.log(`  ! 경고 [${n}] ${m}`); };
  console.log(`\n=== 과정 ${n} ===`);
  if (lesson === undefined) { E(`static/lessons/${String(n).padStart(2, "0")}.js 파일이 없어요`); continue; }
  if (lesson === null) { E(`파일은 있지만 LESSON_CONTENT[${n}] 를 만들지 않았어요`); continue; }
  if (lesson.__loadError) { E("파일을 읽다가 문법 오류: " + lesson.__loadError); continue; }
  if (lesson.__builtin) {  // lessons.js 안의 과정: 코드 실행 검사만
    let n_ = 0;
    for (const b of lesson.blocks) {
      if (b.t === "code" && b.py) { snippets.push({ id: `${n}|${b.file || "code"}|code`, kind: "code", code: b.text, stdin: b.stdin || "", expect: b.out }); n_++; }
      if (b.t === "editor") { if (b.solution) snippets.push({ id: `${n}|editor|solution`, kind: "editor", code: b.solution, stdin: b.stdin || "", expect: b.expect }); n_++; }
    }
    console.log(`  (lessons.js 안의 과정: 코드 실행 검사만, 검사 대상 ${n_}개)`);
    continue;
  }

  if (!Number.isInteger(lesson.minutes) || lesson.minutes < 8 || lesson.minutes > 45) E("minutes 는 8~45 사이의 정수");
  if (typeof lesson.intro !== "string" || lesson.intro.length < 20 || lesson.intro.length > 150) E("intro 는 20~150자 문장");
  if (!Array.isArray(lesson.goals) || lesson.goals.length !== 3) E("goals 는 정확히 3개");
  else lesson.goals.forEach((g) => { if (typeof g !== "string" || g.length > 60) W(`goals 문장이 너무 길어요(60자 이내): ${g}`); });
  if (!Array.isArray(lesson.blocks)) { E("blocks 배열이 없어요"); continue; }

  // 인라인 서식 짝 검사 + 이모지
  const checkText = (s, where) => {
    if (typeof s !== "string") return;
    if (EMOJI.test(s)) E(`이모지는 쓰지 않아요 (${where}): ${s.slice(0, 40)}`);
    if ((s.match(/\*\*/g) || []).length % 2) E(`** 짝이 안 맞아요 (${where}): ${s.slice(0, 50)}`);
    if ((s.match(/==/g) || []).length % 2) E(`== 짝이 안 맞아요 (${where}): ${s.slice(0, 50)}`);
    if ((s.match(/`/g) || []).length % 2) E(`백틱(\`) 짝이 안 맞아요 (${where}): ${s.slice(0, 50)}`);
    if ((s.match(/\{\{/g) || []).length !== (s.match(/\}\}/g) || []).length) E(`{{ }} 짝이 안 맞아요 (${where}): ${s.slice(0, 50)}`);
  };

  const sections = []; let cur = null; let refs = null;
  for (const b of lesson.blocks) {
    if (!b || typeof b !== "object" || !ALLOWED.has(b.t)) { E(`쓸 수 없는 블록 종류: ${b && b.t}`); continue; }
    if (b.t === "refs") { refs = b; continue; }
    if (b.t === "h") { cur = { h: b, blocks: [] }; sections.push(cur); continue; }
    if (!cur) { E("첫 블록은 h(화면 시작)여야 해요"); continue; }
    cur.blocks.push(b);
  }
  const hCount = sections.length;
  if (hCount < 9 || hCount > 14) E(`화면(h)은 9~14개여야 해요 (지금 ${hCount}개)`);

  let editorCount = 0, quizSections = 0, summarySections = 0;
  sections.forEach((sec, i) => {
    const h = sec.h; const tag = `${i + 1}번째 화면 "${h.text}"`;
    if (typeof h.text !== "string" || !h.text) E(`${tag}: 제목(text) 없음`);
    checkText(h.text, tag);
    if (typeof h.sub !== "string" || !h.sub) W(`${tag}: sub(한 줄 요약) 없음`);
    checkText(h.sub, tag);
    if (!h.icon || !iconNames.has(h.icon)) E(`${tag}: icon "${h.icon}" 은(는) 없는 아이콘이에요 (icons.js 에 있는 이름만)`);
    const kinds = sec.blocks.map((b) => b.t);
    const texts = sec.blocks.filter((b) => TEXT.has(b.t));
    const visuals = sec.blocks.filter((b) => !TEXT.has(b.t));
    let chars = 0;
    for (const b of texts) {
      if (b.t === "list" || b.t === "steps") {
        if (!Array.isArray(b.items) || !b.items.length) { E(`${tag}: ${b.t} 의 items 가 비었어요`); continue; }
        if (b.items.length > (b.t === "steps" ? 5 : 6)) W(`${tag}: ${b.t} 항목이 너무 많아요 (${b.items.length}개)`);
        b.items.forEach((t) => { checkText(t, tag); chars += String(t).length; });
      } else { checkText(b.text, tag); chars += String(b.text || "").length; if (typeof b.text !== "string") E(`${tag}: ${b.t} 의 text 없음`); }
    }
    if (chars > 700) E(`${tag}: 글이 너무 길어요 (${chars}자, 화면 한 장에 안 들어가요. 700자 이내)`);
    else if (chars > 520) W(`${tag}: 글이 좀 길어요 (${chars}자, 520자 이내 권장)`);
    if (texts.length > 4) W(`${tag}: 글 블록이 ${texts.length}개 — 4개 이내 권장`);
    const isQuiz = h.kicker === "QUIZ", isSummary = h.kicker === "SUMMARY";
    if (isQuiz) {
      quizSections++;
      const qs = sec.blocks.filter((b) => b.t === "quiz");
      if (qs.length < 3 || qs.length > 4) E(`${tag}: 퀴즈는 3~4문제 (지금 ${qs.length})`);
    }
    if (isSummary) { summarySections++; if (!kinds.includes("list")) E(`${tag}: 정리 화면에는 list 가 필요해요`); }
    if (!isQuiz && !isSummary && !visuals.length) W(`${tag}: 그림/표/코드 같은 시각 자료가 없어요`);
    if (visuals.filter((b) => b.t === "editor").length > 1) E(`${tag}: 한 화면에 편집기는 하나만`);
    if (visuals.filter((b) => b.t === "code").length > 2) W(`${tag}: 코드 블록이 3개 이상`);
    if (visuals.length > 3 && !isQuiz) W(`${tag}: 시각 자료가 ${visuals.length}개 — 3개 이내 권장`);
    if (texts.length === 0 && visuals.length && !isQuiz && !isSummary && !h.wide) W(`${tag}: 설명 글이 하나도 없어요`);

    for (const b of sec.blocks) {
      if (b.t === "quiz") {
        if (!b.q) E(`${tag}: quiz 에 q 없음`);
        if (!Array.isArray(b.options) || b.options.length < 3 || b.options.length > 4) E(`${tag}: quiz options 는 3~4개`);
        else if (!Number.isInteger(b.answer) || b.answer < 0 || b.answer >= b.options.length) E(`${tag}: quiz answer 번호가 범위 밖`);
        if (!b.explain) E(`${tag}: quiz 에 explain(해설) 없음`);
        checkText(b.q, tag); checkText(b.explain, tag); (b.options || []).forEach((o) => checkText(o, tag));
      }
      if (b.t === "table") {
        if (!Array.isArray(b.head) || !Array.isArray(b.rows) || !b.rows.length) E(`${tag}: table 에 head/rows 필요`);
        else { if (b.rows.length > 9) W(`${tag}: 표 행이 ${b.rows.length}개 (9개 이내 권장)`); b.rows.forEach((r) => { if (r.length !== b.head.length) E(`${tag}: 표의 칸 수가 head 와 달라요`); r.forEach((c) => checkText(c, tag)); }); }
      }
      if (b.t === "cards") { if (!Array.isArray(b.items) || b.items.some((c) => !c.icon || !iconNames.has(c.icon) || !c.title)) E(`${tag}: cards 의 icon(없는 이름)/title 확인`); if (b.items && b.items.length > 6) W(`${tag}: 카드 ${b.items.length}개 — 6개 이내`); }
      if (b.t === "tree" && (!Array.isArray(b.items) || b.items.some((x) => typeof x.depth !== "number" || !x.name))) E(`${tag}: tree 의 depth/name 확인`);
      if (b.t === "anat" && (!Array.isArray(b.parts) || b.parts.some((x) => !x.code || !x.label))) E(`${tag}: anat 의 parts(code,label) 확인`);
      if (b.t === "boxes" && (!Array.isArray(b.items) || b.items.some((x) => x.name === undefined || x.value === undefined))) E(`${tag}: boxes 의 items(name,value) 확인`);
      if (b.t === "flow" && (!Array.isArray(b.items) || b.items.length < 2)) E(`${tag}: flow 의 items 는 2개 이상`);
      if (b.t === "img" && (!b.src || !existsSync(join(STATIC, b.src.replace(/^\//, ""))))) E(`${tag}: 이미지 파일이 없어요: ${b.src}`);
      if (b.t === "code") {
        if (typeof b.text !== "string") E(`${tag}: code 에 text 없음`);
        else if (b.py) {
          if (b.out === undefined) W(`${tag}: py:true 코드인데 out(실행 결과)이 없어요`);
          snippets.push({ id: `${n}|${tag}|code`, kind: "code", code: b.text, stdin: b.stdin || "", expect: b.out });
        } else if (b.out !== undefined && /\.py$|^python$/i.test(b.file || "")) W(`${tag}: 파이썬 코드인 것 같은데 py:true 가 없어요 (실제 결과 검사를 받으려면 py:true)`);
      }
      if (b.t === "editor") {
        editorCount++;
        if (typeof b.code !== "string" || !b.code.trim()) E(`${tag}: editor 에 code(시작 코드) 필요`);
        if (b.expect !== undefined && !b.solution) E(`${tag}: expect 가 있으면 solution(정답 코드)도 필요해요`);
        if (b.task) checkText(b.task, tag); if (b.hint) checkText(b.hint, tag);
        if (/\binput\s*\(/.test((b.code || "") + (b.solution || "")) && b.stdin === undefined) W(`${tag}: input() 을 쓰는데 stdin(기본 입력값)이 없어요`);
        if (b.solution) snippets.push({ id: `${n}|${tag}|editor-solution`, kind: "editor", code: b.solution, stdin: b.stdin || "", expect: b.expect });
        snippets.push({ id: `${n}|${tag}|editor-starter`, kind: "starter", code: b.code, stdin: b.stdin || "", expect: undefined });
      }
    }
  });
  if (quizSections !== 1) E(`QUIZ 화면(kicker:"QUIZ")이 정확히 1개 있어야 해요 (지금 ${quizSections})`);
  if (summarySections !== 1) E(`SUMMARY 화면(kicker:"SUMMARY")이 정확히 1개 있어야 해요 (지금 ${summarySections})`);
  if (PY_LESSON(n) && editorCount < 4) E(`파이썬 과정은 편집기(editor)가 4개 이상 필요해요 (지금 ${editorCount})`);
  if (refs) {
    if (!Array.isArray(refs.items) || !refs.items.length) E("refs 의 items 가 비었어요");
    else refs.items.forEach((r) => { if (!r.title || !r.desc || !allowedLinks.has(decodeURI(r.url || ""))) E(`refs 주소가 허용 목록(tools/allowed-links.json)에 없어요: ${r.url}`); });
  } else W("refs(참고자료)가 없어요");
  console.log(`  화면 ${hCount}개, 편집기 ${editorCount}개, 시간 ${lesson.minutes}분`);
}

// ---------- 코드 실제 실행 ----------
if (snippets.length) {
  const tmp = mkdtempSync(join(tmpdir(), "lessoncheck-"));
  const inFile = join(tmp, "snippets.json");
  writeFileSync(inFile, JSON.stringify(snippets));
  const r = spawnSync("python", ["-X", "utf8", join(ROOT, "tools", "run_snippets.py"), inFile], { encoding: "utf-8", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  process.stdout.write("\n" + (r.stdout || ""));
  if (r.stderr) process.stdout.write(r.stderr);
  const bad = (r.stdout || "").split("\n").filter((l) => l.startsWith("  ✘")).length;
  errors += bad;
}
console.log(`\n결과: 오류 ${errors}개, 경고 ${warnings}개 ${errors ? "→ 오류를 고쳐 주세요" : "→ 통과"}`);
process.exit(errors ? 1 : 0);
