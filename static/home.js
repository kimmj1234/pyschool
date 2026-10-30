/* 메인 문구 타자 효과: 제목을 다 치면 이어서 부제(With Python)를 칩니다.
   한글은 자음 → 모음 → 받침 순서로 조합하며 입력하는 것처럼 보여줍니다. */
(function () {
  const lines = [...document.querySelectorAll(".tw")].map((root) => ({
    root,
    full: root.querySelector(".tw-ghost").textContent,
    text: root.querySelector(".tw-text"),
  }));
  if (!lines.length) return;

  // 움직임 줄이기 설정이면 효과 없이 바로 보여줌
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    lines.forEach((l) => { l.text.textContent = l.full; l.root.querySelector(".tw-caret").remove(); });
    return;
  }

  const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  // 겹모음/겹받침은 앞부분을 먼저 치고 이어서 완성합니다. (인덱스: 완성형 → 먼저 치는 부분)
  const VOWEL_FIRST = { 9: 8, 10: 8, 11: 8, 14: 13, 15: 13, 16: 13, 19: 18 };
  const FINAL_FIRST = { 3: 1, 5: 4, 6: 4, 9: 8, 10: 8, 11: 8, 12: 8, 13: 8, 14: 8, 15: 8, 18: 17 };
  const make = (l, v, t) => String.fromCharCode(0xac00 + l * 588 + v * 28 + t);

  // 글자 하나를 "치는 과정"의 화면 상태 목록으로 바꿈 (한글이 아니면 그대로 한 번에)
  function steps(ch) {
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return [ch];
    const l = Math.floor(code / 588), v = Math.floor((code % 588) / 28), t = code % 28;
    const out = [CHO[l]];
    if (v in VOWEL_FIRST) out.push(make(l, VOWEL_FIRST[v], 0));
    out.push(make(l, v, 0));
    if (t) {
      if (t in FINAL_FIRST) out.push(make(l, v, FINAL_FIRST[t]));
      out.push(make(l, v, t));
    }
    return out;
  }

  // 한 줄의 프레임: [그 시점의 화면 글자, 다음 칸까지 기다릴 시간(ms)]
  function framesOf(full) {
    const frames = [];
    let done = "";
    [...full].forEach((ch) => {
      const st = steps(ch);
      const hangul = st.length > 1 || /[가-힣]/.test(ch);
      st.forEach((s, i) => {
        const last = i === st.length - 1;
        const wait = !last ? 85 : ch === " " ? 220 : hangul ? 130 : 95; // 글자 완성 후엔 살짝 더 쉼
        frames.push([done + s, wait + Math.random() * 40]);
      });
      done += ch;
    });
    return frames;
  }

  function typeLine(line, next) {
    const frames = framesOf(line.full);
    const caret = line.root.querySelector(".tw-caret");
    line.root.classList.add("active");
    caret.classList.add("typing"); // 치는 동안은 커서가 깜빡이지 않음
    let i = 0;
    (function tick() {
      if (i >= frames.length) {
        if (next) { line.root.classList.remove("active"); setTimeout(next, 380); } // 다음 줄로 커서 이동
        else caret.classList.remove("typing"); // 마지막 줄이 끝나면 커서 깜빡임
        return;
      }
      line.text.textContent = frames[i][0];
      setTimeout(tick, frames[i++][1]);
    })();
  }

  const run = (k) => typeLine(lines[k], k + 1 < lines.length ? () => run(k + 1) : null);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => run(0), 600));
})();
