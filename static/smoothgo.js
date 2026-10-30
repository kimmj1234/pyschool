/* 영역 이동 애니메이션: 천천히 출발해서 부드럽게 흘러가고, 부드럽게 멈춤.
   브라우저 기본 smooth 스크롤은 속도를 바꿀 수 없어서, 직접 곡선(easeInOutSine)으로 움직입니다.
   - 한 화면(영역) 이동 ≈ 0.6초 (화면 높이에 비례해서, 큰 모니터에서도 한 프레임에 건너뛰는 거리가 너무 커지지 않게 함)
   - 여러 영역을 건너뛰면 조금 더 길어짐 (최대 1.1초)
   - 이동하는 동안만 scroll-snap 을 잠시 끕니다. */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  // easeInOutSine: 가장 빠른 구간도 평균 속도의 약 1.6배라 덜컹거림이 없음 (이전 cubic 은 약 3배라 가운데가 휙 지나갔음)
  const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  let raf = 0;

  window.goToAreaMs = 600; // 마지막 이동에 걸린 시간 (wheelpage.js 가 연속 입력을 거를 때 사용)
  window.goToArea = function (target) {
    cancelAnimationFrame(raf);
    const start = scrollY;
    const end = Math.round(target.getBoundingClientRect().top + scrollY);
    const dist = end - start;
    if (Math.abs(dist) < 2) return;
    if (reduce.matches) { window.scrollTo({ top: end, behavior: "instant" }); return; }

    const screens = Math.abs(dist) / innerHeight;
    const base = Math.max(480, 0.65 * innerHeight);               // 한 화면 이동 시간
    const ms = Math.min(1100, base * (1 + Math.max(0, screens - 1) * 0.3));
    window.goToAreaMs = ms;
    root.style.scrollSnapType = "none";  // 애니메이션 중 스냅이 끼어들지 않게
    root.style.scrollBehavior = "auto";  // CSS smooth 와 겹쳐 느려지지 않게
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / ms);
      window.scrollTo({ top: start + dist * ease(p), behavior: "instant" });
      if (p < 1) raf = requestAnimationFrame(step);
      else { root.style.scrollSnapType = ""; root.style.scrollBehavior = ""; }
    })(t0);
  };
})();
