"""DB 내용 보기 (읽기 전용).  실행: python db_view.py

회원가입한 유저가 data.db 의 users 테이블에 들어갔는지 확인할 때 씁니다.
비밀번호 해시와 salt 는 보안상 화면에 내보내지 않습니다.
"""
import sqlite3
import sys
import time
from pathlib import Path

DB = Path(__file__).parent / "data.db"
CATEGORIES = {"teacher_wanted": "강사 구해요", "teacher_offer": "강사 해요", "free": "자유게시판", "qna": "질문"}


def fmt(ts):
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(ts))


def table(title, head, rows):
    print(f"\n■ {title} ({len(rows)}건)")
    if not rows:
        print("  (비어 있음)")
        return
    widths = [max(len(str(x)) for x in col) for col in zip(head, *rows)]
    line = lambda r: "  " + "  ".join(str(x).ljust(w) for x, w in zip(r, widths))
    print(line(head))
    print("  " + "  ".join("-" * w for w in widths))
    for r in rows:
        print(line(r))


def main():
    if not DB.exists():
        sys.exit(f"{DB.name} 파일이 아직 없어요. 서버(python server.py)를 한 번 실행하면 만들어져요.")
    c = sqlite3.connect(f"file:{DB.as_posix()}?mode=ro", uri=True)  # 읽기 전용으로 열어 실수로 바꾸지 않게 함
    users = c.execute(
        """SELECT u.id, u.nickname, u.created, u.is_admin,
                  (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id),
                  (SELECT COUNT(*) FROM progress g WHERE g.user_id = u.id)
           FROM users u ORDER BY u.id"""
    ).fetchall()
    table("회원 (users)", ["id", "닉네임", "구분", "가입일시", "작성한 글", "완료한 과정"],
          [(i, n, "관리자" if a else "회원", fmt(t), p, g) for i, n, t, a, p, g in users])
    posts = c.execute(
        "SELECT p.id, u.nickname, p.category, p.title, p.created FROM posts p JOIN users u ON u.id = p.user_id ORDER BY p.id DESC LIMIT 20"
    ).fetchall()
    table("최근 커뮤니티 글 (posts)", ["id", "작성자", "분류", "제목", "작성일시"],
          [(i, n, CATEGORIES.get(cat, cat), t[:24], fmt(ts)) for i, n, cat, t, ts in posts])
    live = c.execute("SELECT COUNT(*) FROM sessions WHERE expires > ?", (time.time(),)).fetchone()[0]
    print(f"\n■ 로그인 중인 세션: {live}개")


if __name__ == "__main__":
    main()
