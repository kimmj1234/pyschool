const $ = (s) => document.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  kids.forEach((k) => n.append(k));
  return n;
};

const LESSONS = [
  // ── 컴퓨터 기초 (1~6)
  ["PC 이해하기", "컴퓨터의 3가지 핵심 부품, 파일·폴더·경로, 터미널 기본 명령까지 코딩 전에 꼭 필요한 기본기를 익혀요."],
  ["개발 도구와 단축키", "VS Code를 설치하고 화면을 읽는 법, 작업 속도를 확 높여 주는 꼭 필요한 단축키를 배워요."],
  ["운영체제 이해하기", "Windows, macOS, Linux는 무엇이 다르고 무엇이 같을까요? 운영체제가 하는 일을 알아봐요."],
  ["인터넷과 웹의 원리", "브라우저와 서버, 주소(URL)는 어떻게 주고받으며 동작하는지 그림으로 알아봐요."],
  ["파일 형식과 압축", "확장자의 의미, 압축 파일, 안전하게 내려받고 여는 방법을 알아봐요."],
  ["백업과 보안 기초", "소중한 코드와 계정을 지키는 습관: 비밀번호, 백업, 의심스러운 파일 다루기."],
  // ── 파이썬 (7~18)
  ["파이썬 소개와 설치", "파이썬이 무엇이고 어디에 쓰이는지 알아보고, 설치해서 첫 코드를 실행해요."],
  ["print()와 첫 프로그램", "화면에 글자를 출력하고, 문자열과 주석, 이스케이프 문자를 익혀요."],
  ["변수와 자료형", "값에 이름표를 붙이는 변수, 숫자·문자열·참/거짓 자료형을 배워요."],
  ["연산자", "계산하고, 비교하고, 참과 거짓을 조합하는 연산자를 배워요."],
  ["입력받기 input()", "사용자가 입력한 값을 받아 대화하는 프로그램을 만들어요."],
  ["조건문 if", "상황에 따라 다르게 행동하는 if / elif / else를 배워요."],
  ["반복문 for / while", "같은 일을 자동으로 반복하는 for와 while, break와 continue를 배워요."],
  ["리스트와 튜플", "여러 값을 한 번에 담고 꺼내는 리스트와 튜플을 배워요."],
  ["딕셔너리와 집합", "이름표(키)로 값을 찾는 딕셔너리, 중복 없는 집합을 배워요."],
  ["함수", "코드를 묶어 이름을 붙이고 재사용하는 함수를 배워요."],
  ["파일 읽고 쓰기", "데이터를 파일에 저장하고 다시 불러오는 방법을 배워요."],
  ["오류와 예외 처리", "에러 메시지를 읽는 법과 try / except로 에러에 대처하는 법을 배워요."],
];

/* 과정 묶음: 목록 페이지와 "다음 과정" 이동에 쓰임. 번호는 추천 학습 순서와 같음 */
const TRACKS = {
  basics: { title: "컴퓨터 기초", page: "/basics.html", from: 1, to: 6 },
  python: { title: "파이썬", page: "/python.html", from: 7, to: 18 },
};
const trackOf = (n) => Object.values(TRACKS).find((t) => n >= t.from && n <= t.to) || null;

/* 과정이 "열려 있는지"(내용이 만들어졌는지)와 시간·화면 수.
   1·2·7번은 lessons.js 에, 나머지는 lessons/NN.js 에 있고, lessons/meta.js(자동 생성)가 목록 페이지용 요약을 가짐 */
function lessonInfo(n) {
  const c = typeof LESSON_CONTENT !== "undefined" && LESSON_CONTENT[n];
  if (c) return { minutes: c.minutes, screens: c.blocks.filter((x) => x.t === "h").length };
  const m = typeof LESSON_META !== "undefined" && LESSON_META[n];
  return m || null;
}
const lessonOpen = (n) => !!lessonInfo(n);

let me = null;
let pendingNext = null; // 로그인에 성공하면 이동할 곳 (로그인이 필요한 링크를 눌렀을 때)
const NEXT_OK = /^\/(basics\.html|python\.html|community\.html|lesson\.html\?n=\d{1,2})$/; // 이동 허용 주소 (엉뚱한 주소로 보내지 못하게)
let category = "";
let categories = {};
let authMode = "login";

async function api(path, method = "GET", body) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "요청에 실패했어요.");
  return data;
}

/* ---------- roadmap ---------- */
function renderRoadmap() {
  const grid = $("#roadmap-grid");
  if (!grid) return;
  grid.replaceChildren();
  let done = [];
  try { done = JSON.parse(localStorage.getItem("done") || "[]"); } catch {}
  LESSONS.forEach(([title, desc], i) => {
    const open = lessonOpen(i + 1);
    const isDone = done.includes(i + 1);
    const card = el(open ? "a" : "article", { className: "lesson" + (open ? " open" : "") },
      el("span", { className: "no", textContent: i + 1 }),
      el("span", { className: open ? "tag" + (isDone ? " done" : "") : "tag soon", textContent: open ? (isDone ? "완료 ✓" : "학습하기") : "예정" }),
      el("h3", { textContent: title }),
      el("p", { textContent: desc }));
    if (open) card.href = `/lesson.html?n=${i + 1}`;
    grid.append(card);
  });
}

