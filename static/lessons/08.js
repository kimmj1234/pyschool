LESSON_CONTENT[8] = {
  minutes: 30,
  intro: "print() 를 제대로 써 봐요. 글자와 숫자, 여러 값 출력, 줄바꿈과 특수 문자까지 익히고 자기소개 카드를 만들어요.",
  goals: ["print() 로 글자와 숫자를 출력한다", "sep, end, 이스케이프 문자를 쓴다", "자기소개 카드를 출력하는 첫 프로그램을 만든다"],
  blocks: [
    { t: "h", text: "print() 다시 보기", sub: "‘함수’는 괄호로 부르는 명령이에요", icon: "terminal" },
    { t: "p", text: "과정 7에서 `print()` 를 처음 썼죠? `print` 처럼 **이름 뒤에 괄호 ()** 를 붙여 부르는 명령을 **함수**라고 해요." },
    { t: "p", text: "지금은 ==‘괄호 안에 값을 넣고 부르면 일을 해 주는 명령’== 정도로만 알면 충분해요." },
    { t: "anat", parts: [
      { code: "print", label: "함수 이름", sub: "출력해줘!" },
      { code: "(", label: "여는 괄호", sub: "값을 넣는 입구" },
      { code: '"안녕"', label: "넣은 값", sub: "화면에 나올 내용", hl: true },
      { code: ")", label: "닫는 괄호", sub: "입구 닫기" },
    ] },
    { t: "code", file: "hello.py", py: true, text: 'print("안녕")\nprint("반가워")', out: "안녕\n반가워" },

    { t: "h", text: "글자와 숫자는 달라요", sub: "따옴표가 있으면 글자, 없으면 숫자", icon: "hash" },
    { t: "p", text: "따옴표로 감싸면 **글자 그대로** 나와요. 따옴표 없이 숫자를 쓰면 컴퓨터가 **계산**해서 결과를 보여 줘요." },
    { t: "key", text: "`print(3 + 4)` 는 ==7==, `print(\"3 + 4\")` 는 ==3 + 4== 가 나와요." },
    { t: "code", file: "quote.py", py: true, text: 'print(3 + 4)\nprint("3 + 4")', out: "7\n3 + 4" },
    { t: "editor", title: "직접 해보기", task: "숫자를 바꿔 보고, 따옴표를 붙였다 떼었다 하면서 결과가 어떻게 달라지는지 살펴보세요.",
      code: 'print(10 + 5)\nprint("10 + 5")',
      hint: "따옴표를 지우면 계산, 붙이면 글자 그대로예요." },

    { t: "h", text: "쉼표로 여러 값 출력하기", sub: "값 사이에 공백이 저절로 들어가요", icon: "pen-line" },
    { t: "p", text: "`print()` 안에 값을 **쉼표(,)** 로 이어 쓰면 한 줄에 같이 나와요. 값 사이에는 ==공백 한 칸==이 자동으로 들어가요." },
    { t: "tip", text: "글자와 숫자를 섞어도 괜찮아요. 쉼표로 이으면 알아서 이어 붙여 줘요." },
    { t: "code", file: "comma.py", py: true, text: 'print("이름:", "철수")\nprint("나이:", 15, "살")\nprint(1, 2, 3)', out: "이름: 철수\n나이: 15 살\n1 2 3" },

    { t: "h", text: "직접 해보기: 쉼표로 이어 쓰기", sub: "미션!", icon: "pencil" },
    { t: "p", text: "배운 것을 바로 써 볼게요. 값 사이에 쉼표만 넣으면 돼요." },
    { t: "editor", title: "미션", task: "`print()` 하나로 `파이썬 3 일째` 를 출력해 보세요. 글자 `\"파이썬\"`, 숫자 `3`, 글자 `\"일째\"` 를 쉼표로 이어요.",
      code: "# 여기에 쓰세요\n",
      expect: "파이썬 3 일째",
      solution: 'print("파이썬", 3, "일째")',
      hint: "`print(\"파이썬\", 3, \"일째\")` 처럼 값 사이에 쉼표를 써요. 숫자에는 따옴표를 붙이지 않아요." },

    { t: "h", text: "sep 과 end", sub: "사이 글자와 끝 글자를 바꿔요", icon: "wrench" },
    { t: "p", text: "`sep` 은 값 **사이**에 넣을 글자, `end` 는 출력이 끝난 **뒤**에 붙일 글자예요. ==기본값은 sep=공백, end=줄바꿈==이에요." },
    { t: "p", text: "`end=\"\"` 처럼 바꾸면 줄을 바꾸지 않고 다음 출력이 **바로 이어져요**." },
    { t: "code", file: "sep_end.py", py: true, text: 'print("2025", "01", "15", sep="-")\nprint("로딩", end="...")\nprint("완료")', out: "2025-01-15\n로딩...완료" },

    { t: "h", text: "직접 해보기: sep 쓰기", sub: "미션!", icon: "pencil" },
    { t: "p", text: "값 사이의 공백 대신 다른 글자를 넣어 볼까요?" },
    { t: "editor", title: "미션", task: "`sep` 을 써서 전화번호 `010-1234-5678` 이 나오게 해 보세요. 값은 `\"010\"`, `\"1234\"`, `\"5678\"` 세 개예요.",
      code: "# 여기에 쓰세요\n",
      expect: "010-1234-5678",
      solution: 'print("010", "1234", "5678", sep="-")',
      hint: "값 세 개를 쉼표로 쓴 다음 맨 끝에 `sep=\"-\"` 를 붙여요." },

    { t: "h", text: "따옴표 종류와 여러 줄 글", sub: "작은따옴표, 큰따옴표, 세 겹 따옴표", icon: "message-square-more" },
    { t: "p", text: "`'` 와 `\"` 는 똑같이 쓸 수 있어요. 글 안에 따옴표가 들어 있으면 **다른 종류**로 감싸면 돼요." },
    { t: "p", text: "여러 줄은 **따옴표 세 개**(`\"\"\"`)로 감싸요. 쓴 모양 그대로 줄이 바뀌어요." },
    { t: "code", file: "quotes.py", py: true, text: `print('작은따옴표')
print("It's fine")
print('그가 "안녕" 했어요')
print("""첫째 줄
둘째 줄""")`, out: `작은따옴표
It's fine
그가 "안녕" 했어요
첫째 줄
둘째 줄` },
    { t: "editor", title: "직접 해보기", task: "세 겹 따옴표 안의 글을 바꿔서 나만의 시를 세 줄로 써 보세요.",
      code: 'print("""봄이 오면\n꽃이 피고\n나는 코딩해요""")',
      hint: "따옴표 세 개로 열고 세 개로 닫기만 하면 몇 줄이든 괜찮아요." },

    { t: "h", text: "특수 문자: 역슬래시 \\", sub: "눈에 안 보이는 글자를 쓰는 방법", icon: "keyboard" },
    { t: "p", text: "역슬래시(`\\`) 뒤에 글자를 붙이면 **특별한 뜻**이 돼요. 이런 것을 **이스케이프 문자**라고 해요." },
    { t: "table", head: ["쓰는 법", "뜻"], rows: [
      ["`\\n`", "줄바꿈"],
      ["`\\t`", "탭(넓은 공백)"],
      ["`\\\\`", "역슬래시 `\\` 자체"],
      ["`\\\"`", "큰따옴표 `\"` 자체"],
    ] },
    { t: "code", file: "escape.py", py: true, text: `print("첫째\\n둘째")
print("이름\\t나이")
print("C:\\\\폴더")
print("그는 \\"안녕\\" 했어요")`, out: `첫째
둘째
이름\t나이
C:\\폴더
그는 "안녕" 했어요` },

    { t: "h", text: "직접 해보기: 줄바꿈 문자", sub: "한 번의 print 로 여러 줄", icon: "pencil" },
    { t: "p", text: "`\\n` 을 쓰면 `print()` 한 번으로 여러 줄을 출력할 수 있어요. 아래 코드를 바꿔 가며 실험해 보세요." },
    { t: "editor", title: "직접 해보기", task: "`\\n` 과 `\\t` 를 넣고 빼면서 결과를 관찰해 보세요.",
      code: 'print("1층\\n2층\\n3층")\nprint("A\\tB\\tC")',
      hint: "`\\n` 은 줄바꿈, `\\t` 는 탭이에요. 역슬래시 방향을 헷갈리지 마세요." },

    { t: "h", text: "초보자가 가장 자주 하는 실수 3가지", sub: "빨간 오류 메시지가 나올 때 확인해요", wide: true, icon: "triangle-alert" },
    { t: "p", text: "오류가 나면 겁먹지 말고 **마지막 줄**을 읽어요. 아래 세 가지가 가장 흔해요." },
    { t: "compare", left: { file: "1. 따옴표를 안 닫음 (SyntaxError)", text: 'print("안녕)' }, right: { file: "고친 코드", text: 'print("안녕")' } },
    { t: "compare", left: { file: "2. 괄호를 안 닫음 (SyntaxError)", text: 'print("안녕"' }, right: { file: "고친 코드", text: 'print("안녕")' } },
    { t: "compare", left: { file: "3. 따옴표를 빼먹음 (NameError)", text: 'print(안녕)' }, right: { file: "고친 코드", text: 'print("안녕")' } },

    { t: "h", text: "미니 프로젝트: 자기소개 카드", sub: "틀을 먼저 읽어 봐요", icon: "rocket" },
    { t: "p", text: "`print()` 를 여러 줄 쓰면 **테두리가 있는 카드**를 만들 수 있어요. 이 카드는 ==위아래 선 + 가운데 정보 세 줄==로 이루어져 있어요." },
    { t: "tip", text: "한 줄씩 `print()` 를 쓰면, 쓴 순서대로 위에서 아래로 출력돼요." },
    { t: "code", file: "card.py", py: true, text: `print("==============")
print(" 이름 : 파이")
print(" 취미 : 코딩")
print(" 목표 : 개발자")
print("==============")`, out: `==============
 이름 : 파이
 취미 : 코딩
 목표 : 개발자
==============` },

    { t: "h", text: "미니 프로젝트: 내 카드 만들기", sub: "미션!", icon: "pencil" },
    { t: "p", text: "앞 화면의 틀을 활용해 나만의 카드를 완성해 봐요." },
    { t: "editor", title: "미션", task: "같은 모양으로 이름 `별이`, 취미 `독서`, 목표 `작가` 인 카드를 출력해 보세요. 줄 앞의 공백 한 칸도 똑같이 맞춰요.",
      code: "# 여기에 쓰세요\n",
      expect: "==============\n 이름 : 별이\n 취미 : 독서\n 목표 : 작가\n==============",
      solution: 'print("==============")\nprint(" 이름 : 별이")\nprint(" 취미 : 독서")\nprint(" 목표 : 작가")\nprint("==============")',
      hint: "앞 화면의 코드에서 이름, 취미, 목표 글자만 바꾸면 돼요." },

    { t: "h", text: "확인 퀴즈", sub: "배운 내용을 점검해 봐요", icon: "circle-help", kicker: "QUIZ" },
    { t: "quiz", q: "`print(2 + 3)` 의 출력은?", options: ["2 + 3", "5", "23"], answer: 1, explain: "따옴표가 없으면 계산해서 결과인 5 를 보여 줘요." },
    { t: "quiz", q: "`print(\"가\", \"나\", sep=\"-\")` 의 출력은?", options: ["가 나", "가나", "가-나"], answer: 2, explain: "`sep` 은 값 사이에 넣을 글자예요. 기본 공백 대신 `-` 가 들어가요." },
    { t: "quiz", q: "줄바꿈을 뜻하는 이스케이프 문자는?", options: ["\\t", "\\\\", "\\n"], answer: 2, explain: "`\\n` 이 줄바꿈, `\\t` 는 탭, `\\\\` 는 역슬래시예요." },
    { t: "quiz", q: "`print(\"안녕)` 에서 나는 오류의 원인은?", options: ["따옴표를 닫지 않았다", "괄호를 두 번 썼다", "숫자를 썼다"], answer: 0, explain: "여는 따옴표와 짝이 맞는 닫는 따옴표가 없어서 SyntaxError 가 나요." },

    { t: "h", text: "오늘의 핵심 정리", sub: "이것만 기억해도 성공!", icon: "list-checks", kicker: "SUMMARY" },
    { t: "list", items: [
      "함수 = **이름 뒤에 ()** 를 붙여 부르는 명령",
      "따옴표 있음 = **글자**, 없음 = **숫자(계산)**",
      "쉼표로 여러 값 출력, `sep` 은 **사이**, `end` 는 **끝**",
      "여러 줄은 `\"\"\"`, 특수 문자는 `\\n` `\\t` `\\\\` `\\\"`",
      "오류가 나면 **마지막 줄**과 따옴표·괄호 짝을 확인",
    ] },
    { t: "refs", items: [
      { title: "파이썬 공식 튜토리얼: 간단 소개", url: "https://docs.python.org/ko/3/tutorial/introduction.html", desc: "문자열과 print 를 더 자세히" },
      { title: "파이썬 내장 함수 목록", url: "https://docs.python.org/ko/3/library/functions.html", desc: "print() 의 모든 옵션이 나와 있어요" },
      { title: "Python Tutor", url: "https://pythontutor.com/", desc: "코드가 실행되는 순서를 눈으로 확인" },
    ] },
  ],
};
