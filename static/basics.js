/* 과정 목록 페이지 (컴퓨터 기초 / 파이썬 공용).
   - 어느 묶음인지는 <body data-track="basics|python"> 로 정하고, 과정 제목·설명은 app.js 의 LESSONS, 번호 범위는 TRACKS 에서 가져옴.
   - 내용이 만들어진 과정(lessonOpen)은 눌러서 배우고, 아직이면 "준비 중" 으로 보임. */
(function () {
  const list = document.getElementById("b-list");
  const progress = document.getElementById("b-progress");
  const track = TRACKS[document.body.dataset.track];
  if (!list || !track) return;

  function render() {
    const done = localDone(); // app.js: 이 기기의 완료 기록 (로그인하면 서버 기록과 합쳐짐)
    const nos = [];
    for (let n = track.from; n <= track.to; n++) nos.push(n);
    const openNos = nos.filter(lessonOpen);
    const doneCount = openNos.filter((n) => done.includes(n)).length;
    progress.replaceChildren(
      icon("circle-check"),
      ` 열린 과정 ${openNos.length}개 중 `, el("b", { textContent: `${doneCount}개` }), " 완료");

    list.replaceChildren(...nos.map((n, i) => {
      const [title, desc] = LESSONS[n - 1];
      const info = lessonInfo(n);
      const isDone = !!info && done.includes(n);
      const meta = el("ul", { className: "b-meta" });
      if (info) {
        meta.append(el("li", {}, icon("clock", "sm"), ` 약 ${info.minutes}분`), el("li", {}, icon("layout-grid", "sm"), ` ${info.screens}개 화면`));
        if (track === TRACKS.python) meta.append(el("li", {}, icon("terminal", "sm"), " 직접 코딩"));
      } else {
        meta.append(el("li", { textContent: "준비 중" }));
      }
      const status = info
        ? el("span", { className: "b-status" + (isDone ? " done" : "") },
            ...(isDone ? [icon("circle-check"), " 완료 · 다시 보기"] : ["학습하기 ", icon("arrow-right")]))
        : el("span", { className: "b-status soon", textContent: "준비 중" });
      const body = [
        el("span", { className: "b-no", textContent: String(i + 1).padStart(2, "0") }),
        el("span", { className: "b-text" },
          el("b", { className: "b-title", textContent: title }),
          el("span", { className: "b-desc", textContent: desc }),
          meta),
        status,
      ];
      const li = el("li", {});
      li.append(info
        ? el("a", { className: "b-card", href: `/lesson.html?n=${n}` }, ...body)
        : el("div", { className: "b-card soon", "aria-disabled": "true" }, ...body));
      return li;
    }));
  }

  render();
  addEventListener("progress", render); // 로그인/로그아웃으로 완료 기록이 바뀌면 다시 그림
})();