/* ---------- progress: 완료 기록은 localStorage 와 (로그인 시) 서버에 함께 저장 ---------- */
const localDone = () => { try { return JSON.parse(localStorage.getItem("done") || "[]"); } catch { return []; } };
const saveLocalDone = (v) => { try { localStorage.setItem("done", JSON.stringify(v)); } catch {} };

// 서버 기록과 합침: 로그인/가입 직후에 이 기기의 기록을 올리고, 서버 쪽 기록을 받아 둠
async function syncProgress() {
  if (!me) return;
  try {
    const d = await api("/api/progress", "POST", { add: localDone() });
    saveLocalDone(d.me);
  } catch {}
  dispatchEvent(new Event("progress"));
}
// 완료/취소 한 번을 서버에 반영 (비로그인이면 localStorage 만)
function pushProgress(n, done) {
  if (!me) return;
  api("/api/progress", "POST", done ? { add: [n] } : { remove: [n] }).catch(() => {});
}

/* ---------- auth ---------- */
function renderAuth() {
  const box = $("#auth-area");
  box.replaceChildren();
  if (me) {
    const hello = el("span", { className: "hello" });
    hello.append(el("b", { textContent: me.nickname }), "님");
    const out = el("button", { className: "btn ghost", textContent: "로그아웃" });
    out.onclick = async () => { await api("/api/logout", "POST"); me = null; saveLocalDone([]); if (["/basics.html", "/python.html", "/lesson.html", "/community.html"].includes(location.pathname)) { location.href = "/"; return; } renderAuth(); renderRoadmap(); loadPosts(); dispatchEvent(new Event("progress")); };
    box.append(hello, out);
  } else {
    const li = el("button", { className: "btn primary", textContent: "로그인" });
    li.onclick = () => openAuth("login");
    box.append(li);
  }
}

