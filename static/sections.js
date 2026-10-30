/* 메인 페이지: 영역(한 화면) 단위 이동.
   - 스크롤은 CSS scroll-snap 으로 영역 시작점에 맞춰 부드럽게 멈춥니다.
   - 오른쪽 점, 키보드(↑ ↓ PageUp PageDown Home End)로도 영역 사이를 부드럽게 이동합니다. */
(function () {
  const areas = [...document.querySelectorAll(".screen")];
  if (areas.length < 2) return;
  document.documentElement.classList.add("snap"); // style.css: scroll-snap-type (영역 시작점에 맞춰 멈춤)

  const go = (i) => goToArea(areas[Math.max(0, Math.min(areas.length - 1, i))]); // smoothgo.js: 빠르고 부드러운 이동

  const dots = document.createElement("nav");
  dots.className = "dots";
  dots.setAttribute("aria-label", "영역 이동");
  const dotEls = areas.map((a, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.title = `영역 ${i + 1}`;
    d.setAttribute("aria-label", `영역 ${i + 1}로 이동`);
    d.onclick = () => go(i);
    dots.append(d);
    return d;
  });
  document.body.append(dots);

  let active = 0;
  const setActive = (i) => { active = i; dotEls.forEach((d, k) => d.classList.toggle("on", k === i)); };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(areas.indexOf(e.target)); });
  }, { rootMargin: "-50% 0px -49% 0px" });
  areas.forEach((a) => io.observe(a));
  setActive(0);

  addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!["BODY", "HTML"].includes(e.target.tagName)) return;
    const to = { ArrowDown: active + 1, PageDown: active + 1, ArrowUp: active - 1, PageUp: active - 1, Home: 0, End: areas.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    go(to);
  });
})();
