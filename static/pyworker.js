/* 브라우저 안에서 파이썬을 실행하는 작업자(Web Worker).
   Pyodide(웹어셈블리로 만든 파이썬)를 불러와서, 화면을 멈추지 않고 코드를 돌립니다.
   - 서버로 코드를 보내지 않아요. 모든 실행은 내 브라우저 안에서만 일어납니다.
   - input() 은 화면의 "입력값" 칸에 적은 줄을 차례로 읽어요. */
const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
let pyodide = null;
let loading = null;

function load() {
  if (!loading) {
    importScripts(PYODIDE_BASE + "pyodide.js");
    loading = loadPyodide({ indexURL: PYODIDE_BASE }).then((p) => (pyodide = p));
  }
  return loading;
}

// 에러 글에서 파이썬 내부 줄(pyodide 가 붙인 것)은 빼고, 사용자가 쓴 코드 부분만 남김
function friendlyError(message) {
  const lines = String(message).split("\n");
  const i = lines.findIndex((l) => l.includes('File "<exec>"'));
  const tail = i >= 0 ? lines.slice(i) : lines.slice(-3);
  return ["Traceback (most recent call last):", ...tail].join("\n").trim();
}

const PRELUDE = `
import builtins, sys
_stdin_lines = list(__stdin_lines)
def _input(prompt=""):
    if prompt:
        print(prompt, end="")
    if not _stdin_lines:
        raise EOFError("입력값이 부족해요. 코드 아래 '입력값' 칸에 한 줄에 하나씩 적어 주세요.")
    value = _stdin_lines.pop(0)
    print(value)
    return value
builtins.input = _input
`;

onmessage = async (e) => {
  const m = e.data;
  if (m.type === "init") {
    try { await load(); postMessage({ type: "ready" }); }
    catch (err) { postMessage({ type: "init-error", message: String(err && err.message || err) }); }
    return;
  }
  if (m.type !== "run") return;
  // 줄바꿈 없이 끝난 출력(end="")도 이번 실행 안에서 내보냄
  let outSink = null, errSink = null;
  const flush = () => { try { pyodide.runPython("import sys; sys.stdout.flush(); sys.stderr.flush()"); } catch {} outSink && outSink.send(); errSink && errSink.send(); };
  try {
    await load();
    // 출력은 글자(바이트) 단위로 받아서, 줄이 끝날 때마다 내보내고 줄바꿈 없이 끝난 출력(end="")도 마지막에 내보냄
    const dec = new TextDecoder();
    const sink = (isErr) => {
      let bytes = [];
      const send = () => { if (bytes.length) { postMessage({ type: "out", id: m.id, text: dec.decode(new Uint8Array(bytes)), err: isErr }); bytes = []; } };
      return { push: (b) => { bytes.push(b & 255); if (b === 10) send(); }, send };
    };
    outSink = sink(false); errSink = sink(true);
    pyodide.setStdout({ raw: (b) => outSink.push(b) });
    pyodide.setStderr({ raw: (b) => errSink.push(b) });
    const ns = pyodide.globals.get("dict")();
    ns.set("__stdin_lines", pyodide.toPy(m.stdin ? String(m.stdin).split("\n") : []));
    await pyodide.runPythonAsync(PRELUDE, { globals: ns });
    await pyodide.runPythonAsync(m.code, { globals: ns });
    ns.destroy();
    flush();
    postMessage({ type: "done", id: m.id, ok: true });
  } catch (err) {
    flush();
    postMessage({ type: "done", id: m.id, ok: false, error: friendlyError(err && err.message || err) });
  }
};
