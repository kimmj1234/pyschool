/* 파이썬 실행기 (화면 쪽): 작업자(pyworker.js)를 하나 띄워 놓고 코드를 차례로 실행시킵니다.
   - PyRunner.warmup()  : 미리 파이썬을 내려받아 둠 (처음에만 몇 초 걸리고, 그다음엔 브라우저가 기억해서 빨라요)
   - PyRunner.run(code, stdin, onOut) : 실행하고 { ok, error?, timedOut? } 를 돌려줌. 출력은 onOut(text, isError) 로 흘러옴
   - 10초가 넘으면 무한 반복으로 보고 강제로 멈춤 (작업자를 껐다가 다시 켬) */
(function () {
  const TIMEOUT_MS = 10000;
  let worker = null;
  let ready = null;          // 파이썬 준비 약속(Promise)
  let status = "idle";       // idle | loading | ready | error
  let queue = Promise.resolve();
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => f(status));

  function start() {
    status = "loading"; emit();
    worker = new Worker("/pyworker.js");
    ready = new Promise((resolve, reject) => {
      const onMsg = (e) => {
        if (e.data.type === "ready") { worker.removeEventListener("message", onMsg); status = "ready"; emit(); resolve(); }
        else if (e.data.type === "init-error") { worker.removeEventListener("message", onMsg); status = "error"; emit(); reject(new Error(e.data.message)); }
      };
      worker.addEventListener("message", onMsg);
      worker.addEventListener("error", (e) => { status = "error"; emit(); reject(new Error(e.message || "worker error")); }, { once: true });
    });
    ready.catch(() => {});
    worker.postMessage({ type: "init" });
  }

  function restart() { try { worker.terminate(); } catch {} worker = null; start(); }

  let seq = 0;
  function runOnce(code, stdin, onOut) {
    return new Promise(async (resolve) => {
      if (!worker) start();
      try { await ready; } catch (err) { resolve({ ok: false, error: "파이썬을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.", loadFailed: true }); return; }
      const id = ++seq;
      const timer = setTimeout(() => { cleanup(); restart(); resolve({ ok: false, timedOut: true, error: "10초가 지나도 끝나지 않아서 멈췄어요. 끝나지 않는 반복(무한 루프)이 아닌지 확인해 보세요." }); }, TIMEOUT_MS);
      const onMsg = (e) => {
        const d = e.data;
        if (d.id !== id) return;
        if (d.type === "out") onOut && onOut(d.text, !!d.err);
        else if (d.type === "done") { cleanup(); resolve({ ok: d.ok, error: d.error }); }
      };
      const cleanup = () => { clearTimeout(timer); worker && worker.removeEventListener("message", onMsg); };
      worker.addEventListener("message", onMsg);
      worker.postMessage({ type: "run", id, code, stdin });
    });
  }

  window.PyRunner = {
    get status() { return status; },
    onStatus(fn) { listeners.add(fn); fn(status); return () => listeners.delete(fn); },
    warmup() { if (!worker) start(); return ready; },
    run(code, stdin, onOut) { queue = queue.then(() => runOnce(code, stdin || "", onOut)); return queue; },
    stop() { if (worker) restart(); },
  };
})();
