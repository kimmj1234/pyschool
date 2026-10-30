/* 과정 콘텐츠.
   블록 종류: h(화면 시작), p, list, steps, code(out 선택), compare, cards, anat, tree, table, fig(svg), key, tip, warn, quiz, refs
   - 문장 안의 `백틱`은 코드, **별표**는 굵게 표시됩니다. */

// 그림 1: 파이썬이 코드를 실행하는 과정
const SVG_FLOW = `
<svg viewBox="0 0 720 150" role="img" aria-label="내가 쓴 코드를 파이썬이 읽고 실행해 결과를 보여주는 과정">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="arrow"/></marker></defs>
  <rect class="box" x="10" y="25" width="190" height="86" rx="14"/>
  <use class="ic" href="#i-file-code" x="93" y="32" width="24" height="24"/>
  <text class="big" x="105" y="76" text-anchor="middle">hello.py</text>
  <text class="sub" x="105" y="98" text-anchor="middle">내가 쓴 코드</text>
  <line class="line" x1="205" y1="68" x2="258" y2="68" marker-end="url(#ar)"/>
  <rect class="box brand" x="265" y="25" width="190" height="86" rx="14"/>
  <use class="ic" href="#i-settings" x="348" y="32" width="24" height="24"/>
  <text class="big" x="360" y="76" text-anchor="middle">파이썬</text>
  <text class="sub" x="360" y="98" text-anchor="middle">한 줄씩 읽고 실행</text>
  <line class="line" x1="460" y1="68" x2="513" y2="68" marker-end="url(#ar)"/>
  <rect class="box" x="520" y="25" width="190" height="86" rx="14"/>
  <use class="ic" href="#i-message-square-more" x="603" y="32" width="24" height="24"/>
  <text class="big" x="615" y="76" text-anchor="middle">결과</text>
  <text class="sub" x="615" y="98" text-anchor="middle">안녕, 파이썬!</text>
</svg>`;

// 그림 2: Windows 설치 화면 (모형)
const SVG_INSTALL = `
<svg viewBox="0 0 720 290" role="img" aria-label="파이썬 설치 화면에서 Add python.exe to PATH를 체크하고 Install Now를 누르는 모습">
  <rect class="win" x="60" y="8" width="600" height="274" rx="10"/>
  <rect class="titlebar" x="60" y="8" width="600" height="34" rx="10"/>
  <rect class="titlebar" x="60" y="26" width="600" height="16"/>
  <circle cx="82" cy="25" r="5" fill="#ff6058"/><circle cx="100" cy="25" r="5" fill="#ffbd2e"/><circle cx="118" cy="25" r="5" fill="#28c93f"/>
  <text class="sub" x="360" y="30" text-anchor="middle">Python 3.13 (64-bit) Setup</text>
  <text class="big" x="100" y="82">Install Python 3.13 (64-bit)</text>
  <rect class="btn-mock" x="100" y="102" width="300" height="46" rx="8"/>
  <text class="btn-text" x="250" y="131" text-anchor="middle">→ Install Now</text>
  <text class="sub" x="100" y="176" font-size="13">C:\\Users\\...\\Python313</text>
  <rect class="check" x="102" y="196" width="18" height="18" rx="3"/>
  <text class="sub" x="130" y="211" font-size="14">Use admin privileges when installing py.exe</text>
  <rect class="check on" x="102" y="228" width="18" height="18" rx="3"/>
  <path d="M106 238l4 4 8-9" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text class="big" x="130" y="243" font-size="15">Add python.exe to PATH</text>
  <rect class="hl" x="94" y="221" width="340" height="32" rx="8"/>
  <circle class="badge" cx="470" cy="237" r="15"/><text class="badge-t" x="470" y="243" text-anchor="middle">1</text>
  <text class="note-t" x="494" y="242">먼저 꼭 체크!</text>
  <circle class="badge" cx="438" cy="125" r="15"/><text class="badge-t" x="438" y="131" text-anchor="middle">2</text>
  <text class="note-t" x="462" y="130">그다음 클릭</text>
</svg>`;

// 그림 3: 컴퓨터의 세 가지 핵심 부품
const SVG_PC = `
<svg viewBox="0 0 720 190" role="img" aria-label="저장장치에서 메모리로 불러오고 CPU가 처리하는 컴퓨터의 구조">
  <defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="arrow"/></marker></defs>
  <rect class="box" x="10" y="20" width="200" height="120" rx="14"/>
  <use class="ic" href="#i-hard-drive" x="98" y="24" width="26" height="26"/>
  <text class="big" x="110" y="68" text-anchor="middle">저장장치</text>
  <text class="sub" x="110" y="88" text-anchor="middle">SSD · HDD</text>
  <text class="hw-t" x="110" y="108" text-anchor="middle">= 서랍장</text>
  <text class="hw-t" x="110" y="128" text-anchor="middle">파일을 오래 보관</text>
  <line class="line" x1="214" y1="80" x2="248" y2="80" marker-end="url(#ar2)"/>
  <rect class="box" x="255" y="20" width="200" height="120" rx="14"/>
  <use class="ic" href="#i-memory-stick" x="343" y="24" width="26" height="26"/>
  <text class="big" x="355" y="68" text-anchor="middle">메모리</text>
  <text class="sub" x="355" y="88" text-anchor="middle">RAM</text>
  <text class="hw-t" x="355" y="108" text-anchor="middle">= 책상 위 작업대</text>
  <text class="hw-t" x="355" y="128" text-anchor="middle">지금 쓰는 것만 잠깐 (끄면 사라짐)</text>
  <line class="line" x1="459" y1="80" x2="493" y2="80" marker-end="url(#ar2)"/>
  <rect class="box brand" x="500" y="20" width="210" height="120" rx="14"/>
  <use class="ic" href="#i-cpu" x="593" y="24" width="26" height="26"/>
  <text class="big" x="605" y="68" text-anchor="middle">CPU</text>
  <text class="sub" x="605" y="88" text-anchor="middle">프로세서</text>
  <text class="hw-t" x="605" y="108" text-anchor="middle">= 두뇌</text>
  <text class="hw-t" x="605" y="128" text-anchor="middle">계산하고 명령을 실행</text>
  <text class="sub" x="232" y="170" text-anchor="middle" font-size="13">불러오기</text>
  <text class="sub" x="477" y="170" text-anchor="middle" font-size="13">처리하기</text>
</svg>`;

