"""파이썬 공부 사이트 - 의존성 없는 개발용 서버 (표준 라이브러리만 사용).

실행: python server.py  ->  http://localhost:3000
"""
import hashlib
import os
import json
import mimetypes
import re
import secrets
import string
import sqlite3
import time
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

ROOT = Path(__file__).parent
STATIC = ROOT / "static"
DB_PATH = Path(os.environ.get("DB_PATH") or ROOT / "data.db")
PORT = int(os.environ.get("PORT") or 3000)
HOST = "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1"   # 배포 환경(PORT 지정)에서는 외부 접속 허용
CATEGORIES = {"teacher_wanted": "강사 구해요", "teacher_offer": "강사 해요", "free": "자유게시판", "qna": "질문"}
SESSION_SECONDS = 60 * 60 * 24 * 14
LESSON_MAX = 18  # static/app.js 의 LESSONS 개수와 맞출 것
# 로그인해야 이용할 수 있는 페이지 (컴퓨터 기초 / 학습 / 커뮤니티). 로그인 안 했으면 홈으로 보내 로그인 창을 띄움
LOGIN_REQUIRED_PAGES = {"/basics.html", "/python.html", "/lesson.html", "/community.html"}


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with db() as c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS users(
              id INTEGER PRIMARY KEY, nickname TEXT UNIQUE NOT NULL,
              salt TEXT NOT NULL, pw_hash TEXT NOT NULL, created REAL NOT NULL);
            CREATE TABLE IF NOT EXISTS sessions(
              token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires REAL NOT NULL);
            CREATE TABLE IF NOT EXISTS posts(
              id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, category TEXT NOT NULL,
              title TEXT NOT NULL, body TEXT NOT NULL, created REAL NOT NULL);
            CREATE TABLE IF NOT EXISTS progress(
              user_id INTEGER NOT NULL, lesson INTEGER NOT NULL, done_at REAL NOT NULL,
              PRIMARY KEY(user_id, lesson));
            """
        )
        # 닉네임 중복 검사용 열: 대소문자·_ 제거·헷갈리는 글자(0/O, 1/l/I)를 같게 접은 값. 기존 회원도 채워 넣음
        cols = [r[1] for r in c.execute("PRAGMA table_info(users)")]
        if "nick_key" not in cols:
            c.execute("ALTER TABLE users ADD COLUMN nick_key TEXT")
        if "is_admin" not in cols:  # 관리자 계정 표시 (create_admin.py 로만 만들 수 있고, 일반 회원가입으로는 0)
            c.execute("ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0")
        for uid, nick in c.execute("SELECT id, nickname FROM users WHERE nick_key IS NULL").fetchall():
            c.execute("UPDATE users SET nick_key = ? WHERE id = ?", (nick_key(nick), uid))
        try:
            c.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nick_key ON users(nick_key)")
        except sqlite3.IntegrityError:
            print("경고: 기존 회원 중 비슷한 닉네임이 있어 중복 방지 인덱스를 만들지 못했어요. (새 가입은 코드에서 검사함)")


# ---------- 닉네임 규칙 ----------
# 운영진·공식 계정으로 오해될 수 있는 이름.
#  - STRONG: 앞이나 뒤에 붙어도 막음 (admin2026, kimadmin). badminton 같은 단어는 통과
#  - EXACT : 숫자·_ 를 빼고 정확히 같을 때만 막음 (root, root7 은 막고 Groot 은 통과)
RESERVED_STRONG_EN = ("admin", "administrator", "moderator", "pyschool")
RESERVED_EXACT_EN = ("root", "system", "staff", "official", "operator", "support", "master", "owner")
RESERVED_KO = ("관리자", "운영자", "운영진", "공식", "파이스쿨")
# 욕설·성적·혐오 표현. 숫자/_ 를 끼워 넣은 우회("시1발")도 같이 걸러냄
BAD_EN = ("fuck", "shit", "bitch", "cunt", "nigger", "nigga", "whore", "slut", "porn")
BAD_KO = ("시발", "씨발", "씨팔", "시팔", "씨빨", "시빨", "병신", "븅신", "개새끼", "개새키", "개세끼", "좆", "존나", "지랄", "느금",
          "니미", "닥쳐", "창녀", "섹스", "야동", "강간", "씹", "자지", "딸딸이", "맘충", "김치녀", "틀딱")
_CONFUSABLE = str.maketrans({"0": "o", "1": "l", "i": "l"})


def nick_key(nick):
    """중복 판정용으로 접은 값: 대소문자 무시, _ 제거, 0=o, 1=l=i=I 로 취급.
    (Kim / kim / K_im / KIM 은 같은 닉네임이고, Hello 와 HeIlo(대문자 아이) 처럼 눈으로 구분 안 되는 것도 같게 봄)"""
    return nick.lower().replace("_", "").translate(_CONFUSABLE)


def nickname_error(nick):
    """닉네임이 쓸 수 없는 것이면 (상태코드, 안내 문구), 괜찮으면 None."""
    if not re.fullmatch(r"[0-9A-Za-z가-힣_]{2,12}", nick):
        return 400, "닉네임은 2~12자의 한글/영문/숫자/_ 만 사용할 수 있어요."
    if not re.search(r"[A-Za-z가-힣]", nick):
        return 400, "닉네임에는 글자가 1개 이상 있어야 해요."
    key = nick_key(nick)
    plain = re.sub(r"[0-9_]", "", nick.lower())  # 숫자·_ 로 끼워 넣은 우회 방지 (원래 철자 그대로)
    plain_key = nick_key(plain)
    forms = {key, plain, plain_key}
    bad = BAD_KO + BAD_EN + tuple(nick_key(w) for w in BAD_EN)
    if any(w in f for f in forms for w in bad):
        return 400, "사용할 수 없는 닉네임이에요. 다른 닉네임을 써주세요."
    strong = RESERVED_STRONG_EN + tuple(nick_key(w) for w in RESERVED_STRONG_EN)
    exact = RESERVED_EXACT_EN + tuple(nick_key(w) for w in RESERVED_EXACT_EN)
    if (any(w in f for f in forms for w in RESERVED_KO)
            or any(f.startswith(w) or f.endswith(w) for f in forms for w in strong)
            or any(f == w for f in forms for w in exact)):
        return 400, "운영진이나 공식 계정으로 오해될 수 있는 닉네임은 쓸 수 없어요."
    return None


def password_error(pw):
    """회원가입 비밀번호 조건: 8자 이상, 대문자 1개 이상, 특수문자 1개 이상. 맞으면 None, 아니면 안내 문구."""
    if len(pw) < 8:
        return "비밀번호는 8자 이상이어야 해요."
    if not re.search(r"[A-Z]", pw):
        return "비밀번호에 대문자를 1개 이상 넣어주세요."
    if not any(ch in string.punctuation for ch in pw):
        return "비밀번호에 특수문자(! @ # $ 등)를 1개 이상 넣어주세요."
    return None


def hash_pw(password, salt):
    return hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 200_000).hex()


class Handler(BaseHTTPRequestHandler):
    server_version = "PyStudy/0.1"

    # ---------- helpers ----------
    def send_json(self, data, status=200, extra_headers=None):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        for k, v in (extra_headers or []):
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def error(self, msg, status=400):
        self.send_json({"error": msg}, status)

    def read_json(self):
        try:
            length = min(int(self.headers.get("Content-Length", 0)), 100_000)
            return json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError):
            return {}

    def token(self):
        jar = cookies.SimpleCookie(self.headers.get("Cookie", ""))
        return jar["session"].value if "session" in jar else None

    def current_user(self):
        t = self.token()
        if not t:
            return None
        with db() as c:
            return c.execute(
                "SELECT u.id, u.nickname FROM sessions s JOIN users u ON u.id = s.user_id "
                "WHERE s.token = ? AND s.expires > ?",
                (t, time.time()),
            ).fetchone()

    def start_session(self, user_id):
        t = secrets.token_urlsafe(32)
        with db() as c:
            c.execute("INSERT INTO sessions VALUES(?,?,?)", (t, user_id, time.time() + SESSION_SECONDS))
        return ("Set-Cookie", f"session={t}; Path=/; HttpOnly; SameSite=Lax; Max-Age={SESSION_SECONDS}" + ("; Secure" if os.environ.get("PORT") else ""))

    # ---------- routing ----------
    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/api/me":
            u = self.current_user()
            return self.send_json({"user": dict(u) if u else None})
        if url.path == "/api/posts":
            if not self.current_user():  # 커뮤니티는 로그인해야 이용: 글 목록도 주소로 직접 읽을 수 없게
                return self.error("로그인이 필요합니다.", 401)
            return self.list_posts(parse_qs(url.query))
        if url.path == "/api/progress":
            return self.get_progress()
        if url.path in LOGIN_REQUIRED_PAGES and not self.current_user():
            self.send_response(302)  # 홈으로 보내고, 로그인하면 원래 가려던 곳(next)으로 이동
            self.send_header("Location", "/?login=1&next=" + quote(self.path, safe=""))
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        self.serve_static(url.path)

    def do_POST(self):
        path = urlparse(self.path).path
        routes = {"/api/signup": self.signup, "/api/login": self.login,
                  "/api/logout": self.logout, "/api/posts": self.create_post,
                  "/api/progress": self.set_progress}
        (routes.get(path) or (lambda: self.error("Not found", 404)))()

    def do_DELETE(self):
        m = re.fullmatch(r"/api/posts/(\d+)", urlparse(self.path).path)
        if not m:
            return self.error("Not found", 404)
        u = self.current_user()
        if not u:
            return self.error("로그인이 필요합니다.", 401)
        with db() as c:
            cur = c.execute("DELETE FROM posts WHERE id = ? AND user_id = ?", (int(m[1]), u["id"]))
        self.send_json({"ok": cur.rowcount > 0})

    # ---------- auth ----------
    def signup(self):
        d = self.read_json()
        nick, pw = str(d.get("nickname", "")).strip(), str(d.get("password", ""))
        bad = nickname_error(nick)
        if bad:
            return self.error(bad[1], bad[0])
        msg = password_error(pw)
        if msg:
            return self.error(msg)
        salt = secrets.token_hex(16)
        try:
            with db() as c:
                cur = c.execute("INSERT INTO users(nickname,salt,pw_hash,created,nick_key) VALUES(?,?,?,?,?)",
                                (nick, salt, hash_pw(pw, salt), time.time(), nick_key(nick)))
                uid = cur.lastrowid
        except sqlite3.IntegrityError:
            return self.error("이미 사용 중이거나 비슷한 닉네임이에요.", 409)
        self.send_json({"user": {"id": uid, "nickname": nick}}, extra_headers=[self.start_session(uid)])

    def login(self):
        d = self.read_json()
        nick, pw = str(d.get("nickname", "")).strip(), str(d.get("password", ""))
        with db() as c:
            row = c.execute("SELECT * FROM users WHERE nickname = ? COLLATE NOCASE", (nick,)).fetchone()
        if not row or not secrets.compare_digest(hash_pw(pw, row["salt"]), row["pw_hash"]):
            return self.error("닉네임 또는 비밀번호가 올바르지 않아요.", 401)
        self.send_json({"user": {"id": row["id"], "nickname": row["nickname"]}},
                       extra_headers=[self.start_session(row["id"])])

    def logout(self):
        t = self.token()
        if t:
            with db() as c:
                c.execute("DELETE FROM sessions WHERE token = ?", (t,))
        self.send_json({"ok": True}, extra_headers=[("Set-Cookie", "session=; Path=/; Max-Age=0")])

    # ---------- community ----------
    def list_posts(self, q):
        cat = (q.get("category") or [""])[0]
        sql = ("SELECT p.id, p.category, p.title, p.body, p.created, u.nickname FROM posts p "
               "JOIN users u ON u.id = p.user_id ")
        args = []
        if cat in CATEGORIES:
            sql += "WHERE p.category = ? "
            args.append(cat)
        sql += "ORDER BY p.id DESC LIMIT 50"
        with db() as c:
            rows = [dict(r) for r in c.execute(sql, args)]
        self.send_json({"posts": rows, "categories": CATEGORIES})

    def create_post(self):
        u = self.current_user()
        if not u:
            return self.error("로그인이 필요합니다.", 401)
        d = self.read_json()
        cat, title, body = d.get("category"), str(d.get("title", "")).strip(), str(d.get("body", "")).strip()
        if cat not in CATEGORIES:
            return self.error("카테고리를 선택해주세요.")
        if not (1 <= len(title) <= 80) or not (1 <= len(body) <= 3000):
            return self.error("제목(80자 이내)과 내용(3000자 이내)을 입력해주세요.")
        with db() as c:
            cur = c.execute("INSERT INTO posts(user_id,category,title,body,created) VALUES(?,?,?,?,?)",
                            (u["id"], cat, title, body, time.time()))
        self.send_json({"id": cur.lastrowid}, 201)

    # ---------- progress ----------
    def get_progress(self):
        """내 완료 목록(로그인 시) + 가입자 수 + 과정별 완료 인원. 집계 숫자만 내보내 개인 기록은 드러나지 않음."""
        u = self.current_user()
        with db() as c:
            users = c.execute("SELECT COUNT(*) FROM users").fetchone()[0]
            counts = {str(r[0]): r[1] for r in c.execute("SELECT lesson, COUNT(*) FROM progress GROUP BY lesson")}
            mine = [r[0] for r in c.execute("SELECT lesson FROM progress WHERE user_id = ? ORDER BY lesson", (u["id"],))] if u else None
        self.send_json({"me": mine, "users": users, "counts": counts})

    def set_progress(self):
        u = self.current_user()
        if not u:
            return self.error("로그인이 필요합니다.", 401)
        d = self.read_json()
        ok = lambda v: [n for n in (v if isinstance(v, list) else []) if isinstance(n, int) and 1 <= n <= LESSON_MAX]
        add, rem = ok(d.get("add")), ok(d.get("remove"))
        with db() as c:
            c.executemany("INSERT OR IGNORE INTO progress VALUES(?,?,?)", [(u["id"], n, time.time()) for n in add])
            c.executemany("DELETE FROM progress WHERE user_id = ? AND lesson = ?", [(u["id"], n) for n in rem])
            mine = [r[0] for r in c.execute("SELECT lesson FROM progress WHERE user_id = ? ORDER BY lesson", (u["id"],))]
        self.send_json({"me": mine})

    # ---------- static ----------
    def serve_static(self, path):
        rel = "index.html" if path in ("", "/") else path.lstrip("/")
        f = (STATIC / rel).resolve()
        if STATIC.resolve() not in f.parents or not f.is_file():
            f = STATIC / "index.html"  # SPA-style fallback
        body = f.read_bytes()
        ctype = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", f"{ctype}; charset=utf-8" if ctype.startswith("text") or "javascript" in ctype else ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {fmt % args}")


if __name__ == "__main__":
    init_db()
    print(f"서버 시작: http://localhost:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
