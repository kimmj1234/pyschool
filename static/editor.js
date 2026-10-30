/* 학습 화면 안의 파이썬 편집기("직접 해보기") 블록.
   lessons 안에서 이렇게 씁니다:
     { t: "editor", title: "직접 해보기", task: "문제 설명(선택)", code: "시작 코드",
       stdin: "input() 에 넣을 값, 한 줄에 하나(선택)", expect: "기대하는 출력(선택: 있으면 정답 확인)",
       solution: "정답 코드(선택: expect 와 함께 쓰면 자동 검사됨)", hint: "힌트(선택)" }
   - 코드는 이 브라우저 안(pyrunner.js → pyworker.js)에서만 실행돼요.
   - CodeMirror 를 못 불러오면(오프라인 등) 일반 입력칸으로 대신 보여줘요. */
(function () {
  const norm = (s) => String(s).split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "").replace(/^\n+/, "");

  window.makeEditor = function makeEditor(b, helpers = {}) {
    const inline = helpers.inline || ((t) => document.createTextNode(t));
    const starter = b.code || "";
    const usesInput = /\binput\s*\(/.test(starter + (b.solution || "")) || b.stdin !== undefined;

    /* ----- 위쪽 막대 ----- */
    const runBtn = el("button", { type: "button", className: "pyed-btn run" }, icon("play", "sm"), " 실행");
    const resetBtn = el("button", { type: "button", className: "pyed-btn" }, icon("rotate-ccw", "sm"), " 처음으로");
    const stopBtn = el("button", { type: "button", className: "pyed-btn stop", hidden: true }, icon("circle-x", "sm"), " 중지");
    const chip = el("span", { className: "pyed-chip", textContent: "" });
    const bar = el("div", { className: "pyed-bar" },
      el("span", { className: "pyed-title" }, icon("terminal"), " ", b.title || "직접 해보기"),
      chip,
      el("span", { className: "pyed-actions" }, resetBtn, stopBtn, runBtn));

    /* ----- 코드 편집 영역 ----- */
    const host = el("div", { className: "pyed-code" });
    host.setAttribute("aria-label", "파이썬 코드 편집기. Ctrl+Enter 로 실행, Esc 를 누르면 편집기에서 나가요.");
    let getCode, setCode, focusEditor;
    if (window.CodeMirror) {
      const run = () => runBtn.click();
      const cm = CodeMirror(host, {
        value: starter, mode: "python", theme: "pyschool", lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
        viewportMargin: Infinity, autoCloseBrackets: true, matchBrackets: true,
        extraKeys: {
          "Ctrl-Enter": run, "Cmd-Enter": run,
          Tab: (c) => (c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end")),
          "Shift-Tab": "indentLess",
          Esc: () => { cm.getInputField().blur(); runBtn.focus(); },
        },
      });
      getCode = () => cm.getValue(); setCode = (v) => cm.setValue(v); focusEditor = () => cm.focus();
      new IntersectionObserver((es) => { if (es[0].isIntersecting) cm.refresh(); }).observe(host); // 화면에 보일 때 크기 다시 계산
      setTimeout(() => cm.refresh(), 0);                                // 화면에 붙은 직후에도 한 번 (붙기 전에 만들어서 크기를 못 쟀을 수 있음)
      if (document.fonts) document.fonts.ready.then(() => cm.refresh()); // 글꼴이 바뀌면 줄 높이도 달라지므로
    } else {
      const ta = el("textarea", { className: "pyed-plain", value: starter, spellcheck: false, rows: Math.max(4, starter.split("\n").length + 1) });
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end"); }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runBtn.click(); }
        if (e.key === "Escape") runBtn.focus();
      });
      host.append(ta);
      getCode = () => ta.value; setCode = (v) => { ta.value = v; }; focusEditor = () => ta.focus();
    }

    /* ----- 입력값(input() 용), 출력 ----- */
    let stdinBox = null, stdinWrap = null;
    if (usesInput) {
      const stdinLines = String(b.stdin || "").split("\n").length;
      stdinBox = el("textarea", { className: "pyed-stdin-box", rows: Math.min(3, Math.max(1, stdinLines)), spellcheck: false, value: b.stdin || "", placeholder: "한 줄에 하나씩 적어요\n예) 홍길동\n20" });
      stdinWrap = el("details", { className: "pyed-stdin", open: true },
        el("summary", {}, icon("keyboard", "sm"), " 입력값 (input() 이 읽어 갈 값, 한 줄에 하나)"), stdinBox);
    }
    const outPre = el("pre", { className: "pyed-out-text", "aria-live": "polite" });
    const out = el("div", { className: "pyed-out" }, el("div", { className: "pyed-out-head" }, icon("play", "sm"), " 실행 결과"), outPre);
    const verdict = el("p", { className: "pyed-verdict", hidden: true, role: "status" });

    const fig = el("figure", { className: "pyed" }, bar);
    if (b.task) { const t = el("p", { className: "pyed-task" }); t.append(el("b", { textContent: "미션 " }), inline(b.task)); fig.append(t); }
    fig.append(host);
    if (stdinWrap) fig.append(stdinWrap);
    fig.append(out, verdict);
    // 힌트와 정답 예시는 한 줄짜리 접이식 하나로 합침 (편집기가 화면 한 장에 들어가도록)
    if (b.hint || b.solution) {
      const help = el("details", { className: "pyed-extra" },
        el("summary", {}, icon("lightbulb", "sm"), b.hint && b.solution ? " 힌트 · 정답 예시 보기" : b.hint ? " 힌트 보기" : " 정답 예시 보기"));
      if (b.hint) help.append(el("p", {}, el("b", { textContent: "힌트  " }), inline(b.hint)));
      if (b.solution) {
        const sol = el("pre", { className: "pyed-sol" }, el("code", { textContent: b.solution }));
        const use = el("button", { type: "button", className: "pyed-btn" }, icon("copy", "sm"), " 편집기에 넣기");
        use.onclick = () => { setCode(b.solution); focusEditor(); };
        help.append(el("p", {}, el("b", { textContent: "정답 예시" })), sol, use);
      }
      fig.append(help);
    }

    /* ----- 실행 ----- */
    let running = false;
    const setChip = (text, kind) => { chip.textContent = text; chip.className = "pyed-chip" + (kind ? " " + kind : ""); };
    PyRunner.onStatus((s) => { if (!running) setChip(s === "loading" ? "파이썬 준비 중…" : s === "error" ? "불러오기 실패" : "", s === "loading" ? "wait" : ""); });

    runBtn.onclick = async () => {
      if (running) return;
      running = true; runBtn.disabled = true; stopBtn.hidden = false; verdict.hidden = true;
      outPre.replaceChildren();
      setChip(PyRunner.status === "ready" ? "실행 중…" : "파이썬 준비 중…(처음에만 몇 초 걸려요)", "wait");
      let text = "";
      const r = await PyRunner.run(getCode(), stdinBox ? stdinBox.value : b.stdin || "", (t, isErr) => {
        text += t;
        outPre.append(isErr ? el("span", { className: "err", textContent: t }) : document.createTextNode(t));
      });
      running = false; runBtn.disabled = false; stopBtn.hidden = true;
      if (!r.ok) {
        outPre.append(el("span", { className: "err", textContent: (text ? "\n" : "") + r.error }));
        setChip(r.timedOut ? "시간 초과" : "오류", "bad");
      } else {
        if (!text) outPre.append(el("span", { className: "muted", textContent: "(출력이 없어요. print() 로 값을 보여 줘야 화면에 나와요)" }));
        setChip("완료", "ok");
        if (b.expect !== undefined) {
          const ok = norm(text) === norm(b.expect);
          verdict.hidden = false;
          verdict.className = "pyed-verdict " + (ok ? "ok" : "no");
          verdict.replaceChildren(icon(ok ? "circle-check" : "circle-x"), ok ? " 정답이에요! 기대한 결과와 똑같이 나왔어요." : " 아직 결과가 달라요. 기대하는 출력과 한 글자씩 비교해 보세요.");
          if (!ok) verdict.append(el("pre", { className: "pyed-expect", textContent: "기대하는 출력:\n" + b.expect.replace(/\n+$/, "") }));
        }
      }
    };
    stopBtn.onclick = () => PyRunner.stop();
    resetBtn.onclick = () => { setCode(starter); if (stdinBox) stdinBox.value = b.stdin || ""; outPre.replaceChildren(); verdict.hidden = true; setChip("", ""); focusEditor(); };
    return fig;
  };

  // 편집기가 있는 페이지는 미리 파이썬을 내려받아 둠 (실행 버튼을 처음 누를 때 기다리지 않게)
  window.addEventListener("load", () => {
    if (!document.querySelector(".pyed")) return;
    const warm = () => PyRunner.warmup();
    if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 1500 }); else setTimeout(warm, 1500);
  });
})();
