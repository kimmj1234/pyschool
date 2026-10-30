"""과정 안의 파이썬 코드를 실제로 실행해 보는 도구 (check_lessons.mjs 가 부름).

브라우저의 편집기(static/pyworker.js)와 같은 규칙으로 실행합니다:
  - input() 은 입력값(stdin) 줄을 차례로 읽고, 읽은 값을 화면에 그대로 한 번 더 보여줌(터미널처럼)
  - 매번 새 환경(앞 코드의 변수가 남지 않음), 파일은 임시 폴더 안에서만 만들어짐
  - 10초가 넘으면 실패, 에러가 나면 실패(에러가 나는 것이 정답인 예제는 없다고 봄)
  - 해시 시드를 바꿔 두 번 실행해서, 결과가 실행 때마다 달라지는 코드(예: 문자열 집합 출력)를 걸러냄
"""
import json
import os
import subprocess
import sys
import tempfile

PRELUDE = '''
import builtins, sys
_stdin_lines = list(__import__("json").loads(sys.argv[1]))
def _input(prompt=""):
    if prompt:
        print(prompt, end="")
    if not _stdin_lines:
        raise EOFError("입력값이 부족해요")
    value = _stdin_lines.pop(0)
    print(value)
    return value
builtins.input = _input
_code = open(sys.argv[2], encoding="utf-8").read()
exec(compile(_code, "<exec>", "exec"), {"__name__": "__main__"})
'''


def norm(s):
    return "\n".join(line.rstrip() for line in s.replace("\r\n", "\n").split("\n")).strip("\n")


def run(code, stdin, seed):
    with tempfile.TemporaryDirectory() as d:
        with open(os.path.join(d, "_code.py"), "w", encoding="utf-8") as f:
            f.write(code)
        with open(os.path.join(d, "_run.py"), "w", encoding="utf-8") as f:
            f.write(PRELUDE)
        env = dict(os.environ, PYTHONHASHSEED=str(seed), PYTHONIOENCODING="utf-8", PYTHONUTF8="1")
        try:
            # -I 는 PYTHONHASHSEED 도 무시하므로 쓰지 않고, 사용자 사이트 폴더만 막음(-s). 한글 출력은 -X utf8 로 고정
            p = subprocess.run([sys.executable, "-s", "-X", "utf8", "_run.py", json.dumps(stdin.split("\n") if stdin else []), "_code.py"],
                               cwd=d, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=10, env=env)
        except subprocess.TimeoutExpired:
            return None, "10초 안에 끝나지 않았어요"
        if p.returncode != 0:
            lines = [l for l in (p.stderr or "").strip().split("\n") if l.strip()]
            return None, " / ".join(lines[-2:]) if lines else "알 수 없는 오류"
        return p.stdout, None


def main():
    items = json.load(open(sys.argv[1], encoding="utf-8"))
    bad = 0
    print(f"=== 코드 실제 실행 검사 ({len(items)}개) ===")
    for it in items:
        label = it["id"]
        out, err = run(it["code"], it["stdin"], 0)
        if err:
            if it["kind"] == "starter":
                continue  # 시작 코드는 일부러 비워 두거나 틀린 채로 줄 수 있어서 실행 오류는 무시
            bad += 1
            print(f"  ✘ [{label}] 실행 오류: {err}")
            continue
        if it["kind"] == "starter":
            continue
        out2, _ = run(it["code"], it["stdin"], 1)
        if out2 is not None and norm(out2) != norm(out):
            bad += 1
            print(f"  ✘ [{label}] 실행할 때마다 결과가 달라요(순서가 일정하지 않은 출력): 문자열 집합 대신 정렬해서 출력하세요")
            continue
        if it.get("expect") is not None and norm(out) != norm(it["expect"]):
            bad += 1
            print(f"  ✘ [{label}] 기대한 출력(out/expect)이 실제 결과와 달라요")
            print("      적어 둔 값:", repr(norm(it["expect"])[:200]))
            print("      진짜 결과:", repr(norm(out)[:200]))
    print(f"  → 코드 실행 검사: {'통과' if not bad else str(bad) + '건 실패'}")


if __name__ == "__main__":
    main()
