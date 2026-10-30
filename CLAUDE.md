# 파이스쿨 (파이썬 공부 사이트) — 작업 이어하기 안내

## 사용자가 "파이썬 공부 사이트 열어줘"라고 하면
1. `git pull` 로 최신 작업을 받는다 (충돌이 있으면 사용자에게 알린다).
2. 포트 3000에서 서버를 켠다: `python server.py` (백그라운드, `.claude/launch.json` 이 있으면 preview_start 사용). 3000번을 다른 프로그램이 쓰고 있으면 함부로 끄지 말고 먼저 물어본다.
3. 브라우저로 http://localhost:3000 을 열고, 지난 작업 상태를 한두 줄로 요약해 준 뒤 이어서 무엇을 할지 묻는다.
4. 작업이 끝나면 사용자가 원할 때 `git add -A && git commit && git push` 로 올린다 (커밋 메일은 noreply 주소 사용).

## 프로젝트 개요
- 파이썬 학습 사이트 "파이스쿨". 의존성 없는 Python 서버(`server.py`, SQLite `data.db`) + 정적 HTML/JS/CSS(`static/`).
- 컴퓨터 기초(과정 1~6), 파이썬(과정 7~18). 파이썬 과정은 화면에서 직접 코딩(Pyodide를 Web Worker로 실행, CodeMirror 편집기).
- 로그인 필요 페이지: basics / python / lesson / community. 가입은 닉네임+비밀번호(8자 이상, 대문자 1+, 특수문자 1+).
- 배포: GitHub `kimmj1234/pyschool` → Render(`render.yaml`, 무료 플랜). 무료 플랜은 DB가 초기화될 수 있음.

## 디자인 규칙 (사용자가 정해 둔 것)
- 흰 배경, 다크모드 없음, Noto Sans KR, 검정/흰색 메뉴바와 얇은 선. 로고는 파이썬의 "파이"를 뜻함(수학 π 아님).
- 학습 화면은 "한 화면 = 한 개념", 영역 단위 부드러운 스크롤(smoothgo.js). 이모지 대신 아이콘(icons.js), 중요한 부분은 강조.
- 한국어로 소통. 메인 문구 "개발의 기초부터 시작하다. / With Python".

## 지켜야 할 것
- `data.db`(회원 정보)는 git에 올리지 않는다(.gitignore). 다른 PC의 DB는 별개다.
- 관리자 계정은 `python create_admin.py` 로 만들고(비밀번호는 실행 시 입력), 비밀번호를 파일·채팅에 적지 않는다.
- 테스트 계정을 지울 때는 그 계정만 지운다. DB 전체를 지우지 않는다.
- 과정 내용은 `static/lessons.js`(1,2,7)와 `static/lessons/NN.js`. 형식은 `tools/lesson-spec.md`, 검사는 `node tools/check_lessons.mjs`, 목록 메타는 `node tools/make_meta.mjs`.

## 남은 일
- 일부 화면(약 15개)이 900px 높이에서 최대 ~120px 넘침: 과정 5(8번 화면), 7(6번), 8(7번), 9(12번), 10(6·7번), 12(7번), 15(9번), 16(5번), 17(6·7·11번), 18(8·9·10번).
- 모든 편집기 정답 코드를 실제 브라우저(Pyodide)에서 돌려 보는 검증, 메인 화면 언덕 18개 모양, 모바일 편집기, 과정 3~6 사실 확인.
- 배포 서버에는 admin 계정이 없음(필요하면 방법 논의).
