# MapMemo Frontend

React + Vite + TypeScript 기반으로 구현된 지도 메모 서비스의 프론트엔드 프로젝트입니다.  
사용자는 네이버 지도를 통해 위치를 선택하고, 해당 위치에 메모(제목/내용)를 등록하여 저장할 수 있습니다.

---

## 🚀 주요 기능

### 지도 & 마커
- 네이버 지도 렌더링
- 지도 클릭 시 마커 생성
- 마커 위치 기반 메모 저장(title, content)
- 저장된 마커 전체 조회 후 지도에 표시

### 사용자 인증
- 로그인 / 로그아웃
- JWT 기반 인증
- 로그인 여부에 따른 UI 제어
- 로그아웃 시 알림 표시 ("로그아웃했습니다")

### UI/UX
- 지도 페이지는 로그인하지 않아도 접근 가능
- 단, 메모 등록 및 조회는 로그인 후 가능

---

## 🧰 기술 스택

- **React (Vite)**
- **TypeScript**
- **Axios**
- **NAVER Maps JavaScript API**

---

## 📁 프로젝트 구조
src/
├── components/
├── pages/
├── services/
├── hooks/
├── types/
└── main.tsx

---

## 🔌 API 연동

| 기능 | Method | Endpoint |
|------|--------|----------|
| 로그인 | POST | /api/auth/login |
| 회원가입 | POST | /api/auth/signup |
| 로그아웃 | POST | /api/auth/logout |
| 마커 조회 | GET | /api/memos/my |
| 마커 등록 | POST | /api/memos |

/Users/sangho/Desktop/mapmemo-frontend/README.md