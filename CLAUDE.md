# 팀사주 (TeamSaju)

팀원 생년월일시를 넣으면 개인 사주와 팀 오행 조합을 뽑아서 협업 리포트를 만들어 주는 웹.
푸른핫가마 서브 프로젝트.

## 이 프로젝트에서 제일 중요한 것

**계산과 해석을 분리한다.**

LLM한테 "1993년 5월 3일 사주 봐줘" 하면 간지를 지어낸다. 그래서 8글자는 코드가
확정하고 AI는 그 결과로 문장만 쓴다. 이 경계를 흐리는 변경은 하지 않는다.

## 명령어

```bash
npm run dev        # localhost:5180
npm test           # 골든셋 포함 전체 테스트
npm run typecheck  # tsc -b. --noEmit 은 이 저장소에서 아무것도 안 본다
npm run build
npm run lint
```

## 문서

`docs/` 가 기준이다. 코드와 문서가 어긋나면 **문서를 먼저 고치고 코드를 맞춘다.**

| 문서 | 내용 |
|---|---|
| `docs/00-product-brief.md` | 왜 만드는가, 하지 않는 것 |
| `docs/01-prd.md` | 기능 요구사항 |
| `docs/02-architecture.md` | 구조와 데이터 계약 |
| `docs/03-saju-spec.md` | **계산 명세. 엔진의 기준 문서** |
| `docs/04-ai-agent-design.md` | 에이전트 설계 |
| `docs/05-roadmap.md` | 스프린트와 결정 로그 |
| `docs/06-privacy.md` | 개인정보 처리 |
| `docs/07-team-report.md` | 21가지 팀 유형과 공유 설계 |

## 코드 규칙

| 영역 | 규칙 |
|---|---|
| `src/lib/saju/**` | 순수 함수만. `Date.now()`, `Math.random()`, 네트워크, DOM 접근 금지 |
| `src/lib/text/**` | 조사 붙이기 같은 문자열 유틸. 아무것도 import 하지 않는다. `lib/report/` 와 `lib/copy/` 가 쓴다 |
| `src/lib/copy/**` | 화면 문구. `lib/text/**` 외에 아무것도 import 하지 않는다. React 도 안 쓴다. 명리 용어는 여기 오지 않는다 |
| 테스트 | 골든셋 기대값은 고치지 않는다. 깨지면 코드를 고친다 |
| `src/components/**` | 반응형 375px부터, 다크모드, 폼 라벨 연결, 대비 4.5:1 |
| 색 | `src/index.css` 의 CSS 변수만 쓴다. 하드코딩 금지 |
| 의존성 | 추가 전에 물어본다. 차트 라이브러리는 이미 배제했다 |

## 넘으면 안 되는 선

새 카피나 기능을 붙일 때마다 확인한다.

- 미래를 단정하지 않는다. "~할 것이다" 대신 "~한 경향"
- 사람을 배제하지 않는다. "부적합", "협업 불가" 금지
- 건강 수명 질병 사망 언급 금지
- 부정적 지적에는 반드시 처방이 붙는다
- **공유 뷰에 이름과 생년월일이 들어가면 안 된다.** 공유 단위는 팀뿐이다
- v1은 아무것도 저장하지 않는다. localStorage도 안 쓴다
- **PR 본문 맨 아래에 바뀐 화면 캡쳐를 넣는다.** UI 작업은 예외 없다

## 에이전트

| 에이전트 | 권한 | 담당 |
|---|---|---|
| `saju-engine` | 쓰기 | `src/lib/saju/**` 계산 로직 |
| `saju-verifier` | 읽기 전용 | 계산 결과와 명세 대조 |
| `saju-writer` | 쓰기 | 리포트 카피, 프롬프트, `src/lib/text/**`, `src/lib/copy/**` |
| `ui-builder` | 쓰기 | 컴포넌트와 화면 |
| `ethics-reviewer` | 읽기 전용 | 사용자에게 보이는 문자열 감사 |

스킬은 `myeongri` (명리 참조표) 와 `report-voice` (톤 규칙) 두 개다.

커맨드는 `/verify-engine`, `/add-case`, `/ethics-check`.

## 환경변수

`ANTHROPIC_API_KEY` 하나뿐이고 필수도 아니다. 없으면 룰 기반 폴백으로 돈다.
Sprint 2부터 쓴다.

`VITE_` 접두사로 API 키를 넣지 말 것. 클라이언트 번들에 그대로 노출된다.
