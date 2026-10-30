LESSON_CONTENT[9] = {
  minutes: 30,
  intro: "값에 이름을 붙여 저장하는 ‘변수’를 배워요. 자료형, 형 변환, f-string 까지 익히고 나를 소개하는 프로그램을 만들어요.",
  goals: ["변수에 값을 넣고 바꾼다", "int, float, str, bool 자료형을 구분한다", "f-string 으로 변수를 글 속에 넣는다"],
  blocks: [
    { t: "h", text: "변수란? 이름표 붙은 상자", sub: "값을 담아 두고 이름으로 꺼내 써요", icon: "archive" },
    { t: "p", text: "프로그램은 값을 기억해야 할 때가 많아요. **변수**는 값을 담아 두는 ==이름표 붙은 상자==예요." },
    { t: "p", text: "상자에 이름표(`age`)가 붙어 있으면 값(`25`)을 다시 찾기 쉬워요. 이름만 부르면 안의 값을 꺼내 줘요." },
    { t: "boxes", items: [
      { name: "age", value: "25", type: "int" },
      { name: "name", value: "'철수'", type: "str" },
      { name: "height", value: "172.5", type: "float" },
    ], cap: "변수는 값을 담은 이름표 붙은 상자" },

    { t: "h", text: "= 는 ‘같다’가 아니라 ‘넣는다’", sub: "오른쪽 값을 왼쪽 이름에 넣어요", icon: "arrow-right" },
    { t: "p", text: "`=` 는 수학의 ‘같다’가 아니에요. ==오른쪽 값을 왼쪽 상자에 넣는다==는 뜻이에요. 이것을 **대입**이라고 해요." },
    { t: "anat", parts: [
      { code: "age", label: "변수 이름", sub: "상자의 이름표" },
      { code: "=", label: "넣기", sub: "오른쪽 → 왼쪽" },
      { code: "25", label: "값", sub: "상자에 담길 것", hl: true },
    ] },
    { t: "code", file: "var.py", py: true, text: 'name = "철수"\nage = 15\nprint(name)\nprint(age)', out: "철수\n15" },

    { t: "editor", title: "미션", task: "`name` 에 `\"별이\"`, `age` 에 `12` 를 넣고, `print(name, age)` 로 출력해 보세요.",
      code: "# 여기에 쓰세요\n",
      expect: "별이 12",
      solution: 'name = "별이"\nage = 12\nprint(name, age)',
      hint: "글자는 따옴표로 감싸고, 숫자는 그냥 써요. 변수 이름에는 따옴표가 없어요." },

    { t: "h", text: "값 바꾸기와 갱신", sub: "상자 속 내용은 언제든 바꿀 수 있어요", icon: "rotate-ccw" },
    { t: "p", text: "같은 이름에 다시 `=` 로 넣으면 **새 값으로 바뀌어요**. 이름표 이름 `variable`(변하는 것)이 그래서 붙었어요." },
    { t: "p", text: "`score = score + 10` 은 ==현재 값에 10 을 더해서 다시 넣기==예요. 오른쪽이 먼저 계산돼요." },
    { t: "code", file: "score.py", py: true, text: 'score = 50\nprint(score)\nscore = 80\nprint(score)\nscore = score + 10\nprint(score)', out: "50\n80\n90" },
    { t: "flow", items: ["score 는 80", "score 를 읽기", "80 + 10 = 90", "score 에 90 넣기", { t: "score 는 90", k: "end" }] },

    { t: "h", text: "두 값 바꿔치기", sub: "빈 컵(temp) 하나를 빌려요", icon: "workflow" },
    { t: "p", text: "컵 두 개의 음료를 서로 바꾸려면 **빈 컵**이 하나 필요하죠? 변수도 같아요. 임시 상자 `temp` 를 쓰면 안전하게 바꿀 수 있어요." },
    { t: "code", file: "swap.py", py: true, text: 'a = 1\nb = 2\ntemp = a\na = b\nb = temp\nprint(a, b)', out: "2 1" },
    { t: "editor", title: "직접 해보기", task: "`a` 와 `b` 의 처음 값을 바꿔 보고, 바꿔치기가 잘 되는지 확인해 보세요.",
      code: 'a = 1\nb = 2\ntemp = a\na = b\nb = temp\nprint(a, b)',
      hint: "`temp = a` 를 지우고 실행하면 어떻게 될까요?" },

    { t: "h", text: "변수 이름 짓기", sub: "규칙을 지키고, 뜻이 보이게 지어요", icon: "bookmark-check" },
    { t: "tip", text: "대문자와 소문자는 **다르게** 봐요. `age` 와 `Age` 는 서로 다른 변수예요." },
    { t: "table", head: ["이름", "가능?", "이유"], rows: [
      ["`age`", "O", "영어 소문자"],
      ["`my_score`", "O", "단어 사이는 `_` 로 이어요"],
      ["`score2`", "O", "숫자는 뒤에 올 수 있어요"],
      ["`2score`", "X", "숫자로 시작할 수 없어요"],
      ["`my score`", "X", "공백은 쓸 수 없어요"],
      ["`my-score`", "X", "`-` 는 쓸 수 없어요"],
      ["`x` / `data`", "△", "되지만 뜻이 안 보여요. `age` 처럼 지어요"],
    ] },

    { t: "h", text: "자료형 4가지", sub: "값에도 종류가 있어요", icon: "layout-grid" },
    { t: "p", text: "값은 종류에 따라 다르게 다뤄요. 처음에는 ==네 가지==만 알면 돼요." },
    { t: "table", head: ["자료형", "뜻", "예"], rows: [
      ["`int`", "정수", "`25`, `-3`, `0`"],
      ["`float`", "소수", "`3.14`, `172.5`"],
      ["`str`", "문자열(글자)", "`\"안녕\"`, `'a'`"],
      ["`bool`", "참 또는 거짓", "`True`, `False`"],
    ] },
    { t: "tip", text: "`bool` 값은 **첫 글자를 대문자**로 써요. `true` 가 아니라 `True` 예요." },

    { t: "h", text: "type(): 값의 종류 확인", sub: "헷갈릴 때 물어보면 알려 줘요", icon: "search" },
    { t: "p", text: "`type()` 은 값이나 변수의 자료형을 알려 주는 함수예요. 따옴표가 있으면 숫자처럼 보여도 `str` 이에요." },
    { t: "code", file: "type.py", py: true, text: 'print(type(25))\nprint(type(3.14))\nprint(type("25"))\nprint(type(True))', out: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>" },
    { t: "editor", title: "직접 해보기", task: "여러 값을 `type()` 에 넣어 보세요. `\"7\"` 과 `7` 은 어떻게 다를까요?",
      code: 'print(type(7))\nprint(type("7"))\nprint(type(7.0))',
      hint: "`type(False)`, `type(\"True\")` 도 해 보세요." },

    { t: "h", text: "자료형 바꾸기", sub: "int() float() str()", icon: "wand-sparkles" },
    { t: "p", text: "값을 다른 종류로 바꿀 수 있어요. ==이름이 곧 바꿀 종류==예요." },
    { t: "list", items: [
      "`int(3.9)` → 정수로 (소수점 아래는 **버려요**)",
      "`float(3)` → 소수로",
      "`str(25)` → 글자로",
    ] },
    { t: "code", file: "convert.py", py: true, text: 'print(int(3.9))\nprint(float(3))\nprint(str(25) + "살")\nprint(int("12") + 5)', out: "3\n3.0\n25살\n17" },

    { t: "h", text: "왜 \"3\" + 4 는 안 될까?", sub: "글자와 숫자는 섞어 더할 수 없어요", icon: "triangle-alert" },
    { t: "p", text: "`\"3\"` 은 글자, `4` 는 숫자예요. 파이썬은 둘을 더하는 방법을 몰라서 ==TypeError== 를 내요. 종류를 맞춰 주면 돼요." },
    { t: "compare", left: { file: "오류 (TypeError)", text: 'print("3" + 4)' }, right: { file: "숫자로 바꿔서", text: 'print(int("3") + 4)' } },
    { t: "editor", title: "미션", task: "`x` 는 글자 `\"3\"` 이에요. `int()` 로 숫자로 바꿔서 `7` 이 출력되게 고쳐 보세요.",
      code: 'x = "3"\n# 아래 줄을 고쳐요\nprint(x + 4)',
      expect: "7",
      solution: 'x = "3"\nprint(int(x) + 4)',
      hint: "`x` 를 `int(x)` 로 바꾸면 돼요." },

    { t: "h", text: "f-string: 글 속에 변수 넣기", sub: "따옴표 앞에 f, 값 자리는 { }", icon: "sparkles" },
    { t: "p", text: "따옴표 앞에 `f` 를 붙이고 변수를 **중괄호 { }** 에 넣으면 값이 글 속에 쏙 들어가요. ==숫자와 글자를 섞을 때 가장 편한 방법==이에요." },
    { t: "code", file: "fstring.py", py: true, text: 'name = "철수"\nage = 15\nprint(f"{name}는 {age}살이에요")\nprint(f"내년에는 {age + 1}살!")', out: "철수는 15살이에요\n내년에는 16살!" },
    { t: "editor", title: "미션", task: "f-string 으로 `별이는 12살이에요` 를 출력해 보세요. 변수는 이미 만들어져 있어요.",
      code: 'name = "별이"\nage = 12\n# 여기에 쓰세요',
      expect: "별이는 12살이에요",
      solution: 'name = "별이"\nage = 12\nprint(f"{name}는 {age}살이에요")',
      hint: "`print(f\"{name}는 ...\")` 모양이에요. 따옴표 앞의 `f` 를 잊지 마세요." },

    { t: "h", text: "글자 이어 붙이기와 반복", sub: "+ 로 잇고 * 로 되풀이해요", icon: "copy" },
    { t: "p", text: "글자끼리 `+` 로 **이어 붙일** 수 있고, 글자에 숫자를 `*` 하면 그만큼 **반복**돼요. 선을 그릴 때 정말 편해요." },
    { t: "code", file: "str_op.py", py: true, text: 'print("ab" * 3)\nprint("안녕" + " " + "파이썬")\nprint("-" * 10)', out: "ababab\n안녕 파이썬\n----------" },
    { t: "editor", title: "직접 해보기", task: "글자와 반복 횟수를 바꿔서 나만의 장식 줄을 만들어 보세요.",
      code: 'print("*" * 15)\nprint("파이" + "썬")\nprint("=-" * 8)',
      hint: "`+` 는 글자끼리, `*` 는 글자와 숫자 사이에 써요." },

    { t: "h", text: "미니 프로젝트: 내 소개 만들기", sub: "변수 + f-string + 문자열 반복", icon: "rocket" },
    { t: "p", text: "정보를 **변수**에 담아 두고, f-string 으로 꺼내 쓰면 ==값만 바꿔서 누구의 카드든== 만들 수 있어요." },
    { t: "code", file: "intro.py", py: true, text: `name = "파이"
age = 10
hobby = "코딩"
print("-" * 10)
print(f"이름: {name}")
print(f"나이: {age}살")
print(f"취미: {hobby}")
print("-" * 10)`, out: `----------
이름: 파이
나이: 10살
취미: 코딩
----------` },
    { t: "editor", title: "미션", task: "위 코드를 참고해서 이름 `별이`, 나이 `12`, 취미 `독서` 로 소개를 출력해 보세요.",
      code: "# 여기에 쓰세요\n",
      expect: "----------\n이름: 별이\n나이: 12살\n취미: 독서\n----------",
      solution: 'name = "별이"\nage = 12\nhobby = "독서"\nprint("-" * 10)\nprint(f"이름: {name}")\nprint(f"나이: {age}살")\nprint(f"취미: {hobby}")\nprint("-" * 10)',
      hint: "변수 세 개를 먼저 만들고, 선 - 정보 세 줄 - 선 순서로 출력해요." },

    { t: "h", text: "확인 퀴즈", sub: "배운 내용을 점검해 봐요", icon: "circle-help", kicker: "QUIZ" },
    { t: "quiz", q: "`score = 70` 에서 `=` 의 뜻은?", options: ["두 값이 같다", "70 을 score 에 넣는다", "score 와 70 을 비교한다"], answer: 1, explain: "`=` 는 오른쪽 값을 왼쪽 변수에 넣는(대입) 기호예요." },
    { t: "quiz", q: "사용할 수 없는 변수 이름은?", options: ["my_age", "age2", "2age"], answer: 2, explain: "변수 이름은 숫자로 시작할 수 없어요." },
    { t: "quiz", q: "`type(\"25\")` 의 결과는?", options: ["int", "str", "float"], answer: 1, explain: "따옴표로 감싸면 숫자처럼 보여도 글자(str)예요." },
    { t: "quiz", q: "`n = 5` 일 때 `print(f\"{n}개\")` 의 출력은?", options: ["{n}개", "n개", "5개"], answer: 2, explain: "f-string 에서는 { } 안의 변수가 값으로 바뀌어요." },

    { t: "h", text: "오늘의 핵심 정리", sub: "이것만 기억해도 성공!", icon: "list-checks", kicker: "SUMMARY" },
    { t: "list", items: [
      "변수 = **이름표 붙은 상자**, `=` 는 **넣기**",
      "`score = score + 10` → 현재 값에 더해 **다시 넣기**",
      "자료형: **int · float · str · bool**, 확인은 `type()`",
      "바꾸기: `int()` `float()` `str()`, 글자+숫자는 안 돼요",
      "`f\"{변수}\"` 로 글 속에 값 넣기, `\"-\" * 10` 은 반복",
    ] },
    { t: "refs", items: [
      { title: "파이썬 공식 튜토리얼: 간단 소개", url: "https://docs.python.org/ko/3/tutorial/introduction.html", desc: "숫자와 문자열을 더 자세히" },
      { title: "파이썬 기본 자료형 (공식 문서)", url: "https://docs.python.org/ko/3/library/stdtypes.html", desc: "int, float, str, bool 의 모든 것" },
      { title: "Python Tutor", url: "https://pythontutor.com/", desc: "변수 상자가 바뀌는 모습을 눈으로 확인" },
    ] },
  ],
};
