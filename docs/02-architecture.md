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
| 백엔드 DB | v1은 아무데도 저장 안 한다. 저장할 게 없으면 샐 것도 없다 |
| 클라이언트 직접 Claude 호출 | API 키 노출. 서버리스 프록시 경유 필수 |

## 시스템 구조

```
브라우저 (React SPA)
  store/teamStore      zustand. 메모리에만 있고 새로고침하면 비워진다
                       에러는 화면마다 띄울 자리가 달라서 스토어에 안 모은다
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
      archetypes.ts      21가지 팀 유형 문구
      pairs.ts           두 사람 조합에 붙는 문장
    lib/share/        공유 카드 캔버스 렌더링
    lib/ui/           오행 색, 일러스트 매핑 같은 화면용 상수
    lib/text/         조사 붙이기 같은 순수 문자열 유틸. 아무것도 import 하지 않는다
    lib/copy/         화면에 보이는 문구. 화면 단위 파일 8개와 배럴.
                      lib/text/ 외에는 아무것도 import 하지 않는다
    store/teamStore.ts
    components/
      Common/   프리미티브. Button Card Chip Field Section 등. 색은 전부
                index.css 의 CSS 변수만 본다. 화면 코드는 여기 있는 것만 쓴다
      Layout/   AppHeader, AppNotice — App.tsx 껍데기 조각
      Landing/  첫 화면 조각. LandingConsent (동의 체크박스 + 상세 모달)
      Saju/     팀 탭과 개인 탭이 같이 쓰는 도메인 컴포넌트
                SajuElementRadar, SajuElementBars, SajuPillarCard
      Input/    입력 화면. InputMemberForm, InputMemberList, InputUndoToast
      Loading/  LoadingView
      Result/   결과 화면. TeamHeadline, TeamIllustration, TeamAnalysis,
                TeamReportDetail, TeamShareCard, TeamReportView, PersonalView
    pages/      화면 단위 컨테이너. LandingPage, InputPage, LoadingPage, ResultPage
    App.tsx     헤더 + 화면 분기 + 하단 저장 고지만 남긴 얇은 껍데기
    index.css     Tailwind v4 + 디자인 토큰
  vite.config.ts  dev 서버용 API 미들웨어 포함
```

계산은 숫자와 관계까지만 낸다. 조합 문구와 유형 문구는 `lib/report/` 가 만든다.
계산이 카피를 들고 있으면 문구 한 글자 고칠 때마다 계산 테스트가 깨지고,
카피를 손볼 때 `saju-writer` 가 아니라 `saju-engine` 영역을 건드려야 한다.

아직 다 옮기지는 못했다. `chart.ts` 와 `timeCorrection.ts` 의 시간 보정 안내문,
`constants.ts` 의 오행 키워드가 계산 레이어에 남아 화면으로 그대로 나간다. 옮길 대상이다.

`components/` 바로 아래에는 파일을 두지 않는다. 전부 위 폴더 중 하나에 속하고,
각 폴더는 `index.ts` 배럴로 내보낸다. 이름은 접두로 소속을 드러낸다
(`Common`, `Saju`, `Input`, `Loading`, `Result`, `Team*`).

## 화면 문구

화면에 보이는 문구는 컴포넌트에 두지 않고 `src/lib/copy/` 에 모은다. 문구 한 벌을
손보려고 파일을 스무 개씩 열지 않아도 되고, `ethics-reviewer` 와 `/ethics-check` 가
볼 곳이 한 디렉터리로 좁혀진다.

```
src/lib/copy/
  common.ts    AppHeader, AppNotice, 공통 버튼, 브랜드명
  landing.ts   LandingPage, LandingConsent
  input.ts     InputPage, InputMemberForm, InputMemberList, InputUndoToast
  loading.ts   LoadingView
  result.ts    ResultPage, Result/**, Saju/** 의 UI 라벨
  personal.ts  PersonalView
  share.ts     TeamShareCard, lib/share/renderShareCard.ts
  errors.ts    store/teamStore.ts 검증 메시지
  index.ts     배럴
```

옮기는 것과 남기는 것의 기준은 하나다.
**이 문장을 고칠 때 계산 로직이나 `docs/` 명세를 같이 고쳐야 하면 남긴다.**

