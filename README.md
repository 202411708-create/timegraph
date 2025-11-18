# Focus Tracker - 집중도 추적기

ADHD 학생을 위한 자기점검 기반 집중도 추적 웹 애플리케이션입니다.

## 🎯 프로젝트 개요

**목적**: ADHD 학생의 자기점검 능력 향상
**핵심 원리**: 외부 기준 없이 스스로 기록하고 비교하는 과정

## 🎨 디자인

무인양품(MUJI) 스타일의 미니멀 디자인:
- 깔끔하고 집중을 방해하지 않는 UI
- ADHD 친화적 색상과 레이아웃
- 부드러운 애니메이션

## ✨ 주요 기능

### 1. 인트로 화면
- 자기점검 개념 설명
- 사용 방법 안내
- 예상 집중도 입력 (슬라이더)

### 2. 활성 추적 화면
- 5분마다 자동 알림
- 실시간 경과 시간 표시
- 진행률 및 미니 그래프
- 체크 횟수 추적

### 3. 체크 프롬프트
- 집중함/딴짓함 선택
- 소리 알림
- 1분 후 자동으로 "딴짓함" 기록

### 4. 결과 분석 화면
- 원형 진행률 차트
- 시간대별 그래프
- 통계 요약

### 5. 비교 및 인사이트
- 예상 vs 실제 비교
- 낭비 시간 TOP 3
- 자동 인사이트 생성
- JSON 내보내기

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **State**: Zustand (localStorage persist)

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 3. 프로덕션 빌드

```bash
npm run build
```

### 4. 프리뷰

```bash
npm run preview
```

## 📁 프로젝트 구조

```
Timegraph/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── MujiIcon.tsx
│   │   └── focus/
│   │       ├── IntroScreen.tsx
│   │       ├── ActiveTracker.tsx
│   │       ├── CheckPrompt.tsx
│   │       ├── ResultScreen.tsx
│   │       └── ComparisonScreen.tsx
│   ├── store/
│   │   └── focusStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## 🧪 사용 방법

### 1단계: 시작하기
1. 예상 집중도를 슬라이더로 설정 (0-100%)
2. "시작하기" 버튼 클릭

### 2단계: 세션 진행
1. 5분마다 알림 팝업 표시
2. "집중함" 또는 "딴짓함" 선택
3. 원하는 만큼 진행 후 "종료하기" 클릭

### 3단계: 결과 확인
1. 집중도 통계 확인
2. 시간대별 그래프 분석
3. "다음" 버튼 클릭

### 4단계: 비교 및 인사이트
1. 예상 vs 실제 비교
2. 낭비 시간 TOP 3 확인
3. 자동 생성된 인사이트 읽기
4. 필요시 JSON 내보내기
5. "새로 시작하기"로 다시 시작

## 💾 데이터 저장

- **자동 저장**: 모든 세션 데이터는 localStorage에 자동 저장
- **새로고침 안전**: 페이지를 새로고침해도 세션 유지
- **내보내기**: JSON 형식으로 결과 다운로드 가능

## 🎯 핵심 기능 상세

### 5분 타이머
- `setInterval`로 5분마다 자동 체크
- 개발 중 테스트를 위해 시간 조정 가능

### 알림 시스템
- Web Audio API로 beep 사운드 생성
- 브라우저 권한 필요 없음

### 자동 인사이트
- 아침/오후 집중도 비교
- 예상 대비 실제 차이 분석
- 집중도 패턴 감지

### 낭비 시간 분석
- 연속된 "딴짓함" 구간 감지
- 상위 3개 구간 표시
- 시간대와 기간 정보 제공

## 🌟 접근성

- 키보드 네비게이션 지원
- 명확한 색상 대비
- 반응형 디자인 (모바일, 태블릿, 데스크톱)

## 📱 반응형 지원

- **모바일**: 320px 이상
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상

## 🔧 개발 팁

### 테스트를 위한 시간 단축

`ActiveTracker.tsx`에서 인터벌 시간 조정:

```typescript
// 5분 → 10초로 변경 (테스트용)
const [nextCheckSeconds, setNextCheckSeconds] = useState(10)

// 체크 시간 계산 부분도 수정
if (elapsedSeconds > 0 && elapsedSeconds % 10 === 0) {
  setShowPrompt(true)
  playNotificationSound()
}
```

### localStorage 초기화

브라우저 개발자 도구 콘솔에서:

```javascript
localStorage.removeItem('focus-tracker-storage')
location.reload()
```

## 🎁 향후 개선 사항

- [ ] 다크 모드
- [ ] 인터벌 시간 커스터마이징
- [ ] 세션 히스토리
- [ ] CSV 내보내기
- [ ] PWA 지원
- [ ] 다국어 지원

## 📄 라이선스

MIT License

## 🙏 기여

이슈와 PR은 언제나 환영합니다!

---

**Made with ❤️ for ADHD students**
