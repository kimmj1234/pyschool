LESSON_CONTENT[3] = {
  minutes: 22,
  intro: "컴퓨터를 켜면 가장 먼저 만나는 프로그램이 운영체제예요. 무슨 일을 하는지 알면 컴퓨터가 훨씬 편해져요.",
  goals: ["운영체제가 하는 일을 설명할 수 있다", "Windows, macOS, Linux의 차이를 안다", "내 컴퓨터의 운영체제와 작업 관리자를 확인한다"],
  blocks: [
    { t: "h", text: "운영체제는 컴퓨터의 관리인", sub: "프로그램과 부품 사이를 이어 줘요", icon: "cpu" },
    { t: "p", text: "큰 건물에는 **관리인**이 있어요. 입주자가 부탁하면 열쇠를 주고, 전기와 수도를 나눠 주고, 문제가 생기면 해결해 줘요." },
    { t: "p", text: "컴퓨터의 관리인이 바로 **운영체제(OS)** 예요. ==프로그램과 컴퓨터 부품 사이에서 일을 대신 맡아 주는 가장 기본적인 프로그램==이에요." },
    { t: "cards", items: [
      { icon: "layout-grid", title: "건물 관리인", desc: "입주자와 시설을 이어 줘요" },
      { icon: "cpu", title: "운영체제", desc: "프로그램과 부품을 이어 줘요" },
    ] },

    { t: "h", text: "운영체제가 하는 일", sub: "다섯 가지만 기억해요", icon: "settings" },
    { t: "p", text: "우리는 눈치채지 못하지만 운영체제는 쉬지 않고 일해요." },
    { t: "tip", text: "게임을 켜면 운영체제가 메모리를 나눠 주고, 화면과 소리 장치까지 연결해 줘요." },
    { t: "cards", items: [
      { icon: "play", title: "프로그램 실행", desc: "앱을 켜고 끄고 순서를 정해요" },
      { icon: "memory-stick", title: "메모리 관리", desc: "프로그램마다 작업 공간을 나눠 줘요" },
      { icon: "folder", title: "파일 관리", desc: "저장 장치에 파일을 정리해 둬요" },
      { icon: "wrench", title: "장치 연결", desc: "드라이버로 프린터·소리 등을 다뤄요" },
      { icon: "mouse", title: "화면과 입력", desc: "마우스와 키보드로 쓰게 해 줘요" },
    ] },

    { t: "h", text: "앱 - 운영체제 - 하드웨어", sub: "층층이 쌓인 구조예요", icon: "layout-grid" },
    { t: "p", text: "프로그램은 부품을 직접 다루지 않고 ==운영체제에게 부탁==해요. 그래서 프로그램을 만드는 사람은 부품마다 다른 방법을 몰라도 돼요." },
    { t: "p", text: "**드라이버**는 장치를 다루는 방법이 적힌 작은 프로그램이에요. 새 장치를 연결하면 운영체제가 알맞은 드라이버를 찾아 써요." },
    { t: "flow", items: ["내가 쓰는 앱", "운영체제", "드라이버", { t: "하드웨어(CPU·메모리·저장장치)", k: "end" }] },

    { t: "h", text: "대표 운영체제 세 가지", sub: "Windows, macOS, Linux", icon: "monitor", wide: true },
    { t: "p", text: "각각 장점이 달라요. 어느 쪽이 더 좋다기보다 ==쓰는 목적에 맞는 것==을 고르면 돼요." },
    { t: "table", head: ["이름", "만든 곳", "주로 쓰는 곳", "특징"], rows: [
      ["**Windows**", "Microsoft", "개인 PC, 회사, 게임", "쓰는 사람이 많고 프로그램 종류가 다양해요"],
      ["**macOS**", "Apple", "Mac 컴퓨터", "Apple 기기와 잘 어울리고, 디자인·영상 작업에 많이 써요"],
      ["**Linux**", "여러 개발자와 단체", "서버, 개발 환경", "무료로 쓸 수 있고 서버에서 많이 써요"],
    ] },

    { t: "h", text: "프로세스와 작업 관리자", sub: "지금 실행 중인 일을 볼 수 있어요", icon: "chart-column" },
    { t: "p", text: "실행 중인 프로그램 하나하나를 **프로세스**라고 해요. 요리사가 여러 요리를 동시에 하듯, 운영체제는 프로세스 여러 개를 번갈아 돌봐요." },
    { t: "tip", text: "프로그램이 멈춰서 안 닫힐 때는 작업 관리자에서 **작업 끝내기**를 눌러요." },
    { t: "table", head: ["운영체제", "여는 방법", "이름"], rows: [
      ["Windows", "{{Ctrl+Shift+Esc}}", "작업 관리자"],
      ["macOS", "Spotlight에서 ‘활성 상태 보기’ 검색", "활성 상태 보기 (Activity Monitor)"],
      ["Linux", "배포판마다 달라요", "시스템 모니터 등"],
    ] },

    { t: "h", text: "파일 시스템과 경로", sub: "같은 위치도 쓰는 모양이 달라요", icon: "folder-tree" },
    { t: "p", text: "Windows는 **드라이브 문자**(`C:`)로 시작하고 **역슬래시**(`\\`)로 폴더를 나눠요. macOS와 Linux는 **/** 하나에서 시작해 슬래시(`/`)로 나눠요." },
    { t: "warn", text: "Windows 경로는 `\\`, 그 외는 `/` 예요. 경로를 그대로 복사해 다른 컴퓨터에서 쓰면 안 될 때가 많아요." },
    { t: "table", head: ["운영체제", "내 문서 폴더 예시"], rows: [
      ["Windows", "`C:\\Users\\mina\\Documents`"],
      ["macOS", "`/Users/mina/Documents`"],
      ["Linux", "`/home/mina/Documents`"],
    ] },

    { t: "h", text: "터미널도 조금씩 달라요", sub: "기본 명령 몇 개만 비교해 봐요", icon: "square-terminal" },
    { t: "p", text: "Windows의 기본 터미널은 **PowerShell**, macOS는 **zsh**, Linux는 대부분 **bash** 를 써요. 모양은 달라도 비슷한 일을 해요." },
    { t: "table", head: ["하는 일", "PowerShell", "zsh / bash"], rows: [
      ["지금 위치 보기", "`pwd`", "`pwd`"],
      ["파일 목록 보기", "`ls` 또는 `dir`", "`ls`"],
      ["폴더 이동", "`cd 폴더`", "`cd 폴더`"],
      ["화면 지우기", "`cls`", "`clear`"],
    ] },
    { t: "code", file: "터미널", text: "pwd", out: "/Users/mina/python-study" },

    { t: "h", text: "프로그래밍할 때 OS가 중요한 이유", sub: "작은 차이가 오류로 이어지기도 해요", icon: "wrench", wide: true },
    { t: "p", text: "파이썬 코드 대부분은 어디서나 돌아가지만, ==경로·설치 방법·명령어==처럼 운영체제마다 다른 부분이 있어요." },
    { t: "table", head: ["다른 점", "내용"], rows: [
      ["경로 구분", "Windows `\\`, macOS·Linux `/`"],
      ["줄바꿈", "Windows와 다른 OS가 줄 끝 문자를 다르게 저장해요"],
      ["설치 방법", "설치 파일, 앱 스토어, 패키지 명령 등으로 달라요"],
      ["32비트 / 64비트", "요즘 PC는 대부분 64비트라서 64비트용 프로그램을 받아요"],
    ] },

    { t: "h", text: "내 컴퓨터의 운영체제 확인하기", sub: "질문할 때 꼭 필요한 정보예요", icon: "search" },
    { t: "p", text: "도움을 요청할 때 ‘어떤 OS를 쓰는지’를 알려 주면 답이 훨씬 정확해져요." },
    { t: "steps", items: [
      "Windows: {{Win+R}} 를 누르고 `winver` 를 입력해요.",
      "macOS: 왼쪽 위 애플 메뉴에서 **이 Mac에 관하여**를 눌러요.",
      "Linux: 터미널에서 `uname -a` 를 입력해요.",
    ] },
    { t: "code", file: "터미널 (Linux)", text: "uname -s", out: "Linux" },

    { t: "h", text: "확인 퀴즈", sub: "배운 내용을 점검해 봐요", icon: "circle-help", kicker: "QUIZ" },
    { t: "quiz", q: "운영체제의 역할로 가장 알맞은 것은?", options: ["인터넷 주소를 만든다", "프로그램과 하드웨어 사이를 이어 주고 자원을 관리한다", "문서만 편집한다"], answer: 1, explain: "운영체제는 프로그램이 메모리·저장장치·장치를 쓸 수 있게 관리하는 기본 프로그램이에요." },
    { t: "quiz", q: "Windows에서 작업 관리자를 바로 여는 단축키는?", options: ["Ctrl+S", "Alt+F4", "Ctrl+Shift+Esc"], answer: 2, explain: "{{Ctrl+Shift+Esc}} 로 작업 관리자를 바로 열 수 있어요." },
    { t: "quiz", q: "macOS와 Linux에서 폴더를 나누는 기호는?", options: ["/", "\\", ":"], answer: 0, explain: "macOS와 Linux는 슬래시 `/` 를 써요. 역슬래시는 Windows 경로에서 써요." },
    { t: "quiz", q: "화면을 지우는 명령이 `clear` 인 터미널은?", options: ["PowerShell", "zsh 나 bash", "작업 관리자"], answer: 1, explain: "PowerShell은 `cls`, zsh와 bash는 `clear` 를 써요." },

    { t: "h", text: "오늘의 핵심 정리", sub: "이것만 기억해도 성공!", icon: "list-checks", kicker: "SUMMARY" },
    { t: "list", items: [
      "**운영체제**는 프로그램과 하드웨어를 이어 주는 관리인이에요",
      "대표 운영체제는 **Windows · macOS · Linux**",
      "실행 중인 프로그램은 **프로세스**, Windows는 {{Ctrl+Shift+Esc}}",
      "경로는 Windows `\\`, 나머지 `/` 이고 터미널도 달라요",
      "질문할 때는 **내 운영체제**를 함께 알려 줘요",
    ] },
    { t: "refs", items: [
      { title: "운영 체제 (위키백과)", url: "https://ko.wikipedia.org/wiki/%EC%9A%B4%EC%98%81_%EC%B2%B4%EC%A0%9C", desc: "운영체제의 개념과 역사를 더 읽어 봐요" },
      { title: "리눅스 (위키백과)", url: "https://ko.wikipedia.org/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4", desc: "서버에서 많이 쓰는 Linux 소개" },
      { title: "Windows 지원", url: "https://support.microsoft.com/ko-kr/windows", desc: "Windows 사용법을 공식 문서로 찾아봐요" },
    ] },
  ],
};