// 그림 4: VS Code 화면 구성 (모형)
const SVG_VSCODE = `
<svg viewBox="0 0 720 306" role="img" aria-label="VS Code 화면의 네 영역: 파일 목록, 코드 편집 영역, 터미널, 상태 표시줄">
  <defs><clipPath id="wc"><rect x="40" y="8" width="640" height="290" rx="10"/></clipPath></defs>
  <g clip-path="url(#wc)">
    <rect class="win" x="40" y="8" width="640" height="290"/>
    <rect class="titlebar" x="40" y="8" width="640" height="28"/>
    <circle cx="60" cy="22" r="5" fill="#ff6058"/><circle cx="78" cy="22" r="5" fill="#ffbd2e"/><circle cx="96" cy="22" r="5" fill="#28c93f"/>
    <text class="sub" x="360" y="27" text-anchor="middle" font-size="13">hello.py - python-study - Visual Studio Code</text>
    <rect class="sel" x="40" y="36" width="36" height="232"/>
    <use class="ic-s" href="#i-file" x="48" y="50" width="20" height="20"/><use class="ic-s" href="#i-search" x="48" y="82" width="20" height="20"/><use class="ic-s" href="#i-puzzle" x="48" y="114" width="20" height="20"/>
    <rect class="pane" x="76" y="36" width="140" height="232"/>
    <text class="dim" x="88" y="56">탐색기</text>
    <use class="ic-s" href="#i-folder-open" x="86" y="68" width="16" height="16"/><text class="sub" x="108" y="82" font-size="14">python-study</text>
    <rect class="sel" x="76" y="92" width="140" height="22"/>
    <use class="ic" href="#i-file-code" x="100" y="94" width="16" height="16"/><text class="big" x="122" y="108" style="font-size:14px">hello.py</text>
    <circle class="badge" cx="100" cy="240" r="13"/><text class="badge-w" x="100" y="245" text-anchor="middle">1</text>
    <text class="note-t" x="120" y="245" font-size="14">파일 목록</text>
    <rect class="editor" x="216" y="36" width="464" height="140"/>
    <text class="dim" x="232" y="58">hello.py</text>
    <text class="dim" x="232" y="90">1</text><text class="code-t" x="256" y="90"><tspan fill="#7c8aa5"># 첫 번째 코드</tspan></text>
    <text class="dim" x="232" y="114">2</text><text class="code-t" x="256" y="114"><tspan fill="#79c0ff">print</tspan>(<tspan fill="#a5e08c">"안녕, 파이썬!"</tspan>)</text>
    <circle class="badge" cx="652" cy="60" r="13"/><text class="badge-w" x="652" y="65" text-anchor="middle">2</text>
    <text class="note-t" x="630" y="65" text-anchor="end" font-size="14">코드 쓰는 곳</text>
    <rect class="editor" x="216" y="176" width="464" height="92"/>
    <line x1="216" y1="176" x2="680" y2="176" stroke="#3a4358" stroke-width="2"/>
    <text class="dim" x="232" y="196">터미널</text>
    <text class="code-t" x="232" y="222" font-size="14">PS C:\\python-study&gt; python hello.py</text>
    <text class="code-t" x="232" y="246" fill="#b9f0c3" font-size="14" style="fill:#b9f0c3">안녕, 파이썬!</text>
    <circle class="badge" cx="652" cy="198" r="13"/><text class="badge-w" x="652" y="203" text-anchor="middle">3</text>
    <text class="note-t" x="630" y="203" text-anchor="end" font-size="14">명령 입력·결과</text>
    <rect class="statusbar" x="40" y="268" width="640" height="30"/>
    <use class="ic-white" href="#i-code-xml" x="54" y="274" width="16" height="16"/><text x="76" y="288" font-size="13" style="fill:#fff">Python 3.13.0</text>
    <circle cx="652" cy="283" r="12" fill="#fff"/><text x="652" y="288" text-anchor="middle" font-weight="800" font-size="14" style="fill:#ff5a4d">4</text>
    <text x="630" y="288" text-anchor="end" font-size="14" font-weight="700" style="fill:#fff">상태 표시줄</text>
  </g>
</svg>`;

// 그림 5: 저장하지 않으면 사라지는 이유
const SVG_SAVE = `
<svg viewBox="0 0 720 240" role="img" aria-label="저장하지 않고 전원을 끄면 글이 사라지고, 저장하고 끄면 파일이 남는 모습">
  <defs><marker id="ar3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="arrow"/></marker></defs>
  <rect class="box" x="10" y="14" width="230" height="84" rx="14"/>
  <use class="ic" href="#i-memory-stick" x="24" y="34" width="30" height="30"/>
  <text class="sub" x="66" y="42">메모리 (작업대)</text>
  <text class="big" x="66" y="76">작성 중인 글</text>
  <text class="sub" x="359" y="42" text-anchor="middle">저장 안 하고 전원 끄기</text>
  <line class="line" x1="248" y1="58" x2="472" y2="58" marker-end="url(#ar3)"/>
  <rect class="box bad" x="480" y="14" width="230" height="84" rx="14"/>
  <use class="ic-bad" href="#i-circle-x" x="496" y="42" width="30" height="30"/>
  <text class="bad-t" x="538" y="63">글이 사라져요</text>

  <rect class="box" x="10" y="138" width="230" height="84" rx="14"/>
  <use class="ic" href="#i-memory-stick" x="24" y="158" width="30" height="30"/>
  <text class="sub" x="66" y="166">메모리 (작업대)</text>
  <text class="big" x="66" y="200">작성 중인 글</text>
  <text class="sub" x="359" y="166" text-anchor="middle">Ctrl+S 로 저장 후 전원 끄기</text>
  <line class="line" x1="248" y1="182" x2="472" y2="182" marker-end="url(#ar3)"/>
  <text class="sub" x="359" y="208" text-anchor="middle" style="font-size:13px">저장장치(서랍장)에 보관됨</text>
  <rect class="box good" x="480" y="138" width="230" height="84" rx="14"/>
  <use class="ic-good" href="#i-circle-check" x="496" y="166" width="30" height="30"/>
  <text class="good-t" x="538" y="187">파일이 남아요</text>
</svg>`;

// 그림 6: 파일 탐색기에서 확장명 표시하기 (모형)
const SVG_EXPLORER = `
<svg viewBox="0 0 720 262" role="img" aria-label="파일 탐색기에서 보기, 표시, 파일 확장명 순서로 누르는 모습">
  <rect class="win" x="40" y="8" width="640" height="248" rx="10"/>
  <rect class="titlebar" x="40" y="8" width="640" height="34" rx="10"/><rect class="titlebar" x="40" y="26" width="640" height="16"/>
  <text class="sub" x="62" y="31" style="font-size:14px">파일 탐색기</text>
  <use class="ic-s" href="#i-folder-open" x="196" y="16" width="18" height="18"/>
  <text class="sub" x="62" y="66" style="font-size:14px">새로 만들기</text>
  <text class="sub" x="176" y="66" style="font-size:14px">정렬</text>
  <rect class="sel" x="248" y="48" width="80" height="26" rx="6"/>
  <text class="big" x="262" y="67" style="font-size:15px">보기 ▾</text>
  <rect class="hl" x="244" y="45" width="88" height="32" rx="8"/>
  <circle class="badge" cx="346" cy="61" r="13"/><text class="badge-t" x="346" y="66" text-anchor="middle" style="font-size:14px">1</text>
  <rect class="pane" x="248" y="82" width="190" height="156" rx="8" style="stroke:var(--line)"/>
  <text class="sub" x="266" y="108" style="font-size:15px">큰 아이콘</text>
  <text class="sub" x="266" y="134" style="font-size:15px">자세히</text>
  <text class="sub" x="266" y="160" style="font-size:15px">타일</text>
  <rect class="sel" x="254" y="174" width="178" height="30" rx="6"/>
  <text class="big" x="266" y="195" style="font-size:15px">표시 ▸</text>
  <rect class="hl" x="252" y="172" width="182" height="34" rx="8"/>
  <circle class="badge" cx="410" cy="189" r="12"/><text class="badge-t" x="410" y="194" text-anchor="middle" style="font-size:13px">2</text>
  <rect class="pane" x="446" y="150" width="224" height="96" rx="8" style="stroke:var(--line)"/>
  <text class="sub" x="466" y="176" style="font-size:15px">항목 확인란</text>
  <use class="ic-good" href="#i-check" x="458" y="190" width="20" height="20"/>
  <text class="big" x="484" y="206" style="font-size:15px">파일 확장명</text>
  <rect class="hl" x="452" y="186" width="212" height="28" rx="8"/>
  <circle class="badge" cx="640" cy="200" r="11"/><text class="badge-t" x="640" y="205" text-anchor="middle" style="font-size:13px">3</text>
  <text class="sub" x="466" y="234" style="font-size:15px">숨긴 항목</text>
</svg>`;