옮긴다. 화면 제목, 섹션 제목과 부제, 라벨, 버튼, placeholder, hint, 안내와 고지 문구,
동의 항목, 로딩 문구, 에러 메시지, `aria-label`, 이미지 `alt`, 내려받는 파일 이름.

남긴다. `lib/report/**` 전부, `lib/saju/**` 전부, `SajuPillarCard` 의 연주 월주 일주 시주와
지장간, `SajuElementBars` 의 넘침 부족 비어 있음. 명리 용어라 카피가 아니라 도메인
어휘이고 `docs/03-saju-spec.md` 에 묶여 있다.

작성 규칙은 넷이다.

- 고정 문자열은 `as const`. 값이 끼어드는 문장은 문자열이 아니라 함수로 둔다
- 마크업이 섞인 문장은 ReactNode 를 반환하지 않는다. 텍스트 조각을 각각 필드로 두고
  조립은 컴포넌트가 한다. copy 가 React 를 알면 카피가 아니라 컴포넌트가 된다
- `solo` 같은 분기는 함수로 감싸지 않고 `subtitleSolo` `subtitleTeam` 처럼 두 키로
  나눈다. 문자열이 상수로 그대로 보여야 `BANNED_PHRASES` 검사가 값을 훑는다
- `lib/copy/**` 는 `lib/text/**` 외에 아무것도 import 하지 않는다. 그래서
  `ELEMENT_LABEL` 을 조립해 만드는 `aria-label` 은 완성된 조각을 받는 함수로 두고,
  테이블 조회는 컴포넌트에 남긴다

문구가 컴포넌트로 다시 새어나오면 `scripts/__tests__/noInlineCopy.test.ts` 가 깨진다.
`components/`, `pages/`, `store/`, `lib/share/`, `lib/ui/` 다섯 곳을 보고, 한글과 한자와
자모를 같이 본다. 한자를 빼두면 `宜` `忌` `處方` `一二三` 이, 자모를 빼두면 `ㅎㅎ` 같은
자리가 그냥 새어나간다.

파싱은 TypeScript 파서에 맡긴다. 주석을 손으로 지우던 때는 JSX 닫는 태그를 정규식으로
오인해서 문구가 하나도 없는데 가드가 실패했다. 파서는 주석을 애초에 노드로 안 넘기므로
그 부류가 통째로 사라진다. 보는 것은 JSX 사이의 글, 따옴표 문자열, 템플릿의 고정 부분
셋이다. 템플릿의 `${...}` 는 계산된 값이라 건너뛰지만, 그 안에 문자열 리터럴이 있으면
그건 카피라 잡는다.

스캐너가 파일을 읽어야 해서 `src/` 가 아니라 `scripts/` 에 둔다. `src` 쪽 tsconfig 에
node 타입을 열면 `lib/saju/**` 의 순수 함수 규칙이 타입으로는 안 막힌다. 같은 스캐너를
`npm run scan:copy` 가 목록 출력에 쓴다. 두 곳이 다른 규칙으로 세면 테스트는 통과하는데
목록에는 남아 있는 상태가 생긴다.

예외는 파일이 아니라 **낱말과 글자** 단위로 연다. 파일을 통째로 빼면 그 파일에 새로
들어온 카피까지 같이 눈감아주게 된다. 목록은 둘이고 이유가 다르다. `ALLOWED_TERMS` 는
명리 용어, `ALLOWED_GLYPHS` 는 `占` 처럼 읽는 문구가 아니라 도장 무늬인 글자다. 항목마다
이유를 붙여 두고, 목록이 늘어나는 게 눈에 보이게 한다.

i18n 라이브러리는 쓰지 않는다. 이유는 `docs/05-roadmap.md` 결정 로그에 있다.

## 데이터 계약

```ts
// 앱 동의. 이것도 저장하지 않는다. 탭을 새로 열면 다시 받는다
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
| 생년월일 | 브라우저 밖으로 안 나감. 디스크에도 안 남고 탭 메모리에만 있다 |
| 공유 링크 | 계산 결과만 담는다. 생년월일 원본은 URL 에 절대 안 넣는다 |
| 동의 | 최초 1회 앱 동의 + 팀원별 대리 입력 확인. 상세는 06-privacy.md |
| API 입력 검증 | `birthDate` 같은 원본 필드 감지되면 400 거부. 실수 방지 장치 |
| 로그 | 서버 로그에 요청 본문 안 남긴다 |
| 레이트리밋 | IP당 분당 10회 |
