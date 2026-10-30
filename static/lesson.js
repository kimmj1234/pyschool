/* 과정 페이지 렌더러
   - lessons.js의 LESSON_CONTENT를 읽어서 "한 화면 = 한 가지 설명"으로 나눠 보여줍니다.
   - `h` 블록이 새 화면(섹션)의 시작이고, 다음 `h`가 나올 때까지의 블록이 그 화면의 내용입니다.
   - 글 계열(p, list, steps, tip...)은 왼쪽, 그림/표/코드는 오른쪽에 배치합니다. */
// 과정 내용은 1·2·7번은 lessons.js 에, 나머지는 lessons/NN.js 에 있어서 필요한 것만 불러옴
function loadLessonFile(n) {
  if (LESSON_CONTENT[n] || !lessonOpen(n)) return Promise.resolve();
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = `/lessons/${String(n).padStart(2, "0")}.js`;
    s.onload = s.onerror = () => resolve();
    document.head.append(s);
  });
}

(async function () {
  const root = document.getElementById("lesson");
  const n = parseInt(new URLSearchParams(location.search).get("n"), 10) || 1;
  await loadLessonFile(n);
  const info = LESSONS[n - 1];
  const content = LESSON_CONTENT[n];

  document.body.classList.add("lesson-page");
  if (!info || !content) {
    root.append(el("section", { className: "sec" }, el("div", { className: "sec-in end-in" },
      el("h1", { textContent: "아직 준비 중인 과정이에요" }),
      el("p", { className: "lead", textContent: "곧 열릴 예정입니다. 조금만 기다려 주세요!" }),
      el("a", { className: "btn primary lg", href: "/", textContent: "홈으로 돌아가기" }))));
    return;
  }
  document.documentElement.classList.add("snap");
  document.title = `${n}. ${info[0]} - 파이스쿨`;

  /* ---------- 글 안의 서식: **굵게**, ==형광펜==, `코드`, {{Ctrl+S}} ---------- */
  function inline(text) {
    const frag = document.createDocumentFragment();
    text.split(/(\*\*[^*]+\*\*|==[^=]+==|`[^`]+`|\{\{[^}]+\}\})/).forEach((part) => {
      if (!part) return;
      if (part.startsWith("==")) frag.append(el("mark", { textContent: part.slice(2, -2) }));
      else if (part.startsWith("{{")) {
        const keys = el("span", { className: "keys" });
        part.slice(2, -2).split("+").forEach((k, i) => {
          if (i) keys.append("+");
          keys.append(el("kbd", { textContent: k.trim() }));
        });
        frag.append(keys);
      } else if (part.startsWith("**")) frag.append(el("strong", { textContent: part.slice(2, -2) }));
      else if (part.startsWith("`")) frag.append(el("code", { textContent: part.slice(1, -1) }));
      else frag.append(part);
    });
    return frag;
  }
  const withInline = (tag, props, text) => { const e = el(tag, props); e.append(inline(text)); return e; };

  /* ---------- 블록별 렌더러 ---------- */
  function codeBlock(b) {
    const copy = el("button", { className: "copy", textContent: "복사", type: "button" });
    const pre = el("pre", {}, el("code", { textContent: b.text }));
    copy.onclick = async () => {
      try { await navigator.clipboard.writeText(b.text); copy.textContent = "복사됨 ✓"; }
      catch { copy.textContent = "복사 실패"; }
      setTimeout(() => (copy.textContent = "복사"), 1500);
    };
    const fig = el("figure", { className: "codeblock" },
      el("div", { className: "code-bar" }, el("span", { textContent: b.file || "" }), copy), pre);
    if (b.out) fig.append(el("div", { className: "out" }, el("b", {}, icon("play", "sm"), " 실행 결과"), el("pre", { textContent: b.out })));
    return fig;
  }

  function note(kind, iconName, label, text) {
    const body = el("div", { className: "note-body" });
    body.append(el("b", { className: "note-label", textContent: label }), inline(text));
    return el("aside", { className: "note " + kind }, icon(iconName, "note-ic"), body);
  }

  function anat(b) {
    const row = el("div", { className: "anat" });
    b.parts.forEach((p) => row.append(
      el("div", { className: "part" + (p.hl ? " hl" : "") },
        el("code", { textContent: p.code }), el("span", { className: "bar" }),
        el("b", { textContent: p.label }), el("small", { textContent: p.sub || "" }))));
    return row;
  }

  function cards(b) {
    const g = el("div", { className: "cards" });
    b.items.forEach((c) => g.append(el("div", { className: "card" },
      el("span", { className: "ico" }, icon(c.icon)), el("b", { textContent: c.title }), el("small", { textContent: c.desc }))));
    return g;
  }

  function refs(b) {
    const box = el("div", { className: "refs" }, el("h3", {}, icon("library"), " 더 알아보기 · 참고자료"));
    b.items.forEach((r) => box.append(el("a", { href: r.url, target: "_blank", rel: "noopener noreferrer" },
      el("b", { textContent: r.title + " ↗" }), el("small", { textContent: r.desc }))));
    return box;
  }

  const render = {
    h3: (b) => el("h3", { className: "sub-h", textContent: b.text }),
    p: (b) => withInline("p", {}, b.text),
    list: (b) => { const u = el("ul"); b.items.forEach((t) => u.append(withInline("li", {}, t))); return u; },
    steps: (b) => { const o = el("ol", { className: "steps" }); b.items.forEach((t) => o.append(withInline("li", {}, t))); return o; },
    key: (b) => note("key", "circle-check", "핵심", b.text),
    tip: (b) => note("tip", "lightbulb", "TIP", b.text),
    warn: (b) => note("warn", "triangle-alert", "주의", b.text),
    code: codeBlock,
    compare: (b) => el("div", { className: "compare" }, codeBlock(b.left), codeBlock(b.right)),
    cards, anat,
    table: (b) => {
      const t = el("table", { className: "tbl" + (b.rows.length > 6 ? " dense" : "") });
      const head = el("tr");
      b.head.forEach((h) => head.append(el("th", { textContent: h })));
      t.append(el("thead", {}, head));
      const body = el("tbody");
      b.rows.forEach((r) => { const tr = el("tr"); r.forEach((c) => tr.append(withInline("td", {}, c))); body.append(tr); });
      t.append(body);
      return el("div", { className: "tbl-wrap" }, t);
    },
    tree: (b) => {
      const ul = el("ul", { className: "tree" });
      b.items.forEach((t) => ul.append(el("li", { className: t.hl ? "hl" : "", style: `padding-left:${t.depth * 24}px` },
        icon(t.type === "file" ? "file-code" : t.depth ? "folder" : "hard-drive", t.type === "file" ? "file" : "folder"),
        el("span", { className: "nm", textContent: t.name }),
        t.note ? el("small", { textContent: t.note }) : "")));
      return ul;
    },
    // 그림은 lessons.js에 직접 작성한 SVG라서 innerHTML로 넣어도 안전함
    fig: (b) => { const f = el("figure", { className: "fig" }); f.innerHTML = b.svg; f.append(el("figcaption", { textContent: b.cap || "" })); return f; },

    // 파이썬 편집기(직접 코딩): editor.js
    editor: (b) => makeEditor(b, { inline }),

    // 변수·리스트 같은 "값을 담는 상자" 그림: { t: "boxes", items: [{ name: "age", value: "25", type: "int" }, ...] }
    //   items 에 type 이 없으면 이름과 값만 보여줌. cap 은 아래 설명(선택)
    boxes: (b) => {
      const row = el("div", { className: "boxes" });
      b.items.forEach((it) => row.append(el("div", { className: "bx" },
        el("span", { className: "bx-name", textContent: it.name }),
        el("span", { className: "bx-val", textContent: it.value }),
        it.type ? el("span", { className: "bx-type", textContent: it.type }) : "")));
      return b.cap ? el("figure", { className: "boxes-fig" }, row, el("figcaption", { textContent: b.cap })) : row;
    },

    // 순서 그림: { t: "flow", items: ["시작", { t: "조건이 참?", k: "ask" }, "실행", "끝"] }  (k: "ask" 는 판단 칸)
    flow: (b) => {
      const row = el("ol", { className: "flow" });
      b.items.forEach((it, i) => {
        const o = typeof it === "string" ? { t: it } : it;
        const li = el("li", { className: "fl" + (o.k ? " " + o.k : "") });
        li.append(withInline("span", { className: "fl-txt" }, o.t));
        if (o.sub) li.append(el("small", { textContent: o.sub }));
        row.append(li);
        if (i < b.items.length - 1) row.append(el("li", { className: "fl-ar", "aria-hidden": "true" }, icon("arrow-right")));
      });
      return row;
    },

    // 실제 화면 캡처/사진: { t: "img", src: "/media/파일이름.png", alt: "설명", cap: "캡션", marks: [...] }  (누르면 크게 보임)
    //  marks: 사진 위에 얹는 강조 상자. 값은 사진 크기 대비 % — { x, y, w, h, n: 1 }  (n 대신 no: true 면 "누르면 안 되는 곳" ✕ 표시)
    img: (b) => {
      const fig = el("figure", { className: "shot" });
      const btn = el("button", { type: "button", className: "shot-btn", "aria-label": `${b.alt || b.cap || "이미지"} 크게 보기` });
      const stage = el("span", { className: "shot-stage" });
      const im = el("img", { src: b.src, alt: b.alt || b.cap || "", loading: "lazy", decoding: "async" });
      im.onerror = () => fig.replaceChildren(el("p", { className: "shot-missing", textContent: "이미지를 불러오지 못했어요." }));
      stage.append(im);
      (b.marks || []).forEach((m) => {
        const box = el("span", { className: "shot-mark" + (m.no ? " no" : ""), "aria-hidden": "true" },
          el("i", { className: "shot-badge", textContent: m.no ? "✕" : String(m.n || "") }));
        box.style.cssText = `left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%`;
        stage.append(box);
      });
      btn.append(stage);
      btn.onclick = () => openLightbox(stage, b.alt || b.cap || "");
      fig.append(btn);
      if (b.cap) fig.append(el("figcaption", { textContent: b.cap }));
      return fig;
    },

    // 영상: 내 파일 { t: "video", src: "/media/파일이름.mp4", poster?: "...", cap } 또는 유튜브 { t: "video", youtube: "영상ID(11자)", cap }
    video: (b) => {
      const fig = el("figure", { className: "vid" });
      const frame = el("div", { className: "vid-frame" });
      if (b.youtube) {
        if (!/^[\w-]{11}$/.test(b.youtube)) return el("p", { className: "shot-missing", textContent: "영상 주소가 올바르지 않아요." });
        const f = el("iframe", { src: `https://www.youtube-nocookie.com/embed/${b.youtube}`, title: b.cap || "영상", loading: "lazy", allowFullscreen: true, referrerPolicy: "strict-origin-when-cross-origin" });
        f.setAttribute("allow", "encrypted-media; picture-in-picture");
        frame.append(f);
      } else {
        const v = el("video", { controls: true, preload: "metadata", playsInline: true });
        v.src = b.src;
        if (b.poster) v.poster = b.poster;
        v.setAttribute("aria-label", b.cap || "영상");
        frame.append(v);
      }
      fig.append(frame);
      if (b.cap) fig.append(el("figcaption", { textContent: b.cap }));
      return fig;
    },
  };

  // 이미지를 누르면 화면 가득 크게 (작은 글씨가 있는 캡처를 읽기 쉽게). 바깥을 누르거나 Esc 로 닫힘
  let lightbox = null;
  function openLightbox(stage, alt) {
    if (!lightbox) {
      lightbox = el("dialog", { className: "lightbox" });
      const close = el("button", { type: "button", className: "x", "aria-label": "닫기", textContent: "✕" });
      close.onclick = () => lightbox.close();
      lightbox.addEventListener("click", (e) => { if (!e.target.closest(".shot-stage")) lightbox.close(); });
      lightbox.append(close);
      document.body.append(lightbox);
    }
    lightbox.querySelector(".shot-stage")?.remove();
    const big = stage.cloneNode(true);       // 사진 + 강조 상자를 그대로 복제
    big.querySelector("img").alt = alt;
    lightbox.prepend(big);
    lightbox.showModal();
  }

  /* 퀴즈: 한 번에 한 문제씩, 마지막에 점수 */
  function quizSet(list) {
    let i = 0, score = 0;
    const head = el("div", { className: "qs-head" });
    const body = el("div", { className: "qs-body" });
    const box = el("div", { className: "quizset" }, head, body);

    function paintHead() {
      head.replaceChildren(el("b", { textContent: i < list.length ? `문제 ${i + 1} / ${list.length}` : "결과" }));
      const bars = el("div", { className: "qs-bars" });
      list.forEach((_, k) => bars.append(el("span", { className: k < i ? "on" : k === i ? "now" : "" })));
      head.append(bars);
    }
    function show() {
      paintHead();
      body.replaceChildren();
      if (i >= list.length) {
        const all = score === list.length;
        const retry = el("button", { className: "btn ghost", type: "button" }, icon("rotate-ccw"), " 다시 풀기");
        retry.onclick = () => { i = 0; score = 0; show(); };
        body.append(
          el("div", { className: "qs-score" }, el("span", { className: "big-n", textContent: `${score}` }), ` / ${list.length}`),
          el("p", { className: "qs-msg", textContent: all ? "완벽해요! 모두 맞혔어요. 다음으로 넘어가도 좋아요." : "괜찮아요! 해설을 다시 읽고 한 번 더 풀어보세요." }),
          retry);
        return;
      }
      const b = list[i];
      const result = el("p", { className: "result" });
      const next = el("button", { className: "btn primary", type: "button", hidden: true },
        i + 1 < list.length ? "다음 문제 " : "결과 보기 ", icon("arrow-right"));
      next.onclick = () => { i++; show(); };
      const opts = b.options.map((text, k) => {
        const o = el("button", { className: "opt", type: "button" }, el("span", { className: "no", textContent: k + 1 }));
        o.append(inline(text));
        o.onclick = () => {
          opts.forEach((x) => (x.disabled = true));
          const ok = k === b.answer;
          if (ok) score++;
          o.classList.add(ok ? "right" : "wrong");
          if (!ok) opts[b.answer].classList.add("right");
          result.replaceChildren(el("b", { textContent: ok ? "정답! " : "아쉬워요. " }), inline(b.explain));
          result.className = "result " + (ok ? "ok" : "no");
          next.hidden = false;
        };
        return o;
      });
      body.append(withInline("p", { className: "q" }, b.q), ...opts, result, next);
    }
    show();
    return box;
  }

  /* ---------- 화면(섹션) 나누기 ---------- */
  const TEXT = new Set(["p", "list", "steps", "key", "tip", "warn", "h3"]);
  const defs = [];
  let cur = null;
  let refsBlock = null;
  content.blocks.forEach((b) => {
    if (b.t === "refs") { refsBlock = b; return; }
    if (b.t === "h") { cur = { h: b, blocks: [] }; defs.push(cur); return; }
    if (cur) cur.blocks.push(b);
  });

  const els = []; // 모든 화면 (소개 + 본문 + 마무리)
  const goNext = (from) => { const i = els.indexOf(from); if (els[i + 1]) goToArea(els[i + 1]); };
  function hint(label) {
    const b = el("button", { className: "hint", type: "button" }, el("span", { textContent: label || "다음" }), icon("chevron-down"));
    b.onclick = () => goNext(b.closest(".sec"));
    return b;
  }
  const kicker = (iconName, text) => el("span", { className: "kicker" }, el("span", { className: "ib" }, icon(iconName)), text);

  // 소개 화면
  const goals = el("div", { className: "goal-cards" });
  content.goals.forEach((g) => goals.append(el("div", { className: "goal" }, icon("circle-check"), withInline("span", {}, g))));
  const startBtn = el("button", { className: "btn primary lg", type: "button" }, "시작하기 ", icon("chevron-down"));
  startBtn.onclick = () => goNext(startBtn.closest(".sec"));
  els.push(el("section", { className: "sec hero-sec" },
    el("div", { className: "sec-in hero-in" },
      kicker("clock", `과정 ${n} · 약 ${content.minutes}분`),
      el("h1", { textContent: info[0] }),
      withInline("p", { className: "hero-lead" }, content.intro),
      el("p", { className: "goal-title", textContent: "이번 과정에서 할 일" }),
      goals,
      startBtn,
      el("p", { className: "scroll-guide" }, icon("mouse"), " 스크롤하면 한 화면씩 넘어가요  ·  키보드 ", el("kbd", { textContent: "↓" }), " ", el("kbd", { textContent: "↑" }), " 도 쓸 수 있어요"))));

  // 본문 화면들
  defs.forEach((d, i) => {
    const h = d.h;
    // 편집기가 있는 화면은 오른쪽을 편집기가 통째로 쓰고, 예시 코드·표 같은 다른 시각 자료는 왼쪽 글 아래로 내려 보냄 (한 화면 높이를 넘지 않게)
    const hasEditor = d.blocks.some((b) => b.t === "editor");
    const texts = d.blocks.filter((b) => TEXT.has(b.t)).map((b) => render[b.t](b));
    const visuals = [];
    const quizzes = [];
    d.blocks.filter((b) => !TEXT.has(b.t)).forEach((b) => {
      if (b.t === "quiz") quizzes.push(b);
      else if (hasEditor && b.t !== "editor") { const node = render[b.t](b); node.dataset.movable = "1"; texts.push(node); }
      else visuals.push(render[b.t](b));
    });
    if (quizzes.length) visuals.push(quizSet(quizzes));

    const head = el("div", { className: "sec-head" },
      kicker(h.icon || "sparkles", h.kicker || `개념 ${i + 1}`),
      el("h2", { textContent: h.text }),
      h.sub ? el("p", { className: "sec-sub", textContent: h.sub }) : "");
    const layout = h.wide ? "wide" : visuals.length && texts.length ? "split" : "solo";
    const grid = el("div", { className: "sec-grid " + layout },
      el("div", { className: "col-text" }, head, ...texts),
      visuals.length ? el("div", { className: "col-vis" }, ...visuals) : "");
    const sec = el("section", { className: "sec", id: `s${i + 1}` }, el("div", { className: "sec-in" }, grid), hint());
    if (hasEditor) sec.dataset.hasEditor = "1";
    sec.dataset.no = String(i + 1).padStart(2, "0");
    sec.dataset.title = h.text;
    els.push(sec);
  });

  // 마무리 화면
  const done = localDone, setDone = saveLocalDone; // app.js
  const doneBtn = el("button", { className: "btn primary lg", type: "button" });
  const paintDone = () => {
    const d = done().includes(n);
    doneBtn.replaceChildren(icon(d ? "circle-check" : "bookmark-check"), d ? " 학습 완료됨 (눌러서 취소)" : " 이 과정 학습 완료!");
    doneBtn.classList.toggle("done", d);
  };
  doneBtn.onclick = () => { const d = done(), was = d.includes(n); setDone(was ? d.filter((x) => x !== n) : [...d, n]); pushProgress(n, !was); paintDone(); };
  paintDone();

  const hasNext = lessonOpen(n + 1);
  const track = trackOf(n);
  const nav = el("div", { className: "lesson-nav" },
    n > 1 && lessonOpen(n - 1) ? el("a", { className: "btn ghost", href: `/lesson.html?n=${n - 1}` }, icon("arrow-left"), " 이전 과정") : el("span"),
    track ? el("a", { className: "btn ghost", href: track.page }, icon("layout-grid"), ` ${track.title} 목록`) : el("span"),
    n < LESSONS.length
      ? el("a", { className: "btn ghost" + (hasNext ? "" : " disabled"), href: hasNext ? `/lesson.html?n=${n + 1}` : (track ? track.page : "/") },
          hasNext ? "다음 과정 " : "다음 과정 (준비 중) ", icon("arrow-right"))
      : el("span"));
  const endSec = el("section", { className: "sec end-sec", id: "end" },
    el("div", { className: "sec-in end-in" },
      el("span", { className: "end-ic" }, icon("trophy")),
      el("h2", { textContent: `과정 ${n} 끝! 수고했어요` }),
      el("p", { className: "sec-sub", textContent: "아래 버튼을 눌러 학습 완료로 표시해 두면 로드맵에서 확인할 수 있어요." }),
      doneBtn,
      refsBlock ? refs(refsBlock) : "",
      nav));
  endSec.dataset.no = "END";
  endSec.dataset.title = "마무리";
  els.push(endSec);
  root.append(...els);

  /* ---------- 편집기가 있는 화면: 왼쪽 글 칸과 오른쪽 편집기 칸의 높이를 맞춤 ----------
     예시 코드·표는 처음에 왼쪽 글 아래에 두었다가, 오른쪽이 더 짧으면 그쪽(편집기 아래)으로 옮겨서 화면 높이를 줄임 */
  function balanceEditorSections() {
    document.querySelectorAll(".sec[data-has-editor]").forEach((sec) => {
      const left = sec.querySelector(".col-text"), right = sec.querySelector(".col-vis");
      if (!left || !right || getComputedStyle(right).display === "none") return;
      const items = [...left.querySelectorAll(":scope > [data-movable]")].reverse(); // 아래쪽 것부터 옮겨 봄
      for (const node of items) {
        const hL = left.getBoundingClientRect().height, hR = right.getBoundingClientRect().height;
        if (hL <= hR) break;
        const h = node.getBoundingClientRect().height + 18;
        if (Math.max(hL - h, hR + h) < Math.max(hL, hR)) right.append(node);   // 옮기면 더 낮아질 때만
      }
    });
  }
  const rebalance = () => requestAnimationFrame(() => setTimeout(balanceEditorSections, 150));
  rebalance();
  if (document.fonts) document.fonts.ready.then(rebalance);
  window.addEventListener("load", () => setTimeout(balanceEditorSections, 600)); // 편집기(CodeMirror)가 자리를 잡은 뒤 한 번 더
  window.addEventListener("resize", balanceEditorSections);

  /* ---------- 진행 표시: 위쪽 막대 + 오른쪽 점 + 키보드 ---------- */
  const bar = el("div", { className: "progress" });
  const dots = el("nav", { className: "dots", "aria-label": "화면 이동" });
  const dotEls = els.map((s, i) => {
    const d = el("button", { type: "button", title: i === 0 ? "소개" : s.dataset.title, "aria-label": `${i + 1}번째 화면으로` });
    d.onclick = () => goToArea(s);
    dots.append(d);
    return d;
  });
  document.body.append(bar, dots);

  let active = 0;
  function setActive(i) {
    active = i;
    dotEls.forEach((d, k) => d.classList.toggle("on", k === i));
    bar.style.width = `${(i / (els.length - 1)) * 100}%`;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(els.indexOf(e.target)); });
  }, { rootMargin: "-50% 0px -49% 0px" });
  els.forEach((s) => io.observe(s));
  setActive(0);

  addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!["BODY", "HTML"].includes(e.target.tagName)) return;
    const to = { ArrowDown: active + 1, PageDown: active + 1, ArrowUp: active - 1, PageUp: active - 1, Home: 0, End: els.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    goToArea(els[Math.max(0, Math.min(els.length - 1, to))]);
  });
})();