// 그림 7: 코딩 작업 순서
const SVG_WORKFLOW = `
<svg viewBox="0 0 720 150" role="img" aria-label="쓰기, 저장, 실행, 확인 순서의 코딩 작업 흐름">
  <defs><marker id="ar4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="arrow"/></marker></defs>
  <rect class="box" x="6" y="16" width="150" height="112" rx="14"/>
  <use class="ic" href="#i-pen-line" x="67" y="28" width="28" height="28"/>
  <text class="big" x="81" y="86" text-anchor="middle">① 쓰기</text><text class="sub" x="81" y="110" text-anchor="middle">VS Code에서</text>
  <line class="line" x1="160" y1="72" x2="186" y2="72" marker-end="url(#ar4)"/>
  <rect class="box" x="192" y="16" width="150" height="112" rx="14"/>
  <use class="ic" href="#i-save" x="253" y="28" width="28" height="28"/>
  <text class="big" x="267" y="86" text-anchor="middle">② 저장</text><text class="sub" x="267" y="110" text-anchor="middle">Ctrl + S</text>
  <line class="line" x1="346" y1="72" x2="372" y2="72" marker-end="url(#ar4)"/>
  <rect class="box brand" x="378" y="16" width="150" height="112" rx="14"/>
  <use class="ic" href="#i-terminal" x="439" y="28" width="28" height="28"/>
  <text class="big" x="453" y="86" text-anchor="middle">③ 실행</text><text class="sub" x="453" y="110" text-anchor="middle">터미널에서 명령</text>
  <line class="line" x1="532" y1="72" x2="558" y2="72" marker-end="url(#ar4)"/>
  <rect class="box" x="564" y="16" width="150" height="112" rx="14"/>
  <use class="ic-good" href="#i-circle-check" x="625" y="28" width="28" height="28"/>
  <text class="big" x="639" y="86" text-anchor="middle">④ 확인</text><text class="sub" x="639" y="110" text-anchor="middle">결과 보기</text>
</svg>`;

// 그림 8: VS Code 다운로드 페이지에서 눌러야 할 버튼 (모형)
const SVG_VSC_SITE = `
<svg viewBox="0 0 720 300" role="img" aria-label="VS Code 공식 사이트에서 Download for Windows 버튼을 누르는 모습">
  <rect class="win" x="40" y="8" width="640" height="284" rx="10"/>
  <rect class="titlebar" x="40" y="8" width="640" height="36" rx="10"/><rect class="titlebar" x="40" y="28" width="640" height="16"/>
  <circle cx="60" cy="26" r="5" fill="#ff6058"/><circle cx="78" cy="26" r="5" fill="#ffbd2e"/><circle cx="96" cy="26" r="5" fill="#28c93f"/>
  <rect class="pane" x="150" y="14" width="420" height="24" rx="12" style="stroke:var(--line)"/>
  <use class="ic-s" href="#i-globe" x="162" y="19" width="14" height="14"/>
  <text class="sub" x="184" y="31" style="font-size:13px">code.visualstudio.com</text>
  <text class="big" x="80" y="100" style="font-size:26px">Visual Studio Code</text>
  <text class="sub" x="80" y="126" style="font-size:15px">무료 코드 에디터</text>
  <rect class="btn-mock" x="80" y="156" width="270" height="54" rx="8"/>
  <text class="btn-text" x="215" y="189" text-anchor="middle">Download for Windows</text>
  <text class="sub" x="215" y="232" text-anchor="middle" style="font-size:13px">Stable Build · 맥/리눅스는 아래 다른 버전 선택</text>
  <rect class="hl" x="72" y="148" width="286" height="70" rx="10"/>
  <circle class="badge" cx="384" cy="183" r="14"/><text class="badge-t" x="384" y="189" text-anchor="middle">1</text>
  <text class="note-t" x="406" y="188">이 버튼을 눌러요</text>
  <rect class="pane" x="470" y="236" width="170" height="44" rx="6" style="stroke:var(--line); stroke-dasharray:4 4"/>
  <text class="sub" x="555" y="263" text-anchor="middle" style="font-size:12px">(다운로드 폴더에 저장돼요)</text>
</svg>`;

// 그림 9: 설치 중 "추가 작업 선택" 화면 (모형)
const SVG_VSC_TASKS = `
<svg viewBox="0 0 720 300" role="img" aria-label="VS Code 설치 중 추가 작업 선택 화면에서 Code(으)로 열기 항목을 체크하고 다음을 누르는 모습">
  <rect class="win" x="40" y="8" width="640" height="284" rx="10"/>
  <rect class="titlebar" x="40" y="8" width="640" height="32" rx="10"/><rect class="titlebar" x="40" y="26" width="640" height="14"/>
  <text class="sub" x="360" y="29" text-anchor="middle" style="font-size:13px">Setup - Microsoft Visual Studio Code</text>
  <text class="big" x="64" y="76" style="font-size:18px">추가 작업 선택</text>
  <text class="sub" x="64" y="98" style="font-size:13px">수행할 추가 작업을 선택하세요.</text>
  <rect class="check" x="66" y="126" width="16" height="16" rx="3"/>
  <text class="sub" x="92" y="139" style="font-size:13px">바탕 화면에 바로 가기 만들기</text>
  <rect class="check on" x="66" y="152" width="16" height="16" rx="3"/><path d="M69 160l4 4 7-8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text class="big" x="92" y="165" style="font-size:13px">“Code(으)로 열기” 작업을 Windows 탐색기 파일의 상황에 맞는 메뉴에 추가</text>
  <rect class="check on" x="66" y="178" width="16" height="16" rx="3"/><path d="M69 186l4 4 7-8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text class="big" x="92" y="191" style="font-size:13px">“Code(으)로 열기” 작업을 Windows 탐색기 디렉터리의 상황에 맞는 메뉴에 추가</text>
  <rect class="check on" x="66" y="204" width="16" height="16" rx="3"/><path d="M69 212l4 4 7-8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text class="sub" x="92" y="217" style="font-size:13px">지원되는 파일 형식에 대해 Code를 편집기로 등록합니다.</text>
  <rect class="check on" x="66" y="230" width="16" height="16" rx="3"/><path d="M69 238l4 4 7-8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text class="sub" x="92" y="243" style="font-size:13px">PATH에 추가(다시 시작한 후 사용 가능)</text>
  <rect class="hl" x="58" y="146" width="600" height="56" rx="8"/>
  <circle class="badge" cx="666" cy="174" r="12"/><text class="badge-t" x="666" y="179" text-anchor="middle" style="font-size:14px">1</text>
  <rect class="pane" x="360" y="256" width="96" height="28" rx="5" style="stroke:var(--line)"/><text class="sub" x="408" y="275" text-anchor="middle" style="font-size:13px">&lt; 뒤로(B)</text>
  <rect class="btn-mock" x="466" y="256" width="96" height="28" rx="5"/><text class="btn-text" x="514" y="275" text-anchor="middle" style="font-size:13px">다음(N) &gt;</text>
  <rect class="pane" x="572" y="256" width="80" height="28" rx="5" style="stroke:var(--line)"/><text class="sub" x="612" y="275" text-anchor="middle" style="font-size:13px">취소</text>
  <rect class="hl" x="460" y="250" width="108" height="40" rx="8"/>
  <circle class="badge" cx="440" cy="270" r="12"/><text class="badge-t" x="440" y="275" text-anchor="middle" style="font-size:14px">2</text>
</svg>`;

