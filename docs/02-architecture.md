# 아키텍처, 기술 스택

## 스택

`barogagi-front` 컨벤션 그대로 간다. 새 스택 쓰면 학습 비용이랑 리뷰 지연만 생긴다.

| 레이어 | 선택 |
|---|---|
| 빌드 | Vite 8 |
| 프레임워크 | React 19 + TypeScript 5.9 |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 상태 | Zustand 5 |
| 애니메이션 | Framer Motion 12 |
| 사주 계산 | lunar-typescript 1.8 (절기 테이블 내장, 의존성 0) |
| AI | @anthropic-ai/sdk (서버 사이드만) |
| 테스트 | Vitest 3 |
| 배포 | Vercel |

배제한 것

| 후보 | 이유 |
|---|---|
| Next.js | SEO 필요 없는 도구형 SPA. 팀 표준도 Vite |
| 자체 만세력 | 절기 시각은 천문 계산이라 직접 짜면 경계에서 틀린다 |
| Recharts | 레이더 하나 그리자고 60KB 못 쓴다. SVG 직접 |
| 백엔드 DB | v1은 서버 저장 안 한다. localStorage로 충분 |
| 클라이언트 직접 Claude 호출 | API 키 노출. 서버리스 프록시 경유 필수 |

## 시스템 구조

```
브라우저 (React SPA)
  store/teamStore      zustand + localStorage
  lib/saju/*           순수 함수, 결정론 계산
  lib/report/*         룰 기반 리포트 (AI 폴백)
        |
        | SajuFacts (간지, 오행, 십신만) / 생년월일 원본은 안 나감
        v  POST /api/interpret
Vercel Function (api/interpret.ts)
  입력 검증 (날짜 필드 있으면 400)
  에이전트 파이프라인 오케스트레이션
  가드레일 필터
  ANTHROPIC_API_KEY (서버 전용)
        |
        v  Claude API (claude-sonnet-5)
```

계산을 클라이언트에서 도는 이유

1. 생년월일이 네트워크를 안 탄다
2. 8명 계산이 100ms 미만이라 서버 왕복이 오히려 느리다
3. AI 키 없이도 앱이 완전히 돈다

## 디렉터리

```
team-saju/
  .claude/          AI 에이전트 개발 환경
    agents/  skills/  commands/  settings.json
  CLAUDE.md
  docs/
  api/interpret.ts  Claude 프록시 (Web 표준 Request/Response)
  src/
    lib/saju/       계산 엔진, 순수 함수만
      types.ts
      constants.ts       천간 지지 지장간 오행 테이블
      timeCorrection.ts  서머타임 + 진태양시
      chart.ts           입력을 SajuChart 로
      elements.ts        오행 분포, 강약
      tenGods.ts         십신
      team.ts            팀 합성, 페어 케미
    lib/report/       룰 기반 리포트, 유형(archetype) 정의
    lib/share/        공유 카드 캔버스 렌더링
    lib/ui/           오행 색, 일러스트 매핑 같은 화면용 상수
    store/teamStore.ts
    components/
      Common/   프리미티브. Button Card Chip Field Section 등. 색은 전부
                index.css 의 CSS 변수만 본다. 화면 코드는 여기 있는 것만 쓴다
      Layout/   AppHeader, AppNotice — App.tsx 껍데기 조각
      Saju/     팀 탭과 개인 탭이 같이 쓰는 도메인 컴포넌트
                SajuElementRadar, SajuElementBars, SajuPillarCard
      Input/    입력 화면. InputConsentModal, InputMemberForm, InputMemberList
      Loading/  LoadingView
      Result/   결과 화면. TeamHeadline, TeamIllustration, TeamAnalysis,
                TeamReportDetail, TeamShareCard, TeamReportView, PersonalView
    pages/      화면 단위 컨테이너. LandingPage, InputPage, LoadingPage, ResultPage
    App.tsx     헤더 + 화면 분기 + 하단 저장 고지만 남긴 얇은 껍데기
    index.css     Tailwind v4 + 디자인 토큰
  vite.config.ts  dev 서버용 API 미들웨어 포함
```

`components/` 바로 아래에는 파일을 두지 않는다. 전부 위 폴더 중 하나에 속하고,
각 폴더는 `index.ts` 배럴로 내보낸다. 이름은 접두로 소속을 드러낸다
(`Common`, `Saju`, `Input`, `Loading`, `Result`, `Team*`).

## 데이터 계약

```ts
// 앱 동의. localStorage 에 별도 저장
type AppConsent = {
  version: string    // 동의서 내용 바뀌면 올린다. 낮으면 재동의
  agreedAt: string
}

// 팀원 입력
type MemberInput = {
  id: string
  name: string
  birthDate: string          // 'YYYY-MM-DD'
  birthHour: number | null   // null 이면 시간 모름
  birthMinute: number
  calendar: 'solar' | 'lunar'
  isLeapMonth: boolean
  gender: 'male' | 'female'
  useTrueSolarTime: boolean
  consent: {
    source: 'self' | 'delegated'   // 본인 정보인가 대리 입력인가
    confirmedAt: string            // ISO datetime
  }
}

// 계산 결과, 결정론적
type SajuChart = {
  member: MemberInput
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null }
  dayMaster: { stem: Stem; element: Element; yinYang: YinYang }
  elements: ElementDistribution
  strength: { index: number; level: 'strong' | 'balanced' | 'weak' }
  tenGods: TenGodCount
  traits: TraitAxes                // 추진 기획 조율 실행 분석
  corrections: AppliedCorrection[] // 어떤 보정이 적용됐는지
}

// AI 로 넘기는 것. 생년월일 없음
type SajuFacts = {
  name: string
  pillars: string[]        // ['庚午','辛巳','丙申','乙未']
  dayMaster: string
  elementPercents: Record<Element, number>
  strengthLevel: string
  topTenGods: string[]
  traits: TraitAxes
}
```

## 개발 서버 API

Vercel Function을 로컬에서도 쓰려고 `vite.config.ts`에 dev 전용 미들웨어를 둔다.
`api/interpret.ts`는 Web 표준 `Request -> Response` 시그니처로 써서 Vercel Node 런타임이랑
Vite 미들웨어 양쪽에서 같은 코드가 돈다.

```
npm run dev     localhost:5173, 프론트 + /api/* 미들웨어
vercel deploy   정적 자산 + 서버리스 함수
```

## 보안

| 항목 | 처리 |
|---|---|
| `ANTHROPIC_API_KEY` | 서버 환경변수만. 클라이언트 번들에 절대 안 넣는다 |
| 생년월일 | 브라우저 밖으로 안 나감. localStorage 에만 저장 |
| 공유 링크 | 계산 결과만 담는다. 생년월일 원본은 URL 에 절대 안 넣는다 |
| 동의 | 최초 1회 앱 동의 + 팀원별 대리 입력 확인. 상세는 06-privacy.md |
| API 입력 검증 | `birthDate` 같은 원본 필드 감지되면 400 거부. 실수 방지 장치 |
| 로그 | 서버 로그에 요청 본문 안 남긴다 |
| 레이트리밋 | IP당 분당 10회 |
