"""관리자 계정 만들기 / 비밀번호 바꾸기.   실행: python create_admin.py [닉네임]   (기본 닉네임: admin)

- 비밀번호는 파일에 적지 않습니다. 실행하면 물어보고(입력 글자는 화면에 안 보임), 자동화할 때는 환경변수 ADMIN_PW 로 줄 수 있어요.
- 일반 회원가입에서는 admin 같은 이름을 쓸 수 없지만, 이 스크립트로는 관리자 계정을 만들 수 있어요.
- 이미 같은 관리자 계정이 있으면 비밀번호만 새로 바꿉니다.
- 서버(server.py)를 켠 채로 실행해도 됩니다.
"""
import getpass
import os
import secrets
import sys
import time

import server  # 같은 폴더의 server.py: 비밀번호 해시/닉네임 규칙을 그대로 사용


def main():
    nick = (sys.argv[1] if len(sys.argv) > 1 else "admin").strip()
    pw = os.environ.get("ADMIN_PW") or getpass.getpass(f"'{nick}' 계정의 비밀번호: ")
    msg = server.password_error(pw)  # 일반 회원과 같은 비밀번호 조건 (8자 이상, 대문자, 특수문자)
    if msg:
        sys.exit("만들지 못했어요: " + msg)
    server.init_db()
    key = server.nick_key(nick)
    salt = secrets.token_hex(16)
    with server.db() as c:
        row = c.execute("SELECT id, nickname, is_admin FROM users WHERE nick_key = ?", (key,)).fetchone()
        if row and not row["is_admin"]:
            sys.exit(f"만들지 못했어요: 같거나 비슷한 닉네임 '{row['nickname']}'(일반 회원)이 이미 있어요.")
        if row:
            c.execute("UPDATE users SET salt = ?, pw_hash = ? WHERE id = ?", (salt, server.hash_pw(pw, salt), row["id"]))
            c.execute("DELETE FROM sessions WHERE user_id = ?", (row["id"],))  # 비밀번호를 바꾸면 기존 로그인은 풀림
            print(f"관리자 '{row['nickname']}' 의 비밀번호를 바꿨어요. (기존 로그인은 모두 해제)")
        else:
            c.execute("INSERT INTO users(nickname, salt, pw_hash, created, nick_key, is_admin) VALUES(?,?,?,?,?,1)",
                      (nick, salt, server.hash_pw(pw, salt), time.time(), key))
            print(f"관리자 계정 '{nick}' 을(를) 만들었어요.")


if __name__ == "__main__":
    main()