/* ---------- 비밀번호 조건 (회원가입): 8자 이상, 대문자 1개 이상, 특수문자 1개 이상. 서버(server.py)와 같은 기준 ---------- */
const pwChecks = (v) => ({ len: v.length >= 8, upper: /[A-Z]/.test(v), special: /[!-\/:-@\[-`{-~]/.test(v) });
const pwMessage = (c) => !c.len ? "비밀번호는 8자 이상이어야 해요." : !c.upper ? "비밀번호에 대문자를 1개 이상 넣어주세요." : !c.special ? "비밀번호에 특수문자(! @ # $ 등)를 1개 이상 넣어주세요." : "";
function updatePwRules() {
  const c = pwChecks($("#auth-form").password.value);
  document.querySelectorAll("#pw-rules li").forEach((li) => li.classList.toggle("ok", c[li.dataset.r]));
}
$("#auth-form").password.addEventListener("input", updatePwRules);

let authSwapTimer = 0;
function paintAuth(mode) {
  const signup = mode === "signup";
  $("#auth-title").textContent = signup ? "회원가입" : "로그인";
  $("#auth-submit").textContent = signup ? "가입하기" : "로그인";
  $("#auth-switch-text").textContent = signup ? "이미 계정이 있나요?" : "아직 계정이 없나요?";
  $("#auth-switch").textContent = signup ? "로그인" : "회원가입";
  const pw = $("#auth-form").password;
  pw.autocomplete = signup ? "new-password" : "current-password";
  pw.placeholder = signup ? "8자 이상, 대문자·특수문자 포함" : "비밀번호";
  if (signup) pw.minLength = 8; else pw.removeAttribute("minlength"); // 로그인은 예전 비밀번호도 받아야 하므로 조건 없음
  updatePwRules();
  $("#auth-err").classList.remove("info");
  $("#auth-err").textContent = "";
  $("#auth-form").classList.toggle("is-signup", signup); // 가입 안내글은 회원가입 화면에서만 펼쳐짐
}

function openAuth(mode) {
  const dialog = $("#auth-dialog"), form = $("#auth-form");
  clearTimeout(authSwapTimer);
  authMode = mode;
  // 이미 열려 있는 창에서 로그인 ↔ 회원가입을 바꿀 때는 글이 살짝 사라졌다가 새 글이 부드럽게 나타남
  const swapping = dialog.open && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (swapping) {
    form.classList.add("swapping");
    authSwapTimer = setTimeout(() => { paintAuth(mode); form.classList.remove("swapping"); }, 170);
  } else {
    form.classList.remove("swapping");
    paintAuth(mode);
    if (!dialog.open) dialog.showModal();
  }
}

$("#auth-switch").onclick = (e) => { e.preventDefault(); openAuth(authMode === "login" ? "signup" : "login"); };

$("#auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  $("#auth-err").classList.remove("info");
  if (authMode === "signup") {
    const msg = pwMessage(pwChecks(f.password.value));
    if (msg) { $("#auth-err").textContent = msg; return; }
  }
  try {
    const data = await api(authMode === "signup" ? "/api/signup" : "/api/login", "POST",
      { nickname: f.nickname.value, password: f.password.value });
    me = data.user;
    const next = pendingNext; pendingNext = null; // 창이 닫히면서 값이 지워지기 전에 챙겨 둠
    f.reset();
    $("#auth-dialog").close();
    renderAuth();
    loadPosts();
    await syncProgress();
    renderRoadmap();
    if (next) location.href = next;
  } catch (err) {
    $("#auth-err").classList.remove("info");
    $("#auth-err").textContent = err.message;
  }
});

$("#auth-dialog").addEventListener("close", () => { pendingNext = null; });
document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => b.closest("dialog").close()));

/* ---------- community ---------- */
function fmtDate(sec) {
  const d = new Date(sec * 1000);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function renderTabs() {
  const tabs = $("#tabs");
  tabs.replaceChildren();
  Object.entries({ "": "전체", ...categories }).forEach(([key, label]) => {
    const t = el("button", { className: "tab", textContent: label });
    t.setAttribute("aria-selected", String(key === category));
    t.onclick = () => { category = key; renderTabs(); loadPosts(); };
    tabs.append(t);
  });
}

async function loadPosts() {
  if (!$("#board")) return;
  const data = await api("/api/posts" + (category ? `?category=${category}` : ""));
  if (!Object.keys(categories).length) {
    categories = data.categories;
    renderTabs();
    const sel = $("#post-cat");
    Object.entries(categories).forEach(([k, v]) => sel.append(el("option", { value: k, textContent: v })));
  }
  const board = $("#board");
  board.replaceChildren();
  if (!data.posts.length) {
    board.append(el("p", { className: "empty", textContent: "아직 글이 없어요. 첫 글을 남겨보세요!" }));
    return;
  }
  data.posts.forEach((p) => {
    const card = el("article", { className: "post" },
      el("div", { className: "post-top" },
        el("span", { className: `badge ${p.category}`, textContent: categories[p.category] }),
        el("h4", { textContent: p.title })),
      el("p", { className: "body", textContent: p.body }));
    const meta = el("div", { className: "meta" }, el("span", { textContent: p.nickname }), el("span", { textContent: fmtDate(p.created) }));
    if (me && me.nickname === p.nickname) {
      const del = el("button", { className: "del", textContent: "삭제" });
      del.onclick = async () => { if (confirm("이 글을 삭제할까요?")) { await api(`/api/posts/${p.id}`, "DELETE"); loadPosts(); } };
      meta.append(del);
    }
    card.append(meta);
    board.append(card);
  });
}

if ($("#write-btn")) $("#write-btn").onclick = () => {
  if (!me) return openAuth("login");
  $("#post-err").textContent = "";
  $("#post-dialog").showModal();
};

if ($("#post-form")) $("#post-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  try {
    await api("/api/posts", "POST", { category: f.category.value, title: f.title.value, body: f.body.value });
    f.title.value = f.body.value = "";
    $("#post-dialog").close();
    loadPosts();
  } catch (err) {
    $("#post-err").textContent = err.message;
  }
});

/* ---------- init ---------- */
renderRoadmap();
const meReady = api("/api/me").then(async (d) => {
  me = d.user; renderAuth(); loadPosts(); await syncProgress(); renderRoadmap();
  // 로그인 없이 주소로 바로 들어오려다 홈으로 넘어온 경우(?next=...): 로그인하면 그 페이지로 보내 줌
  const next = new URLSearchParams(location.search).get("next");
  if (next && NEXT_OK.test(next)) {
    if (me) { location.replace(next); return; }
    pendingNext = next;
    openAuth("login");
    authNotice("이 페이지는 로그인 후에 이용할 수 있어요.");
    history.replaceState(null, "", location.pathname);
  }
});

/* ---------- 로그인이 필요한 링크 (data-auth="이름") ----------
   로그인 전이면 이동하지 않고 로그인 창을 띄우고, 로그인에 성공하면 그 링크로 이동. 로그인 후에는 그대로 이동. */
function authNotice(text) {
  const e = $("#auth-err");
  e.textContent = text;
  e.classList.add("info");
}
document.addEventListener("click", async (e) => {
  const a = e.target.closest("a[data-auth]");
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // 새 탭 열기는 서버가 막아 줌
  e.preventDefault();
  await meReady;
  const href = a.getAttribute("href");
  if (me) { location.href = href; return; }
  pendingNext = href;
  openAuth("login");
  authNotice(`${a.dataset.auth} 이용은 로그인 후에 할 수 있어요.`);
});
