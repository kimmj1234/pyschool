/* 영역 3: 학습 진행도 지형 — 선 그물로 그린 3D 그래프
   - 열린 과정 하나당 언덕 하나. 높이 = 값 (내 완료 여부 1/0, 비로그인이면 가입자 완료 비율, 가입자가 적으면 예시 값).
   - 색도 값 그대로: 파랑(0) → 회색(0.5) → 빨강(1). 언덕이 아닌 바닥은 먹색.
   - 캔버스는 선만 그리고, 숫자와 콜아웃은 DOM 링크 (글꼴이 선명하고 키보드·스크린리더로 닿음).
   - 영역이 40% 이상 보이고 데이터·글꼴이 준비되면 언덕이 왼쪽부터 한 번 솟고, 한 번 숨 쉰 뒤 멈춤. 다시 보면 한 번 더 숨 쉼.
   - "움직임 줄이기" 설정이면 완성된 정지 화면 한 장. 영역이 안 보이거나 탭이 숨으면 그리기를 멈춤. */
(function () {
  const area = document.getElementById("area-3");
  const box = area && area.querySelector(".wave-box");
  const canvas = document.getElementById("wave-canvas");
  const h2 = document.getElementById("wave-title"), sub = document.getElementById("wave-sub");
  const status = document.getElementById("wave-status"), list = document.getElementById("wave-marks");
  if (!area || !box || !canvas || !h2 || !sub || !list) return;
  const ctx = canvas.getContext("2d", { alpha: false });

  /* ---------- 상수 ---------- */
  const Z_NEAR = 500, WORLD_Z = 1500, MIN_USERS = 5;
  const INK = [17, 17, 17], MID = [163, 163, 163];
  const LOW = [76, 155, 255], HIGH = [255, 90, 102], LOW_HC = [47, 124, 224], HIGH_HC = [232, 64, 79];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)"), hcMq = matchMedia("(prefers-contrast: more)"), forcedMq = matchMedia("(forced-colors: active)");
  const mobileMq = matchMedia("(max-width: 600px)"), midMq = matchMedia("(max-width: 900px)");
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const smooth = (u) => { u = clamp01(u); return u * u * (3 - 2 * u); };
  const easeOut = (p) => 1 - Math.pow(1 - p, 5);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

  /* ---------- 과정 ---------- */
  const lessonNos = (typeof LESSONS !== "undefined" && typeof lessonOpen === "function" ? LESSONS.map((_, i) => i + 1).filter(lessonOpen) : []); // 내용이 만들어진 과정(번호순)
  const N = lessonNos.length;
  const titleOf = (no) => ((typeof LESSONS !== "undefined" && LESSONS[no - 1]) || [String(no)])[0];
  const demo = N > 1 ? lessonNos.map((_, i) => 0.08 + 0.88 * Math.pow(0.85, (12 * i) / (N - 1))) : N ? [0.72] : [];

  // 언덕마다: 목표 높이 vis(값에 바닥 0.12 를 더한 것)·목표 색 vals, 지금 높이 shown·색 val·물든 정도 tint, 트윈 구간
  const vis = new Float32Array(N), vals = new Float32Array(N), shown = new Float32Array(N), val = new Float32Array(N), tint = new Float32Array(N);
  const from = new Float32Array(N), to = new Float32Array(N), vFrom = new Float32Array(N), vTo = new Float32Array(N), tFrom = new Float32Array(N);
  const t0 = new Float32Array(N), prog = new Float32Array(N), hold = new Uint8Array(N), isIn = new Uint8Array(N);
  const mx = new Float32Array(N), my = new Float32Array(N);

  /* ---------- 표시(숫자·콜아웃) DOM ---------- */
  const mk = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls; if (text) n.textContent = text; return n; };
  const marks = [], txts = [], roles = [], srs = [];
  lessonNos.forEach((no) => {
    const a = mk("a", "wave-mk"), txt = mk("span", "mk-txt"), role = mk("span", "mk-role"), sr = mk("span", "sr-only", `${no}. ${titleOf(no)}`);
    a.href = `/lesson.html?n=${no}`;
    txt.setAttribute("aria-hidden", "true");
    txt.append(role, mk("span", "mk-nm", `${no}. ${titleOf(no)}`), mk("span", "mk-no", String(no)));
    a.append(txt, sr);
    const li = document.createElement("li"); li.append(a); list.append(li);
    marks.push(a); txts.push(txt); roles.push(role); srs.push(sr);
  });
  let calloutIdx = -1, nextCallout = -1, swapTimer = 0;

  /* ---------- 카메라·격자 (리사이즈마다) ---------- */
  let W = 0, H = 0, cx = 0, f = 0, camH = 0, horizon = 0, zc = 0, kc = 0, AMP = 0, gapPx = 0, gapW = 0, stemMin = 36;
  let COLS = 0, ROWS = 0, colX, rowZ, rowK, rowAG, rowAT, rowLW, rowFog, rowRip, rowA, rowB, c0s, c1s, gx, gz, Y, keys, colS, colA, colB, rowCc;
  const hillCol = new Int32Array(N), present = new Uint8Array(96), blist = new Uint8Array(96);
  let hc = false, forced = false, paper = "#fff", PAL = [];
  const wq = new Float32Array(96), lwx = new Float32Array(96);

  function solveCamera() {
    cx = W / 2;
    f = Math.max(0.6 * W, 0.8 * H);
    const kn = f / Z_NEAR, kf = f / (Z_NEAR + WORLD_Z);
    camH = (0.68 * H) / (kn - kf);                        // 가까운 줄(z=0)은 1.08H 에서 박스 밖으로, 먼 줄은 0.40H
    horizon = 0.4 * H - camH * kf;
    zc = (camH * f) / (0.72 * H - horizon) - Z_NEAR;      // 언덕 줄: 화면 0.72H
    kc = f / (zc + Z_NEAR);
    const spread = mobileMq.matches ? 0.9 * W : midMq.matches ? 0.8 * W : Math.min(0.72 * W, 1100);
    gapPx = N > 1 ? spread / N : 0.4 * W;
    gapW = gapPx / kc;
    const stack = mobileMq.matches ? 78 : 86;             // 콜아웃(글 + 줄기 + 네모) 높이
    const peak = Math.max(0.12 * H, Math.min(0.72 * H - stack - 40, 0.42 * H, 2.5 * gapPx)); // 언덕 최대 높이(px): 글과 소제목 사이 40px 확보
    AMP = peak / kc;
    stemMin = mobileMq.matches ? 28 : 36;
  }

  function rebuildGrid() {
    // 언덕 사이 세로선 칸 수: 기본 24/30px 칸, 꼭짓점 예산(모바일 1,500 / 태블릿 4,000 / 데스크톱 5,500)이 남으면 8칸까지 촘촘히 → 봉우리가 매끈
    const cell = mobileMq.matches ? 24 : 30, budget = mobileMq.matches ? 1500 : midMq.matches ? 4000 : 5500;
    const m = Math.min(36, Math.max(2, Math.ceil(gapPx / cell), Math.min(8, Math.floor((budget * gapPx) / (1.5 * W * 41)))));
    const dx = gapW / m, XW = (0.55 * W * (0.965 * WORLD_Z + Z_NEAR)) / f;
    const x0 = (-(N - 1) / 2) * gapW;                     // 언덕 중심이 모두 세로선 위에 오도록 격자를 첫 언덕에 맞춤
    const cMin = Math.floor((-XW - x0) / dx), cMax = Math.ceil((XW - x0) / dx);
    COLS = cMax - cMin + 1;
    colX = new Float32Array(COLS);
    for (let c = 0; c < COLS; c++) colX[c] = x0 + (cMin + c) * dx;
    for (let i = 0; i < N; i++) hillCol[i] = i * m - cMin;

    const dz = Math.max(2 * dx, WORLD_Z / 40, (WORLD_Z * 1.7 * W * m) / (budget * gapPx)), zs = [];   // 줄 간격도 예산 안으로 (세로가 긴 화면은 줄이 많아짐)
    for (let j = -Math.ceil(zc / dz); j * dz + zc <= 0.965 * WORLD_Z; j++) zs.push(zc + j * dz); // 가로줄은 언덕 줄(j=0)에 맞춤, 안개 뒤 줄은 생략
    ROWS = zs.length;
    rowZ = Float32Array.from(zs);
    rowK = new Float32Array(ROWS); rowAG = new Float32Array(ROWS); rowAT = new Float32Array(ROWS); rowLW = new Float32Array(ROWS);
    rowFog = new Float32Array(ROWS); rowRip = new Float32Array(ROWS); rowA = new Float32Array(ROWS); rowB = new Float32Array(ROWS); rowCc = new Float32Array(ROWS);
    c0s = new Int32Array(ROWS); c1s = new Int32Array(ROWS);
    for (let r = 0; r < ROWS; r++) {
      const z = rowZ[r], k = f / (z + Z_NEAR), near = 1 - z / WORLD_Z;
      rowK[r] = k; rowFog[r] = 1 - smooth((z / WORLD_Z - 0.58) / 0.42);   // 깊이 58% 부터 안개로 천천히 사라짐
      rowAG[r] = hc ? 0.35 : 0.1 + 0.18 * near; rowAT[r] = hc ? 0.85 : 0.3 + 0.45 * near; rowLW[r] = 0.8 + 0.3 * near + (hc ? 0.3 : 0);
      rowRip[r] = 0.4 + 0.6 * (z / WORLD_Z); rowA[r] = Math.sin(0.004 * z); rowB[r] = Math.cos(0.004 * z);
      const lo = (-24 - cx) / k, hi = (W + 24 - cx) / k;   // 이 줄에서 화면에 들어오는 세로선 범위
      let c0 = 0, c1 = COLS - 1;
      while (c0 < c1 && colX[c0] < lo) c0++;
      while (c1 > c0 && colX[c1] > hi) c1--;
      c0s[r] = c0; c1s[r] = c1;
    }
    const sx = 0.34 * gapW, sz = Math.min(260, Math.max(120, 0.9 * gapW));
    gx = new Float32Array(N * COLS); gz = new Float32Array(N * ROWS);   // 언덕 모양(가우시안)을 x·z 로 나눠 미리 계산
    for (let i = 0; i < N; i++) {
      const xi = colX[hillCol[i]];
      for (let c = 0; c < COLS; c++) { const d = colX[c] - xi; gx[i * COLS + c] = Math.exp(-(d * d) / (2 * sx * sx)); }
      for (let r = 0; r < ROWS; r++) { const d = rowZ[r] - zc; gz[i * ROWS + r] = Math.exp(-(d * d) / (2 * sz * sz)); }
    }
    Y = new Float32Array(ROWS * COLS); keys = new Uint8Array(ROWS * COLS);
    colS = new Float32Array(COLS); colA = new Float32Array(COLS); colB = new Float32Array(COLS);
  }

  // 색 96단계: 물든 정도 12 × 값 8. 값 0 파랑 → 0.5 회색 → 1 빨강을 먹색과 섞음
  function buildPalette() {
    let ink = INK;
    hc = hcMq.matches; forced = forcedMq.matches;
    paper = "#fff";
    if (forced) {                                           // 강제 색 모드: 시스템 글자색·배경색, 색 대신 선 굵기로 값을 표현
      const probe = mk("span", "sr-only"); probe.style.cssText = "color:CanvasText;background:Canvas";
      box.append(probe);
      const cs = getComputedStyle(probe);
      ink = (cs.color.match(/\d+/g) || INK).slice(0, 3).map(Number); paper = cs.backgroundColor;
      probe.remove();
    }
    const lo = hc ? LOW_HC : LOW, hi = hc ? HIGH_HC : HIGH, lut = [];
    for (let v = 0; v < 8; v++) { const t = v / 7; lut.push(forced ? ink : t < 0.5 ? mix(lo, MID, t * 2) : mix(MID, hi, (t - 0.5) * 2)); }
    PAL = [];
    for (let w = 0; w < 12; w++) for (let v = 0; v < 8; v++) {
      const k = w * 8 + v, q = w / 11;
      PAL.push(`rgb(${mix(ink, lut[v], q).join(",")})`); wq[k] = q; lwx[k] = forced ? 1.2 * q * (v / 7) : 0;
    }
  }

  /* ---------- 그리기: 꼭짓점을 모두 구한 뒤 먼 줄부터, 줄 아래를 종이색으로 덮어 뒤쪽 선을 가림 ---------- */
  let amp = 0, phase = 0;
  function draw() {
    ctx.globalAlpha = 1; ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
    if (!ROWS) return;
    if (amp > 0) {                                          // 잔물결 항: 삼각함수는 줄·세로선마다 한 번씩만
      for (let c = 0; c < COLS; c++) { const x = colX[c]; colS[c] = Math.sin(0.011 * x + 0.9 * phase); colA[c] = Math.sin(0.006 * x - 0.7 * phase); colB[c] = Math.cos(0.006 * x - 0.7 * phase); }
      for (let r = 0; r < ROWS; r++) rowCc[r] = Math.cos(0.006 * rowZ[r] + 0.55 * phase);
    }
    for (let r = 0; r < ROWS; r++) {                        // 1) 꼭짓점 높이와 색 단계
      const k = rowK[r], c0 = c0s[r], c1 = c1s[r], base = r * COLS, rip = amp * rowRip[r], rC = rowCc[r], rA = rowA[r], rB = rowB[r];
      for (let c = c0; c <= c1; c++) {
        let h = 0, sw = 0, sv = 0;
        for (let i = 0; i < N; i++) {
          const g = gx[i * COLS + c] * gz[i * ROWS + r], gt = g * tint[i];
          h += shown[i] * g; sw += gt; sv += val[i] * gt;
        }
        const w = sw < 1 ? sw : 1, v = sw > 1e-6 ? sv / sw : 0;
        if (rip > 0) h += rip * (1 - w) * (0.04 * colS[c] * rC + 0.02 * (colA[c] * rB - colB[c] * rA));
        Y[base + c] = horizon + (camH - h * AMP) * k;
        keys[base + c] = ((w * 11) | 0) * 8 + ((v * 7) | 0);
      }
    }
    for (let r = ROWS - 1; r >= 0; r--) {                   // 2) 먼 줄부터: 가림막 → 같은 색끼리 가로선 + 한 줄 앞으로 가는 세로선
      const k = rowK[r], c0 = c0s[r], c1 = c1s[r], base = r * COLS;
      let lowY = -1e9, nb = 0;
      for (let c = c0; c <= c1; c++) {
        if (Y[base + c] > lowY) lowY = Y[base + c];
        const key = keys[base + c];
        if (!present[key]) { present[key] = 1; blist[nb++] = key; }
      }
      const bottom = Math.min(H + 5, lowY + 2);             // 가림막: 이 줄 아래를 종이색으로
      ctx.globalAlpha = 1; ctx.fillStyle = paper; ctx.beginPath();
      ctx.moveTo(cx + colX[c0] * k, bottom);
      for (let c = c0; c <= c1; c++) ctx.lineTo(cx + colX[c] * k, Y[base + c]);
      ctx.lineTo(cx + colX[c1] * k, bottom); ctx.closePath(); ctx.fill();
      const kN = r ? rowK[r - 1] : 0, baseN = base - COLS, n0 = r ? c0s[r - 1] : 1, n1 = r ? c1s[r - 1] : 0;   // 앞줄: 가림막을 아직 안 그린 줄
      for (let b = 0; b < nb; b++) {                        // 같은 색끼리 한 번에 stroke
        const key = blist[b]; present[key] = 0;
        ctx.strokeStyle = PAL[key]; ctx.lineWidth = rowLW[r] + lwx[key];
        ctx.globalAlpha = rowFog[r] * (rowAG[r] + (rowAT[r] - rowAG[r]) * wq[key]);
        ctx.beginPath();
        for (let c = c0; c <= c1; c++) {
          if (keys[base + c] !== key) continue;
          const x = cx + colX[c] * k, y = Y[base + c];
          if (c > c0) { ctx.moveTo(cx + colX[c - 1] * k, Y[base + c - 1]); ctx.lineTo(x, y); }          // 가로선 조각
          if (c >= n0 && c <= n1) { ctx.moveTo(x, y); ctx.lineTo(cx + colX[c] * kN, Y[baseN + c]); }   // 세로선 조각: 앞줄 가림막이 덮기 전에
        }
        ctx.stroke();
      }
    }
  }

  /* ---------- 표시 배치: 숫자는 꼭대기 위, 콜아웃 줄기는 글 아래 언덕·숫자를 모두 넘기도록 ---------- */
  let needLayout = false;
  function layoutMarks() {
    needLayout = false;
    if (!N || !COLS) return;
    for (let i = 0; i < N; i++) {
      const col = hillCol[i];
      let h = 0;
      for (let j = 0; j < N; j++) h += shown[j] * gx[j * COLS + col];   // 언덕 줄에서의 해석적 높이 (= 그 꼭짓점의 화면 높이)
      mx[i] = cx + colX[col] * kc; my[i] = horizon + (camH - h * AMP) * kc;
      marks[i].style.setProperty("--x", Math.round(mx[i]) + "px");
      marks[i].style.setProperty("--y", Math.round(my[i]) + "px");
    }
    const ci = calloutIdx;
    if (ci < 0) return;
    const w = calloutW, lo = 16 + w / 2, hi = W - 16 - w / 2;
    const centre = hi < lo ? W / 2 : Math.min(hi, Math.max(lo, mx[ci]));   // 글은 화면 안쪽 16px 까지만
    let stem = stemMin;
    for (let j = 0; j < N; j++) if (j !== ci && Math.abs(mx[j] - centre) <= w / 2 + 8) stem = Math.max(stem, my[ci] - my[j] + 16);
    marks[ci].style.setProperty("--shift", Math.round(centre - mx[ci]) + "px");
    marks[ci].style.setProperty("--stem", Math.round(stem) + "px");
  }
  let calloutW = 0;
  function measureTexts() { calloutW = calloutIdx >= 0 ? txts[calloutIdx].offsetWidth : 0; }   // 글 폭은 콜아웃만 필요

  // 보이기: 한 번 보인 표시는 계속 보임. 콜아웃이 바뀌는 둘만 잠시 숨겼다가(hold) 언덕이 다 자라면 다시 보임
  function syncMarks() {
    const base = applied > 0 && entered;
    for (let i = 0; i < N; i++) {
      const want = base && !hold[i] && (isIn[i] === 1 || reduce.matches || !tweening || prog[i] >= (i === calloutIdx ? 1 : 0.6));
      if (want !== (isIn[i] === 1)) { isIn[i] = want ? 1 : 0; marks[i].classList.toggle("is-in", want); }
    }
  }
  function doSwap() {
    clearTimeout(swapTimer); swapTimer = 0;
    if (calloutIdx >= 0 && calloutIdx !== nextCallout) {
      marks[calloutIdx].classList.remove("is-callout"); marks[calloutIdx].style.removeProperty("--shift"); marks[calloutIdx].style.removeProperty("--stem");
      roles[calloutIdx].textContent = "";                   // 물러나는 콜아웃의 역할 글은 사라진 뒤에 지움
    }
    if (nextCallout >= 0) marks[nextCallout].classList.add("is-callout");
    calloutIdx = nextCallout; hold.fill(0);
    measureTexts(); layoutMarks(); syncMarks();
  }
  function setCallout(ci) {
    nextCallout = ci;
    if (ci === calloutIdx && !swapTimer) return;
    if (!entered || reduce.matches) return doSwap();
    hold.fill(0);
    if (calloutIdx >= 0) hold[calloutIdx] = 1;
    if (ci >= 0) hold[ci] = 1;
    syncMarks();                                            // 둘 다 0.15초 동안 사라짐
    clearTimeout(swapTimer); swapTimer = setTimeout(doSwap, 160);
  }

  /* ---------- 움직임: 트윈(솟아오름·변경) + 한 번의 숨(잔물결) ---------- */
  let anim = 0, dur = 1, tweening = false, breathing = false, bt = 0, breathOnLand = false, entered = false;
  let raf = 0, drawRaf = 0, last = 0, inView = false, ratio40 = false, armTimer = 0, morphTimer = 0, pending = false;

  function tweenTo(stagger, d) {
    for (let i = 0; i < N; i++) { from[i] = shown[i]; to[i] = vis[i]; vFrom[i] = val[i]; vTo[i] = vals[i]; tFrom[i] = tint[i]; t0[i] = anim + i * stagger; prog[i] = 0; }
    dur = d; tweening = true; resume();
  }
  const retarget = () => tweenTo(Math.min(0.04, 0.3 / Math.max(1, N - 1)), 0.7);
  function startRise() {
    armTimer = 0; entered = true; breathOnLand = true;
    if (N) tweenTo(Math.min(0.08, 0.45 / Math.max(1, N - 1)), 1.0); else breathStart();
  }
  function breathStart() { if (breathing || reduce.matches) return; breathing = true; bt = 0; resume(); }

  function step(dt) {
    let changed = false;
    if (tweening) {
      anim += dt;
      let all = true;
      for (let i = 0; i < N; i++) {
        const p = clamp01((anim - t0[i]) / dur), e = easeOut(p);
        if (p < 1) all = false;
        prog[i] = p;
        const s = from[i] + (to[i] - from[i]) * e;
        if (s !== shown[i]) { shown[i] = s; changed = true; }
        val[i] = vFrom[i] + (vTo[i] - vFrom[i]) * e;
        tint[i] = tFrom[i] + (1 - tFrom[i]) * e;             // 색은 솟는 만큼 물듦
      }
      if (all) { tweening = false; if (breathOnLand) { breathOnLand = false; breathStart(); } }
    }
    if (breathing) {                                        // 4초짜리 숨: 1.5초 차오르고 2.5초 가라앉음
      bt += dt;
      amp = bt < 1.5 ? smooth(bt / 1.5) : 1 - smooth((bt - 1.5) / 2.5);
      if (bt >= 4) { amp = 0; breathing = false; }
      phase += 0.5 * dt;
    }
    return changed;
  }
  function frame(dt) {
    const changed = step(dt);
    draw();
    if (changed || needLayout) layoutMarks();
    syncMarks();
  }
  function loop(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;   // 재개 첫 프레임은 dt=0 → 튀지 않음
    last = now;
    frame(dt);
    if (tweening || breathing) raf = requestAnimationFrame(loop); else { raf = 0; last = 0; }
  }
  function resume() { if (inView && !document.hidden && !reduce.matches && !raf && (tweening || breathing)) { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }
  function requestDraw() {                                  // 루프와 별개로 정지 화면 한 장 (step 없이)
    needLayout = true;
    if (raf || drawRaf) return;
    drawRaf = requestAnimationFrame(() => { drawRaf = 0; draw(); layoutMarks(); syncMarks(); });
  }

  /* ---------- 크기·화소 밀도 ---------- */
  let dprMq = null;
  function armDpr() {                                        // 모니터를 옮겨 배율이 바뀌면 다시 그림
    if (dprMq) dprMq.removeEventListener("change", onDpr);
    dprMq = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    dprMq.addEventListener("change", onDpr);
  }
  function onDpr() { resize(); }
  function resize(entry) {
    const Wn = box.clientWidth, Hn = box.clientHeight, dpr = devicePixelRatio || 1;
    const d = entry && entry.devicePixelContentBoxSize && entry.devicePixelContentBoxSize[0];
    const ok = d && Math.abs(d.inlineSize - Wn * dpr) <= 1;  // 기기 화소 크기가 배율과 어긋나면(에뮬레이션 등) 배율 계산을 씀
    let pw = ok ? d.inlineSize : Math.round(Wn * dpr), ph = ok ? d.blockSize : Math.round(Hn * dpr);
    if (pw > 2 * Wn) { pw = Math.round(2 * Wn); ph = Math.round(2 * Hn); }   // 2배까지만
    if (!pw || !ph || !Wn || !Hn) return;
    if (Wn === W && Hn === H && pw === canvas.width && ph === canvas.height && PAL.length) return;
    W = Wn; H = Hn;
    canvas.width = pw; canvas.height = ph;
    ctx.setTransform(pw / W, 0, 0, ph / H, 0, 0);
    buildPalette(); solveCamera(); rebuildGrid(); measureTexts(); armDpr();
    draw(); layoutMarks();                                   // 바로 그림: 크기를 바꾼 alpha:false 캔버스는 다음 프레임까지 검게 비므로
  }
  const ro = new ResizeObserver((entries) => resize(entries[entries.length - 1]));
  try { ro.observe(box, { box: "device-pixel-content-box" }); } catch { ro.observe(box); }
  resize();                                                  // 첫 장은 지금 (관찰자는 다음 프레임에 옴)
  const repaint = () => { if (W) { buildPalette(); rebuildGrid(); requestDraw(); } };   // 색 설정이 바뀌면 팔레트·선 진하기만 다시
  hcMq.addEventListener("change", repaint); forcedMq.addEventListener("change", repaint);

  /* ---------- 진행도 데이터 → 상태 ---------- */
  let applied = 0, lastKey = "", lastAnnounced = "", state = null, seq = 0, ctrl = null, retryTimer = 0;
  let resolveFirst;
  const firstData = new Promise((r) => (resolveFirst = r));

  const build = (mode, values, title, text, ci, role, srOf) => ({ mode, h2: title, p: text, values, vis: values.map((v) => 0.12 + 0.88 * v), callout: ci, role, sr: lessonNos.map(srOf) });
  const pct = (v) => Math.round(v * 100);

  function stateFrom(d) {
    if (!N) return { mode: "empty", h2: "곧 과정이 열려요", p: d.me ? "새 과정이 열리면 여기에 그려져요." : "로그인하면 내 진행도를 볼 수 있어요.", values: [], vis: [], callout: -1, role: "", sr: [] };
    if (d.me) {                                             // 로그인: 완료 1 / 미완료 0
      const done = lessonNos.map((no) => (d.me.includes(no) ? 1 : 0)), n = done.reduce((a, b) => a + b, 0);
      const srOf = (no, i) => (done[i] ? "완료" : "미완료");
      if (!n) return build("me", done, "아직 완료한 과정이 없어요", `${titleOf(lessonNos[0])} 과정을 끝내면 첫 언덕이 솟아요.`, 0, "첫 과정", srOf);
      if (n === N) return build("me", done, `열린 과정 ${N}개를 모두 완료했어요`, "대단해요! 새 과정이 열리면 여기에 이어서 그려져요.", done.lastIndexOf(1), "마지막으로 완료한 과정", srOf);
      const next = done.indexOf(0);
      return build("me", done, `열린 과정 ${N}개 중 ${n}개를 완료했어요`, `다음은 ${titleOf(lessonNos[next])} 과정이에요.`, next, "다음 과정", srOf);
    }
    if (d.users >= MIN_USERS) {                             // 비로그인: 가입자 전체의 과정별 완료 비율
      const ratios = lessonNos.map((no) => clamp01((d.counts[String(no)] || 0) / Math.max(1, d.users)));
      let ci = 0;
      for (let i = 1; i < N; i++) if (ratios[i] > ratios[ci]) ci = i;
      const srOf = (no, i) => `학습자 ${pct(ratios[i])}%가 완료`, title = `${d.users}명이 함께 배우고 있어요`;
      if (ratios[ci] <= 0) return build("agg", ratios, title, "아직 완료한 사람이 없어요. 로그인하면 내 진행도를 볼 수 있어요.", 0, "첫 과정", srOf);
      return build("agg", ratios, title, "언덕이 높을수록 많이 완료한 과정이에요. 로그인하면 내 진행도를 볼 수 있어요.", ci, `학습자 ${pct(ratios[ci])}%가 완료`, srOf);
    }
    return build("demo", demo, "완료할수록 언덕이 높아져요", "지금은 예시 화면이에요. 로그인하면 내 진행도를 볼 수 있어요.", 0, "첫 과정", () => "예시");
  }
  const errorState = (again) => Object.assign(build("error", demo, "진행도를 불러오지 못했어요", again ? "새로고침하면 다시 시도해요." : "잠시 후 다시 시도할게요.", N ? 0 : -1, "첫 과정", () => "예시"), { err: true });

  async function fetchProgress(signal) {
    const res = await fetch("/api/progress", { signal, cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    return { me: Array.isArray(d.me) ? d.me : null, users: Number(d.users) || 0, counts: d.counts && typeof d.counts === "object" ? d.counts : {} };
  }

  function say(title, text) { h2.textContent = title; sub.textContent = text; }
  function setTexts(s) {
    for (let i = 0; i < N; i++) {
      const no = lessonNos[i], role = i === s.callout ? s.role : "";
      if (role || i !== calloutIdx) roles[i].textContent = role;   // 물러나는 콜아웃의 역할 글은 doSwap 에서 지움
      srs[i].textContent = `${role && role !== s.sr[i] ? role + ": " : ""}${no}. ${titleOf(no)}, ${s.sr[i]}`;
    }
  }

  // 상태 적용: 같은 상태면 무시. 아직 솟기 전이면 글과 목표만 바꾸고, 솟은 뒤면 0.7초 동안 언덕이 옮겨감
  function apply(s, cause) {
    const key = `${s.mode}|${s.h2}|${s.p}|${s.vis.join(",")}`;
    if (key === lastKey) return;
    lastKey = key; state = s;
    say(s.h2, s.p); setTexts(s);
    let changed = false;
    for (let i = 0; i < N; i++) { if (Math.abs(vis[i] - s.vis[i]) > 1e-6) changed = true; vis[i] = s.vis[i]; vals[i] = s.values[i]; }   // vis 는 float32
    applied++;
    if (applied === 1) resolveFirst();
    if (!entered) {
      if (!reduce.matches) { setCallout(s.callout); measureTexts(); layoutMarks(); return; }   // 솟기 전: 글과 목표만 바꿈
      entered = true;                                       // 움직임 줄이기: 첫 데이터가 곧 완성 화면
    }
    const text = `${s.h2}. ${s.p}`;
    if (cause === "progress" && applied > 1 && text !== lastAnnounced && status) { lastAnnounced = text; status.textContent = text; }
    setCallout(s.callout); measureTexts();
    if (!changed) return layoutMarks();
    if (reduce.matches) { shown.set(vis); val.set(vals); tint.fill(1); return requestDraw(); }
    clearTimeout(morphTimer); morphTimer = 0;
    if (ratio40) morphTimer = setTimeout(() => { morphTimer = 0; retarget(); }, 100); else pending = true;
  }

  async function load(cause) {
    clearTimeout(retryTimer); retryTimer = 0;
    const mySeq = ++seq;
    if (ctrl) ctrl.abort();
    ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    let d = null;
    try { d = await fetchProgress(ctrl.signal); } catch { d = null; }
    clearTimeout(timeout);
    if (mySeq !== seq) return;                               // 더 새 요청이 있으면 버림
    const first = cause === "init" || cause === "progress";
    apply(d ? stateFrom(d) : errorState(!first), cause);
    if (!d && first) retryTimer = setTimeout(() => load("retry"), 5000);   // 한 번만 다시 시도
  }
  setTimeout(() => { if (!applied) say("진행도를 불러오고 있어요", ""); }, 800);
  load("init");

  /* ---------- 솟아오르기: 영역이 40% 이상 보이고 데이터·글꼴이 준비됐을 때 한 번 ---------- */
  let ready = false;
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => { measureTexts(); layoutMarks(); });
  Promise.all([firstData, Promise.race([fontsReady, sleep(1500)])]).then(() => {
    ready = true;
    if (ratio40 && !entered && !armTimer) armTimer = setTimeout(startRise, 100);
  });
  new IntersectionObserver((entries) => {
    const e = entries[entries.length - 1], r40 = e.intersectionRatio >= 0.399;
    inView = e.isIntersecting;
    if (r40 && !ratio40) {                                  // 40% 미만 → 이상으로 들어옴
      ratio40 = true;
      if (!entered) { if (ready && !armTimer) armTimer = setTimeout(startRise, 100); }
      else if (!reduce.matches) { if (pending) { pending = false; retarget(); } breathStart(); }
    } else if (!r40 && ratio40) { ratio40 = false; clearTimeout(armTimer); armTimer = 0; }
    if (inView) resume(); else stop();
  }, { threshold: [0, 0.4] }).observe(box);

  function applyReduce() {                                   // 움직임 줄이기: 완성된 정지 화면으로
    if (!reduce.matches) return;
    stop(); clearTimeout(armTimer); armTimer = 0; clearTimeout(morphTimer); morphTimer = 0;
    tweening = breathing = breathOnLand = pending = false; amp = 0; if (applied) entered = true;   // 데이터 전이면 첫 데이터가 완성 화면을 만듦
    shown.set(vis); val.set(vals); tint.fill(1); prog.fill(1);
    if (swapTimer) doSwap();
    requestDraw();
  }
  reduce.addEventListener("change", applyReduce);
  applyReduce();

  addEventListener("progress", () => load("progress"));     // app.js: 로그인/로그아웃/완료 변경 시
  addEventListener("online", () => { if (state && state.err) load("online"); });
  addEventListener("pageshow", (e) => { if (e.persisted) resume(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else resume(); });
})();