const LESSON_CONTENT = {
  /* ============================ 과정 1: PC 이해하기 ============================ */
  1: {
    minutes: 20,
    intro: "코딩을 시작하기 전에 꼭 알아야 할 컴퓨터의 기본! 어려운 용어 없이, 그림으로 하나씩 차근차근 알아봐요.",
    goals: ["컴퓨터의 3가지 핵심 부품을 설명한다", "파일·폴더·경로를 읽을 수 있다", "터미널에서 폴더를 이동하고 만든다"],
    blocks: [
      { t: "h", text: "컴퓨터는 어떤 부품으로 움직일까?", sub: "핵심 부품은 딱 3개예요", icon: "cpu" },
      { t: "p", text: "컴퓨터 안에는 수많은 부품이 있지만, 프로그램이 돌아가는 데는 **세 가지**만 알면 충분해요. 어렵게 느껴지면 **‘주방’** 을 떠올려 보세요." },
      { t: "list", items: [
        "**저장장치** – 파일을 오래 보관하는 곳. 주방의 **서랍장**",
        "**메모리(RAM)** – 지금 하는 일을 잠깐 올려두는 곳. 요리할 때 쓰는 **작업대**",
        "**CPU** – 계산하고 명령을 처리하는 곳. 요리하는 **요리사(두뇌)**",
      ] },
      { t: "fig", svg: SVG_PC, cap: "서랍장에서 꺼내 → 작업대에 올리고 → 두뇌가 처리한다" },

      { t: "h", text: "프로그램은 이렇게 실행돼요", sub: "꺼내고, 올리고, 처리하는 3단계", icon: "play" },
      { t: "steps", items: [
        "프로그램(파일)은 평소에 **저장장치**에 얌전히 보관돼 있어요.",
        "실행하면 필요한 부분이 **메모리**로 옮겨져요. (서랍에서 꺼내 작업대에 올리기)",
        "**CPU**가 메모리에서 명령을 하나씩 읽고 처리해요.",
      ] },
      { t: "tip", text: "컴퓨터가 느려지면 **메모리(작업대)가 꽉 찬** 경우가 많아요. 안 쓰는 프로그램을 끄면 작업대가 넓어져서 빨라져요!" },
      { t: "cards", items: [
        { icon: "globe", title: "브라우저 열기", desc: "저장장치 → 메모리 → CPU" },
        { icon: "gamepad-2", title: "게임 실행", desc: "저장장치 → 메모리 → CPU" },
        { icon: "code-xml", title: "파이썬 코드 실행", desc: "저장장치 → 메모리 → CPU" },
      ] },

      { t: "h", text: "왜 ‘저장’을 꼭 해야 할까?", sub: "메모리는 전원이 꺼지면 비워져요", icon: "save" },
      { t: "p", text: "글을 쓰는 동안 내용은 **메모리(작업대)** 위에 있어요. 그런데 작업대는 ==전원이 꺼지면 깨끗이 치워져요==." },
      { t: "p", text: "{{Ctrl+S}} 로 **저장**하면 내용이 **저장장치(서랍장)** 에 보관돼서, 전원을 꺼도 그대로 남아 있어요." },
      { t: "key", text: "코딩할 때도 **수시로** {{Ctrl+S}} 를 누르는 습관을 들이세요. 저장하지 않은 코드는 실행해도 **예전 내용**이 실행돼요!" },
      { t: "fig", svg: SVG_SAVE, cap: "저장은 ‘작업대 → 서랍장’으로 옮기는 일" },

      { t: "h", text: "파일과 폴더", sub: "컴퓨터 안의 정리 방식", icon: "folder" },
      { t: "p", text: "**파일**은 문서·사진·코드 같은 자료 하나하나이고, **폴더**는 파일을 담는 상자예요. 폴더 안에 폴더를 또 넣을 수 있어서 ==나무 모양==으로 정리돼요." },
      { t: "p", text: "앞으로 우리가 만들 연습 폴더는 오른쪽 위치에 둘 거예요. **들여쓰기**가 ‘이 폴더 안에 들어 있다’는 뜻이에요." },
      { t: "tip", text: "**폴더 = 상자**, **파일 = 상자 속 물건**. 이렇게 생각하면 쉬워요." },
      { t: "tree", items: [
        { depth: 0, name: "C:\\", note: "드라이브" },
        { depth: 1, name: "Users" },
        { depth: 2, name: "내이름", note: "내 계정" },
        { depth: 3, name: "Desktop", note: "바탕화면" },
        { depth: 4, name: "python-study", note: "연습용 폴더" },
        { depth: 5, name: "hello.py", type: "file", hl: true, note: "앞으로 만들 파일" },
        { depth: 3, name: "Documents", note: "문서" },
      ] },

      { t: "h", text: "경로: 파일의 주소", sub: "큰 곳에서 작은 곳 순서로 이어 써요", icon: "route" },
      { t: "p", text: "택배 주소가 ‘시 → 구 → 동 → 번지’ 순서인 것처럼, 파일의 주소인 **경로**도 큰 곳에서 작은 곳 순서로 써요." },
      { t: "p", text: "폴더를 구분하는 기호는 `\\`(역슬래시)예요. 한글 키보드에서는 {{Enter}} 위쪽의 `₩` 키를 누르면 돼요." },
      { t: "tip", text: "Mac은 `\\` 대신 `/` 를 써요. 예: `/Users/내이름/Desktop/hello.py`" },
      { t: "anat", parts: [
        { code: "C:", label: "드라이브", sub: "가장 큰 저장 공간" },
        { code: "\\Users", label: "폴더", sub: "사용자들" },
        { code: "\\내이름", label: "폴더", sub: "내 계정" },
        { code: "\\Desktop", label: "폴더", sub: "바탕화면" },
        { code: "\\hello.py", label: "파일", sub: "이름 + 확장자", hl: true },
      ] },

      { t: "h", text: "확장자: 파일의 종류표", sub: "이름 끝의 .py, .txt 같은 꼬리표", icon: "file-code" },
      { t: "p", text: "파일 이름 끝, 마지막 점(`.`) 뒤의 글자가 **확장자**예요. 컴퓨터는 이걸 보고 ==‘이 파일을 어떤 프로그램으로 열지’== 결정해요." },
      { t: "p", text: "우리가 앞으로 만들 파이썬 코드 파일의 확장자는 **`.py`** 예요. 예를 들어 `hello.py` 는 ‘hello 라는 이름의 파이썬 파일’이라는 뜻이죠." },
      { t: "cards", items: [
        { icon: "file-code", title: ".py", desc: "파이썬 코드" },
        { icon: "file-text", title: ".txt", desc: "일반 글(메모장)" },
        { icon: "image", title: ".png / .jpg", desc: "이미지" },
        { icon: "file-spreadsheet", title: ".xlsx", desc: "엑셀 문서" },
      ] },

      { t: "h", text: "확장자 보이게 설정하기", sub: "처음 한 번만 해두면 돼요", icon: "eye" },
      { t: "warn", text: "확장자가 숨겨져 있으면 `hello.py` 로 저장해도 실제 이름이 `hello.py.txt` 가 되기도 해요. ==이런 사고가 정말 자주 일어나요!==" },
      { t: "steps", items: [
        "**파일 탐색기**를 엽니다. ({{Win+E}})",
        "위쪽 메뉴에서 **보기** 를 클릭해요.",
        "**표시 → 파일 확장명** 에 체크해요.",
      ] },
      { t: "tip", text: "Mac은 Finder → **설정 → 고급 → ‘모든 파일 이름 확장자 보기’** 를 체크하면 돼요." },
      { t: "fig", svg: SVG_EXPLORER, cap: "1번 → 2번 → 3번 순서로 누르면 끝!" },

      { t: "h", text: "터미널이란?", sub: "글자로 컴퓨터에게 말을 거는 창", icon: "terminal" },
      { t: "p", text: "지금까지는 마우스로 폴더를 열고 파일을 눌렀죠? **터미널**은 같은 일을 ==글자 명령==으로 하는 창이에요. 처음엔 낯설지만 파이썬 코드를 실행할 때마다 쓰게 돼요." },
      { t: "steps", items: [
        "시작 메뉴를 누르고 **PowerShell** 을 검색해요.",
        "**Windows PowerShell** 을 클릭해서 열어요.",
        "`PS C:\\Users\\내이름>` 같은 줄이 보이면 성공!",
      ] },
      { t: "key", text: "`PS C:\\Users\\내이름>` 은 ==‘지금 내가 이 폴더 안에 있어요’== 라는 뜻이에요. 그 오른쪽에 명령을 쓰면 돼요." },
      { t: "code", file: "PowerShell", text: "PS C:\\Users\\내이름> ls", out: "    Desktop\n    Documents\n    Downloads" },

      { t: "h", text: "꼭 알아야 할 기본 명령 6개", sub: "이것만 알아도 충분해요", icon: "square-terminal", wide: true },
      { t: "p", text: "명령을 입력하고 {{Enter}} 를 누르면 실행돼요. 폴더 이름은 **띄어쓰기와 대소문자**에 주의하세요." },
      { t: "table", head: ["명령", "하는 일", "예시"], rows: [
        ["`pwd`", "**지금 내 위치** 보기", "`pwd`"],
        ["`ls`", "현재 폴더 안의 **목록** 보기", "`ls`"],
        ["`cd 폴더이름`", "그 폴더로 **들어가기**", "`cd Desktop`"],
        ["`cd ..`", "한 단계 **위 폴더**로 나가기", "`cd ..`"],
        ["`mkdir 이름`", "새 **폴더 만들기**", "`mkdir python-study`"],
        ["`cls`", "화면 깨끗이 **지우기**", "`cls`"],
      ] },

      { t: "h", text: "직접 해보기", sub: "연습용 폴더를 만들어 봐요", icon: "rocket" },
      { t: "steps", items: [
        "PowerShell 을 열어요.",
        "오른쪽 명령을 **한 줄씩** 입력하고 {{Enter}} 를 눌러요.",
        "마지막 `ls` 결과가 **비어 있으면** 성공이에요. (새 폴더라 아직 아무것도 없거든요)",
      ] },
      { t: "tip", text: "폴더 이름이 길어도 걱정 마세요. 앞글자만 치고 {{Tab}} 키를 누르면 자동으로 완성돼요." },
      { t: "key", text: "이제 바탕화면에 **python-study** 폴더가 생겼어요. 앞으로 이 폴더에 코드를 저장할 거예요!" },
      { t: "code", file: "터미널", text: "cd Desktop\nmkdir python-study\ncd python-study\nls" },

      { t: "h", text: "확인 퀴즈", sub: "배운 내용을 점검해 봐요", icon: "circle-help", kicker: "QUIZ" },
      { t: "quiz", q: "저장하지 않은 작업이 전원이 꺼지면 사라지는 이유는?", options: ["CPU가 고장나서", "메모리(RAM)는 전원이 꺼지면 비워져서", "폴더가 지워져서"], answer: 1, explain: "메모리는 작업대처럼 임시 공간이라 전원이 꺼지면 비워져요. 저장은 저장장치에 하는 거예요." },
      { t: "quiz", q: "`hello.py` 에서 `.py` 를 부르는 말은?", options: ["폴더", "확장자", "드라이브"], answer: 1, explain: "확장자는 파일의 종류를 알려줘요. `.py` 는 파이썬 코드 파일이에요." },
      { t: "quiz", q: "한 단계 위 폴더로 나가는 명령은?", options: ["cd ..", "ls", "mkdir"], answer: 0, explain: "`..` 은 ‘바로 위 폴더’를 뜻해요." },
      { t: "quiz", q: "새 폴더를 만드는 명령은?", options: ["cls", "pwd", "mkdir"], answer: 2, explain: "`mkdir` 은 ‘make directory(폴더 만들기)’의 줄임말이에요." },

      { t: "h", text: "오늘의 핵심 정리", sub: "이것만 기억해도 성공!", icon: "list-checks", kicker: "SUMMARY" },
      { t: "list", items: [
        "**저장장치**(서랍장) → **메모리**(작업대) → **CPU**(두뇌)",
        "작업은 꼭 **저장**해야 남는다 ({{Ctrl+S}})",
        "**경로** = 파일의 주소, **확장자** = 파일의 종류",
        "`cd` 이동 · `ls` 목록 · `mkdir` 폴더 만들기",
      ] },
      { t: "refs", items: [
        { title: "Windows 터미널 소개 (Microsoft)", url: "https://learn.microsoft.com/ko-kr/windows/terminal/", desc: "터미널을 더 편하게 쓰고 싶을 때" },
        { title: "PowerShell 문서 (Microsoft)", url: "https://learn.microsoft.com/ko-kr/powershell/", desc: "명령어를 더 알고 싶을 때" },
      ] },
    ],
  },

  /* ============================ 과정 2: 개발 도구와 단축키 ============================ */
  2: {
    minutes: 25,
    intro: "개발자는 어떤 도구를 쓰고, 어떤 단축키로 빠르게 일할까요? 이 과정만 익혀도 작업 속도가 확 달라져요.",
    goals: ["개발에 쓰는 기본 도구를 안다", "VS Code를 설치하고 화면을 읽는다", "꼭 필요한 단축키를 손에 익힌다"],
    blocks: [
      { t: "h", text: "개발자의 기본 도구 세트", sub: "딱 4가지만 있으면 시작할 수 있어요", icon: "wrench" },
      { t: "p", text: "개발자라고 해서 특별한 장비가 필요한 건 아니에요. 아래 네 가지면 충분해요." },
      { t: "key", text: "개발의 8할은 ==검색==이에요. 모르는 걸 찾아보는 건 초보든 고수든 똑같이 하는 일이에요. 부끄러운 게 아니에요!" },
      { t: "cards", items: [
        { icon: "pen-line", title: "코드 에디터", desc: "코드를 쓰는 곳 (VS Code)" },
        { icon: "terminal", title: "터미널", desc: "코드를 실행하는 곳" },
        { icon: "globe", title: "브라우저", desc: "검색하고 답 찾기" },
        { icon: "book-open", title: "공식 문서", desc: "가장 정확한 설명서" },
      ] },

      { t: "h", text: "코드 에디터가 왜 필요할까?", sub: "메모장으로도 되지만, 훨씬 편해요", icon: "pen-line" },
      { t: "p", text: "메모장으로도 코드를 쓸 수는 있어요. 하지만 **코드 에디터**는 코드를 위해 만든 도구라서 ==색을 입혀 읽기 쉽게 해주고, 오타를 미리 알려주고, 터미널까지== 한 화면에 들어 있어요." },
      { t: "tip", text: "우리가 쓸 에디터 **VS Code** 는 전 세계 개발자가 가장 많이 쓰는 **무료** 에디터예요." },
      { t: "table", head: ["기능", "메모장", "VS Code"], rows: [
        ["코드에 색 입히기", "없음", "**있음** (읽기 편해요)"],
        ["오타·오류 표시", "없음", "**있음** (빨간 밑줄)"],
        ["자동 완성", "없음", "**있음**"],
        ["터미널 내장", "없음", "**있음**"],
        ["가격", "무료", "무료"],
      ] },

      { t: "h", text: "VS Code 설치하기", sub: "4단계면 끝나요", icon: "download" },
      { t: "steps", items: [
        "브라우저에서 **code.visualstudio.com** 에 접속해 **Download for Windows** 를 눌러요.",
        "내려받은 설치 파일을 실행하고, 약관에 동의한 뒤 **다음**을 눌러요.",
        "‘추가 작업 선택’ 화면에서 **‘Code(으)로 열기’** 가 들어간 항목을 모두 체크해요.",
        "**설치**를 누르고, 끝나면 VS Code 를 실행해요.",
      ] },
      { t: "tip", text: "‘Code(으)로 열기’ 를 체크해 두면 폴더를 **오른쪽 클릭**해서 바로 VS Code 로 열 수 있어서 편해요." },
      { t: "img", src: "/media/vscode-download.png", alt: "VS Code 공식 사이트 오른쪽 위의 파란색 Download for Windows 버튼",
        marks: [{ x: 72.69, y: 5.41, w: 24.83, h: 13.77, n: 1 }],
        cap: "① 공식 사이트 오른쪽 위의 파란 버튼을 눌러 설치 파일을 받아요 (눌러서 크게 볼 수 있어요)" },
      { t: "fig", svg: SVG_VSC_TASKS, cap: "② 설치 중 ‘추가 작업 선택’ 화면: 빨간 점선 부분이 체크돼 있는지 확인한 뒤 ‘다음’" },

      { t: "h", text: "파이썬 확장 설치하기", sub: "VS Code에 기능을 더해주는 ‘앱’", icon: "puzzle" },
      { t: "p", text: "**확장(Extension)** 은 VS Code에 새 기능을 더해주는 작은 앱이에요. **Python 확장**을 설치하면 에디터가 파이썬 코드를 훨씬 잘 이해하고 도와줘요." },
      { t: "steps", items: [
        "왼쪽 막대에서 **확장**(퍼즐 모양)을 클릭해요. ({{Ctrl+Shift+X}})",
        "검색창에 **Python** 을 입력해요.",
        "**Microsoft** 가 만든 **Python** 의 **설치(Install)** 를 눌러요.",
      ] },
      { t: "cards", items: [
        { icon: "puzzle", title: "Python", desc: "꼭 설치! (Microsoft)" },
        { icon: "sparkles", title: "Pylance", desc: "함께 자동 설치돼요" },
        { icon: "globe", title: "한국어 언어팩", desc: "메뉴를 한글로 (선택)" },
      ] },

      { t: "h", text: "VS Code 화면 읽기", sub: "이 네 곳만 알면 길을 잃지 않아요", icon: "monitor" },
      { t: "list", items: [
        "**① 파일 목록** – 폴더 안의 파일이 보이는 곳 (탐색기)",
        "**② 편집 영역** – 코드를 쓰는 곳",
        "**③ 터미널** – 명령을 입력하고 결과를 보는 곳",
        "**④ 상태 표시줄** – 파이썬 버전 같은 정보가 보이는 곳",
      ] },
      { t: "tip", text: "{{Ctrl+`}} (숫자 1 왼쪽의 백틱 키)을 누르면 아래에 **터미널**이 열려요." },
      { t: "fig", svg: SVG_VSCODE, cap: "VS Code 화면 (모형)" },

      { t: "h", text: "코딩은 이런 순서로 해요", sub: "쓰고 → 저장하고 → 실행하고 → 확인하기", icon: "route" },
      { t: "p", text: "앞으로 모든 과정에서 ==이 네 단계==를 반복하게 돼요. 지금은 흐름만 익혀두세요. (파이썬 설치는 과정 7에서 해요.)" },
      { t: "steps", items: [
        "VS Code에서 **파일 → 폴더 열기** 로 `python-study` 폴더를 열어요.",
        "새 파일을 만들고 이름을 `hello.py` 로 지어요.",
        "코드를 쓰고 {{Ctrl+S}} 로 **저장**해요.",
        "{{Ctrl+`}} 로 터미널을 열고 `python hello.py` 를 입력해요.",
      ] },
      { t: "fig", svg: SVG_WORKFLOW, cap: "쓰기 → 저장 → 실행 → 확인, 이 순서가 코딩의 기본 리듬" },

      { t: "h", text: "단축키, 왜 쓸까?", sub: "3초 걸릴 일이 0.5초로", icon: "keyboard" },
      { t: "p", text: "**단축키**는 키보드로 기능을 바로 실행하는 방법이에요. 마우스로 메뉴를 찾아 누르는 것보다 ==훨씬 빠르고==, 손도 덜 피곤해요." },
      { t: "p", text: "표기는 이렇게 읽어요. `+` 는 ‘**같이** 누른다’는 뜻이에요." },
      { t: "tip", text: "Mac은 {{Ctrl}} 대신 {{Cmd}}, {{Alt}} 대신 {{Option}} 을 쓰면 돼요." },
      { t: "table", head: ["표기", "이렇게 눌러요"], rows: [
        ["{{Ctrl+C}}", "`Ctrl` 을 **누른 채로** `C` 를 눌러요 (두 키를 같이!)"],
        ["{{Ctrl+Shift+P}}", "세 키를 한꺼번에: `Ctrl`, `Shift` 를 누른 채 `P`"],
        ["{{Alt+↑}} / {{Alt+↓}}", "`/` 는 ‘또는’ 이에요. 위 방향키 또는 아래 방향키"],
      ] },

      { t: "h", text: "① 어디서나 쓰는 기본 단축키", sub: "코딩이 아니어도 평생 써요", icon: "copy" },
      { t: "key", text: "가장 중요한 건 **{{Ctrl+S}} 저장**! 하루에 100번 눌러도 많지 않아요." },
      { t: "table", head: ["단축키", "하는 일"], rows: [
        ["{{Ctrl+C}}", "복사"],
        ["{{Ctrl+V}}", "붙여넣기"],
        ["{{Ctrl+X}}", "잘라내기"],
        ["{{Ctrl+Z}}", "방금 한 일 **되돌리기**"],
        ["{{Ctrl+S}}", "**저장**"],
        ["{{Ctrl+A}}", "전체 선택"],
        ["{{Ctrl+F}}", "글자 찾기"],
        ["{{Alt+Tab}}", "열려 있는 창 전환"],
        ["{{Win+Shift+S}}", "화면 캡처 (질문할 때 유용)"],
      ] },

      { t: "h", text: "② VS Code 단축키", sub: "코드를 쓸 때 속도가 달라져요", icon: "command" },
      { t: "tip", text: "모든 단축키를 다 외우지 않아도 돼요. {{Ctrl+Shift+P}} 로 **명령 팔레트**를 열어 하고 싶은 일을 검색하면 돼요." },
      { t: "table", head: ["단축키", "하는 일"], rows: [
        ["{{Ctrl+`}}", "터미널 열기/닫기"],
        ["{{Ctrl+P}}", "파일 이름으로 **빠르게 열기**"],
        ["{{Ctrl+Shift+P}}", "**명령 팔레트** (모든 기능 검색)"],
        ["{{Ctrl+/}}", "선택한 줄 **주석** 처리/해제"],
        ["{{Alt+↑}} / {{Alt+↓}}", "현재 줄을 위·아래로 옮기기"],
        ["{{Shift+Alt+↓}}", "현재 줄을 복사해서 아래에 붙이기"],
        ["{{Ctrl+D}}", "같은 단어를 하나씩 더 선택"],
      ] },

      { t: "h", text: "③ 터미널 단축키", sub: "명령을 훨씬 빨리 입력해요", icon: "square-terminal" },
      { t: "p", text: "터미널에서는 같은 명령을 계속 다시 치게 돼요. 이 단축키들이 ==타자 수를 확 줄여줘요==." },
      { t: "tip", text: "한꺼번에 외우려 하지 마세요! 오늘은 **{{Ctrl+S}} · {{Ctrl+Z}} · {{Ctrl+`}}** 세 개만 써 보고, 하나씩 늘려가면 돼요." },
      { t: "table", head: ["단축키", "하는 일"], rows: [
        ["{{↑}}", "바로 전에 친 명령 **다시 불러오기**"],
        ["{{Tab}}", "파일·폴더 이름 **자동 완성**"],
        ["{{Ctrl+C}}", "실행 중인 프로그램 **멈추기**"],
        ["{{Ctrl+L}}", "화면 깨끗이 지우기"],
      ] },

      { t: "h", text: "막혔을 때 이렇게 해보세요", sub: "초보든 고수든 똑같이 해요", icon: "circle-help" },
      { t: "steps", items: [
        "빨간 **오류 메시지**를 끝까지 읽어요. (보통 **마지막 줄**에 핵심이 있어요)",
        "오류 메시지를 **복사해서 검색창**에 붙여넣어요.",
        "그래도 모르겠다면 **커뮤니티 질문 게시판**에 오류 화면과 함께 올려요.",
      ] },
      { t: "key", text: "오류는 **실패가 아니라 힌트**예요. 컴퓨터가 ‘여기가 문제야!’ 하고 알려주는 거예요." },

      { t: "h", text: "확인 퀴즈", sub: "배운 내용을 점검해 봐요", icon: "circle-help", kicker: "QUIZ" },
      { t: "quiz", q: "방금 한 작업을 되돌리는 단축키는?", options: ["Ctrl+Z", "Ctrl+S", "Ctrl+A"], answer: 0, explain: "{{Ctrl+Z}} 는 실행 취소예요. 실수했을 때 가장 먼저 눌러보세요." },
      { t: "quiz", q: "VS Code에서 터미널을 여는 단축키는?", options: ["Ctrl+P", "Ctrl+`", "Alt+Tab"], answer: 1, explain: "{{Ctrl+`}} 로 터미널을 열고 닫을 수 있어요." },
      { t: "quiz", q: "오류가 났을 때 가장 먼저 할 일은?", options: ["컴퓨터를 끈다", "오류 메시지를 읽고 검색한다", "코드를 전부 지운다"], answer: 1, explain: "오류 메시지에는 원인이 적혀 있어요. 읽고 검색하는 것이 해결의 첫걸음이에요." },
      { t: "quiz", q: "코딩의 기본 순서로 알맞은 것은?", options: ["실행 → 저장 → 쓰기", "쓰기 → 저장 → 실행 → 확인", "저장 → 확인 → 쓰기"], answer: 1, explain: "코드를 쓰고, 저장하고, 터미널에서 실행하고, 결과를 확인해요." },

      { t: "h", text: "오늘의 핵심 정리", sub: "이것만 기억해도 성공!", icon: "list-checks", kicker: "SUMMARY" },
      { t: "list", items: [
        "**VS Code + 터미널 + 검색** = 개발의 기본 세트",
        "VS Code 화면: **파일 목록 · 코드 · 터미널 · 상태 표시줄**",
        "{{Ctrl+S}} 저장, {{Ctrl+Z}} 되돌리기, {{Ctrl+`}} 터미널",
        "막히면 **오류 메시지 읽기 → 검색 → 질문**",
      ] },
      { t: "refs", items: [
        { title: "VS Code 다운로드", url: "https://code.visualstudio.com/", desc: "설치 파일은 여기서 받아요" },
        { title: "VS Code 단축키 목록 (Windows, PDF)", url: "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf", desc: "인쇄해서 책상에 붙여두면 좋아요" },
        { title: "VS Code로 파이썬 시작하기 (공식)", url: "https://code.visualstudio.com/docs/python/python-tutorial", desc: "파이썬 설치 후 이어서 보기 좋아요" },
      ] },
    ],
  },

  /* ============================ 과정 7: 파이썬 소개와 설치 ============================ */
  7: {
    minutes: 25,
    intro: "드디어 파이썬! 파이썬이 무엇인지 알아보고, 설치해서 내 컴퓨터에서 첫 번째 코드를 직접 실행해 봐요.",
    goals: ["파이썬이 무엇인지 한 문장으로 말한다", "내 컴퓨터에 파이썬을 설치한다", "`print()`로 첫 프로그램을 실행한다"],
    blocks: [
      { t: "h", text: "파이썬이란?", sub: "사람이 읽기 쉬운 프로그래밍 언어", icon: "code-xml" },
      { t: "p", text: "컴퓨터에게 할 일을 적어 주는 **프로그래밍 언어** 중 하나예요. 영어 문장처럼 읽혀서 ==입문용으로 가장 많이 추천==돼요." },
      { t: "p", text: "레시피를 쓰듯 **코드**를 쓰면, **파이썬**이라는 번역가가 그걸 한 줄씩 읽고 컴퓨터가 할 수 있게 실행해줘요." },
      { t: "fig", svg: SVG_FLOW, cap: "코드를 쓰면 → 파이썬이 실행하고 → 결과가 나온다" },

      { t: "h", text: "파이썬으로 무엇을 할 수 있을까?", sub: "생각보다 훨씬 많아요", icon: "wand-sparkles" },
      { t: "p", text: "파이썬은 **한 가지 일만** 하는 도구가 아니에요. 여러 분야에서 두루 쓰이기 때문에 ==배워두면 쓸 곳이 정말 많아요==." },
      { t: "tip", text: "지금 보고 있는 **이 사이트의 서버도 파이썬**으로 만들어졌어요!" },
      { t: "cards", items: [
        { icon: "settings", title: "자동화", desc: "반복 작업을 대신 처리" },
        { icon: "chart-column", title: "데이터 분석", desc: "표·그래프로 정리" },
        { icon: "bot", title: "인공지능", desc: "AI·챗봇 만들기" },
        { icon: "globe", title: "웹 개발", desc: "웹사이트 서버 만들기" },
        { icon: "gamepad-2", title: "게임·앱", desc: "간단한 게임부터" },
      ] },

      { t: "h", text: "왜 초보자에게 좋을까?", sub: "같은 결과, 훨씬 짧은 코드", icon: "sparkles" },
      { t: "p", text: "화면에 `Hello` 를 띄우는 코드를 다른 언어(Java)와 비교해 볼게요. 읽을 필요는 없고, **길이만** 비교해 보세요." },
      { t: "key", text: "같은 결과인데 파이썬은 **한 줄**! 문법이 간단해서 ==‘생각하는 일’에 집중==할 수 있어요." },
      { t: "compare", left: { file: "Java (5줄)", text: 'public class Main {\n  public static void main(String[] a) {\n    System.out.println("Hello");\n  }\n}' },
                       right: { file: "Python (1줄)", text: 'print("Hello")' } },

      { t: "h", text: "설치 ① 설치 파일 받기", sub: "공식 사이트에서 받아요", icon: "download" },
      { t: "steps", items: [
        "브라우저에서 **python.org/downloads** 에 접속해요.",
        "**노란 버튼이 아니라**, 그 아래 **‘Or get the standalone installer’** 문장 끝의 **Python 3.x.x** 링크를 눌러요. (버전 숫자는 달라도 괜찮아요)",
        "내려받은 파일(`python-3.x.x-amd64.exe`)을 **더블클릭**해서 실행해요.",
      ] },
      { t: "img", src: "/media/python-download.png", alt: "python.org 다운로드 페이지: 노란 설치 관리자 버튼과 그 아래 standalone installer 링크",
        marks: [{ x: 8.6, y: 28.3, w: 28.96, h: 18.8, no: true }, { x: 33.59, y: 48.3, w: 11.46, h: 10.6, n: 1 }],
        cap: "① 이 링크를 눌러요. 회색 ✕ 표시된 노란 버튼은 이번에는 쓰지 않아요 (눌러서 크게 볼 수 있어요)" },
      { t: "warn", text: "공식 사이트(python.org)가 아닌 곳에서 받은 설치 파일은 **절대 실행하지 마세요.**" },

      { t: "h", text: "설치 ② 가장 중요한 체크!", sub: "이걸 빼먹으면 나중에 고생해요", icon: "circle-check" },
      { t: "warn", text: "==PATH 체크를 빼먹으면== 터미널에서 `python` 명령을 찾지 못해요. 꼭 아래 순서를 지켜주세요." },
      { t: "steps", items: [
        "설치 화면 맨 아래 **Add python.exe to PATH** 를 **먼저 체크**해요.",
        "그다음 **Install Now** 를 눌러요.",
        "‘Setup was successful’ 이 나오면 **Close** 를 눌러요.",
      ] },
      { t: "fig", svg: SVG_INSTALL, cap: "설치 화면 (모형). 1번 체크 → 2번 클릭 순서!" },

      { t: "h", text: "설치 확인하기", sub: "버전이 나오면 성공!", icon: "terminal" },
      { t: "steps", items: [
        "시작 메뉴에서 **PowerShell** 을 열어요. (과정 1에서 배웠죠?)",
        "`python --version` 을 입력하고 {{Enter}} 를 눌러요.",
        "`Python 3.13.0` 처럼 **버전이 나오면** 성공이에요. 숫자는 달라도 괜찮아요!",
      ] },
      { t: "warn", text: "‘python을 찾을 수 없습니다’ 가 나오거나 Microsoft Store 가 열리면 **PATH 체크를 놓친 거예요.** 설치 파일을 다시 실행해 **Modify → Add Python to environment variables** 를 체크하세요." },
      { t: "code", file: "터미널", text: "python --version", out: "Python 3.13.0" },
      { t: "tip", text: "Mac에서는 `python3 --version` 처럼 **python3** 로 입력해요." },

      { t: "h", text: "첫 번째 코드 쓰기", sub: "hello.py 파일 만들기", icon: "pen-line" },
      { t: "steps", items: [
        "VS Code를 열고 **파일 → 폴더 열기** 로 과정 1에서 만든 `python-study` 폴더를 열어요.",
        "왼쪽 파일 목록의 **새 파일** 아이콘을 눌러 `hello.py` 라고 이름을 지어요.",
        "오른쪽 코드를 **그대로** 입력하고 {{Ctrl+S}} 로 저장해요.",
      ] },
      { t: "tip", text: "파일 이름 끝이 `.py` 인지 꼭 확인하세요. (`.py.txt` 면 안 돼요!)" },
      { t: "code", file: "hello.py", py: true, text: '# 이 줄은 주석 (실행되지 않아요)\nprint("안녕, 파이썬!")\nprint("나는 오늘부터 프로그래머!")', out: "안녕, 파이썬!\n나는 오늘부터 프로그래머!" },

      { t: "h", text: "코드 한 줄 뜯어보기", sub: "print(...) 는 이렇게 생겼어요", icon: "wrench" },
      { t: "p", text: "`print` 는 파이썬이 미리 만들어 둔 **함수**예요. ==‘괄호 안의 값을 화면에 출력해줘!’== 라는 뜻이에요." },
      { t: "p", text: "따옴표로 감싼 글자를 **문자열**이라고 해요. 따옴표 안의 글자는 **그대로** 화면에 나와요." },
      { t: "tip", text: "큰따옴표와 작은따옴표 모두 쓸 수 있어요. **열 때와 닫을 때 같은 모양**만 쓰면 돼요." },
      { t: "anat", parts: [
        { code: "print", label: "함수 이름", sub: "‘출력해줘!’" },
        { code: "(", label: "여는 괄호", sub: "값을 넣는 입구" },
        { code: '"안녕, 파이썬!"', label: "문자열", sub: "따옴표로 감싼 글자", hl: true },
        { code: ")", label: "닫는 괄호", sub: "입구 닫기" },
      ] },

      { t: "h", text: "실행해 보기", sub: "드디어 결과를 볼 시간!", icon: "play" },
      { t: "steps", items: [
        "VS Code 안에서 {{Ctrl+`}} 를 눌러 **터미널**을 열어요.",
        "`python hello.py` 를 입력하고 {{Enter}} 를 눌러요.",
        "아래에 글자가 나오면 **첫 프로그램 성공!**",
      ] },
      { t: "warn", text: "`No such file or directory` 오류가 나면 터미널이 `python-study` 폴더에 있는지 확인하세요. VS Code에서 폴더를 연 뒤 터미널을 열면 자동으로 그 폴더예요." },
      { t: "code", file: "터미널", text: "python hello.py", out: "안녕, 파이썬!\n나는 오늘부터 프로그래머!" },

      { t: "h", text: "여기서 바로 해보기", sub: "설치 없이 브라우저에서 파이썬 실행", icon: "play" },
      { t: "p", text: "설치가 어렵거나 아직 못 했어도 괜찮아요. 이 사이트의 **편집기**는 ==브라우저 안에서 파이썬을 바로 실행==해 줘요. 설치한 파이썬과 똑같이 동작해요." },
      { t: "steps", items: [
        "오른쪽 편집기의 코드를 읽어 봐요.",
        "**실행** 버튼(또는 {{Ctrl+Enter}})을 눌러요.",
        "글자를 바꿔서 다시 실행하면 **결과도 바뀌어요.**",
      ] },
      { t: "tip", text: "처음 실행할 때만 파이썬을 불러오느라 몇 초 걸려요. 이후에는 바로 실행돼요. 코드를 망쳤다면 **처음으로** 버튼을 누르세요." },
      { t: "editor", title: "직접 해보기", task: "`print()` 안의 글자를 **내 이름 인사**로 바꿔서 실행해 보세요. (처음 코드를 그대로 실행해도 돼요)",
        code: 'print("안녕, 파이썬!")\nprint("나는 오늘부터 프로그래머!")',
        hint: "따옴표(\" \")는 지우지 말고 **안의 글자만** 바꿔요." },

      { t: "h", text: "주석: 코드에 남기는 메모", sub: "# 뒤의 글자는 실행되지 않아요", icon: "hash" },
      { t: "p", text: "`#` 로 시작하는 글은 **주석**이에요. 사람이 읽으라고 남기는 메모라서 ==파이썬은 무시==해요." },
      { t: "p", text: "코드를 **설명**하거나, 잠깐 **실행하지 않게** 막아둘 때 써요. 아래 코드에서 마지막 줄은 실행되지 않아요." },
      { t: "key", text: "{{Ctrl+/}} 를 누르면 선택한 줄을 한 번에 **주석 처리/해제**할 수 있어요!" },
      { t: "code", file: "comment.py", py: true, text: '# 인사하는 프로그램\nprint("안녕!")   # 화면에 출력\n# print("이 줄은 실행되지 않아요")', out: "안녕!" },

      { t: "h", text: "확인 퀴즈", sub: "배운 내용을 점검해 봐요", icon: "circle-help", kicker: "QUIZ" },
      { t: "quiz", q: "파이썬의 특징으로 알맞은 것은?", options: ["문법이 간결하고 읽기 쉽다", "게임 만들기에만 쓸 수 있다", "설치가 불가능하다"], answer: 0, explain: "간결한 문법 덕분에 입문용으로 인기가 많고, 다양한 분야에 쓰여요." },
      { t: "quiz", q: "화면에 글자를 출력하는 코드는?", options: ['echo("Hi")', 'print("Hi")', 'say("Hi")'], answer: 1, explain: "`print()` 가 화면에 값을 출력하는 기본 함수예요." },
      { t: "quiz", q: "코드 안에서 `#` 뒤에 쓴 내용은?", options: ["화면에 출력된다", "오류가 난다", "무시된다 (주석)"], answer: 2, explain: "`#` 뒤는 주석! 사람을 위한 메모라 실행되지 않아요." },
      { t: "quiz", q: "설치할 때 꼭 체크해야 하는 항목은?", options: ["Install for all users", "Add python.exe to PATH", "Use admin privileges"], answer: 1, explain: "PATH를 체크해야 터미널에서 `python` 명령을 바로 쓸 수 있어요." },

      { t: "h", text: "오늘의 핵심 정리", sub: "이것만 기억해도 성공!", icon: "list-checks", kicker: "SUMMARY" },
      { t: "list", items: [
        "파이썬 = **읽기 쉬운** 프로그래밍 언어",
        "`python --version` → **설치 확인**",
        "`print(\"글자\")` → **화면에 출력**",
        "`python 파일이름.py` → **파일 실행**",
        "`#` → **주석** (실행 안 됨)",
      ] },
      { t: "refs", items: [
        { title: "파이썬 공식 다운로드", url: "https://www.python.org/downloads/", desc: "설치 파일은 여기서 받아요" },
        { title: "Windows에서 파이썬 사용하기 (공식 문서)", url: "https://docs.python.org/ko/3/using/windows.html", desc: "설치 중 문제가 생겼을 때 참고" },
        { title: "파이썬 공식 튜토리얼 (한국어)", url: "https://docs.python.org/ko/3/tutorial/introduction.html", desc: "더 깊이 공부하고 싶을 때" },
        { title: "Python Tutor", url: "https://pythontutor.com/", desc: "코드가 한 줄씩 실행되는 모습을 눈으로 볼 수 있어요" },
      ] },
    ],
  },
};
