/* 마우스 휠/트랙패드 한 번에 한 영역씩 부드럽게 이동.
   CSS scroll-snap 만으로는 휠을 한 칸 굴렸을 때 절반을 못 넘어 제자리로 돌아오므로, 휠 입력을 받아 다음/이전 영역으로 보냅니다. */
(function () {
  const areas = [...document.querySelectorAll(".screen, .sec")];
  if (areas.length < 2) return;

  let lockedAt = 0; // 마지막으로 영역을 옮긴 시각
  let lastWheel = 0;
  const current = () => areas.findIndex((a) => { const r = a.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2; });

  addEventListener("wheel", (e) => {
    if (e.ctrlKey || document.querySelector("dialog[open]")) return;      // 확대/축소, 팝업이 열려 있을 때는 그대로
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;                  // 가로 스크롤은 그대로
    const i = current();
    if (i < 0) return;
    const down = e.deltaY > 0;
    const r = areas[i].getBoundingClientRect();
    if (down ? r.bottom > innerHeight + 2 : r.top < -2) return;           // 화면보다 긴 영역은 끝까지 기본 스크롤로 읽기
    const target = areas[i + (down ? 1 : -1)];
    if (!target) return;                                                  // 첫/마지막 영역

    e.preventDefault();
    const now = performance.now(), gap = now - lastWheel;
    lastWheel = now;
    if (now - lockedAt < (window.goToAreaMs || 600) + 150) return;        // 이동 애니메이션 중 (이동 시간 + 여유)
    if (gap < 120 && now - lockedAt < 2500) return;                       // 트랙패드 관성으로 이어지는 입력은 무시
    lockedAt = now;
    goToArea(target);
  }, { passive: false });
})();
