# AI바이브웹 포트폴리오

바이브코딩으로 제작한 풀스택 웹 개발 포트폴리오 프로젝트입니다.

## 프로젝트 소개

AI 시대의 실용적 개발 역량을 소개하는 포트폴리오 웹사이트로, 바이브코딩의 정의, 전망, 교육과정에 대한 정보를 제공하고 커뮤니티 게시판 기능을 포함합니다.

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (Auth, Database)
- **Deployment**: Vercel
- **Version Control**: GitHub

## 주요 기능

### 1. 소개 페이지
- 바이브코딩 소개
- 커리큘럼 안내
- 기술스택 표시
- 기대효과 및 한계점 설명

### 2. 인증 시스템
- 이메일/비밀번호 회원가입
- 로그인/로그아웃
- 자동 로그인 유지 (선택)
- Supabase Auth 활용

### 3. 게시판 (CRUD)
- 게시글 작성 (로그인 필요)
- 게시글 목록 조회
- 게시글 상세보기
- 조회수 자동 증가
- 게시글 삭제 (작성자만)

### 4. 보안
- Row Level Security (RLS) 적용
- XSS 방지 (HTML 이스케이프)
- 권한 기반 접근 제어

## 설치 및 실행 방법

### 1. 저장소 클론
\`\`\`bash
git clone https://github.com/your-username/vibeweb.git
cd vibeweb
\`\`\`

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 테이블 생성:

\`\`\`sql
-- 게시판 테이블 생성
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_email TEXT NOT NULL,
    author_name TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
CREATE POLICY "누구나 조회 가능" ON posts FOR SELECT USING (true);
CREATE POLICY "로그인 사용자만 작성 가능" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "자기 글만 수정 가능" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "자기 글만 삭제 가능" ON posts FOR DELETE USING (auth.uid() = author_id);
\`\`\`

3. Supabase 프로젝트 설정에서 이메일 인증 비활성화 (선택사항):
   - Authentication → Settings
   - "Enable email confirmations" OFF

### 3. API 키 설정

1. \`js/supabase-config.example.js\` 파일을 복사하여 \`js/supabase-config.js\`로 이름 변경
2. Supabase 프로젝트 설정에서 API 키 복사:
   - Settings → API
   - Project URL 복사
   - anon/public key 복사
3. \`js/supabase-config.js\` 파일 수정:

\`\`\`javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
\`\`\`

### 4. 로컬 서버 실행

HTML 파일을 직접 열거나 로컬 서버를 사용하세요:

\`\`\`bash
# Python이 설치된 경우
python -m http.server 8000

# Node.js의 http-server가 설치된 경우
npx http-server
\`\`\`

브라우저에서 \`http://localhost:8000\` 접속

## 프로젝트 구조

\`\`\`
vibeweb/
├── index.html              # 메인 페이지
├── login.html              # 로그인 페이지
├── signup.html             # 회원가입 페이지
├── board.html              # 게시판 목록
├── board-write.html        # 게시글 작성
├── board-detail.html       # 게시글 상세
├── css/
│   └── style.css          # 전체 스타일시트
├── js/
│   ├── script.js          # 공통 스크립트
│   ├── supabase-config.js # Supabase 설정 (Git 제외)
│   ├── auth.js            # 인증 관리
│   ├── login.js           # 로그인 기능
│   ├── signup.js          # 회원가입 기능
│   ├── board.js           # 게시판 목록
│   ├── board-write.js     # 게시글 작성
│   └── board-detail.js    # 게시글 상세
└── README.md              # 프로젝트 설명서
\`\`\`

## 배포

Vercel을 사용하여 배포:

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 저장소 연결
3. 자동 배포

## 라이선스

MIT License

## 제작자

바이브코딩으로 제작한 포트폴리오 프로젝트
