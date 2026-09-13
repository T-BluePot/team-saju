import { SAMPLE_TEAM, SAMPLE_TEAM_NAME, type SampleSeed } from './lib/report/sample'
import { emptyDraft, useTeamStore } from './store/teamStore'

/**
 * 개발 모드에서만 도는 데모 시드.
 *
 * PR 마다 바뀐 화면 캡쳐를 붙여야 하는데, 결과 화면까지 가려면 폼을 여러 번
 * 채워야 해서 헤드리스 캡쳐가 안 된다. `#demo` 를 붙이면 표본 팀을 넣고
 * 결과 화면으로 바로 간다.
 *
 * 프로덕션 번들에는 들어가지 않는다. main.tsx 에서 import.meta.env.DEV 로 막는다.
 */

/** 표본은 예시 리포트와 같은 걸 쓴다. 두 벌을 들고 있을 이유가 없다 */
type Seed = SampleSeed
const SAMPLE = SAMPLE_TEAM

function seedMembers(rows: Seed[] = SAMPLE): boolean {
  const store = useTeamStore.getState()
  store.reset()
  store.setConsent(true)
  store.setTeamName(SAMPLE_TEAM_NAME)

  for (const seed of rows) {
    const error = useTeamStore.getState().addMember({
      ...emptyDraft(),
      ...seed,
      consentSource: 'self',
    })
    if (error) {
      console.error('[devSeed]', seed.name, error)
      return false
    }
  }
  return true
}

/** 넣고 결과까지. 특정 유형을 띄우는 시드가 전부 이 모양이다 */
function seedResult(rows: Seed[]): void {
  if (seedMembers(rows)) useTeamStore.setState({ view: 'result' })
}

export function seedDemo(): void {
  // 로딩 화면을 건너뛰고 결과를 바로 띄운다. 캡쳐가 타이밍을 안 타게
  seedResult(SAMPLE)
}

/** 팀원을 넣어둔 입력 화면. 팀원 목록을 보려면 여기로 */
export function seedFilledInput(): void {
  if (seedMembers()) useTeamStore.setState({ view: 'input' })
}

/**
 * 균형형(85~94)이 나오는 팀. 기운 카드 섹션이 안 뜨는 걸 확인하려면 여기로.
 *
 * 앞의 조합은 60점이라 실은 `earth-no-water` 가 뜨고 있었다. 문턱이 75이던
 * 시절에도 균형형이 아니었는데, 균형형이 흔하던 때라 눈치를 못 챘다.
 * 문턱을 옮기면 이 시드도 같이 확인한다.
 */
const BALANCED_SAMPLE: Seed[] = [
  { name: '가람', birthDate: '1995-06-11', birthHour: 12 },
  { name: '나린', birthDate: '1985-04-24', birthHour: 6 },
  { name: '다온', birthDate: '1991-01-25', birthHour: 16 },
]

export const seedBalanced = () => seedResult(BALANCED_SAMPLE)

/**
 * 황금 균형형(95+)이 나오는 팀. 96점.
 *
 * 시드는 분을 안 적어서 `emptyDraft()` 의 기본 분을 탄다. 그 값이 0 에서 30 으로
 * 바뀌자 앞의 조합은 진태양시 보정과 겹쳐 시주가 한 칸 밀리면서 93점 균형형이 됐다.
 * `devSeed.test.ts` 가 이 시드들이 제 유형을 띄우는지 지킨다.
 */
const GOLDEN_SAMPLE: Seed[] = [
  { name: '가람', birthDate: '1980-12-28', birthHour: 1 },
  { name: '나린', birthDate: '1986-11-08', birthHour: 17 },
  { name: '다온', birthDate: '1991-03-07', birthHour: 4 },
]

export const seedGolden = () => seedResult(GOLDEN_SAMPLE)

/** 예시 리포트 화면. 배너가 붙은 상태를 캡쳐하려면 여기로 */
export function seedExample(): void {
  useTeamStore.getState().reset()
  useTeamStore.getState().showExample()
}

/** 물 기운이 앞서는 팀. 유형별 강조색이 갈리는 걸 보려면 여기로 */
const WATER_SAMPLE: Seed[] = [
  { name: '지호', birthDate: '1992-12-08', birthHour: 23 },
  { name: '유진', birthDate: '1983-11-22', birthHour: 1 },
  { name: '민서', birthDate: '1996-01-14', birthHour: 22 },
]

export const seedWater = () => seedResult(WATER_SAMPLE)

/** 한 명을 지운 직후. 되돌리기가 떠 있는 상태를 캡쳐하려면 여기로 */
export function seedRemoved(): void {
  if (!seedMembers()) return
  useTeamStore.setState({ view: 'input' })
  const second = useTeamStore.getState().members[1]
  if (second) useTeamStore.getState().removeMember(second.id)
}

/** 한 명만 넣은 결과. 1인 모드 화면을 보려면 여기로 */
export function seedSolo(): void {
  seedResult(SAMPLE.slice(0, 1))
}

/** 로딩 화면에 세운다. 사람이 여럿일 때 명식이 넘어가는 걸 보려면 여기로 */
export function seedLoading(): void {
  if (seedMembers()) useTeamStore.setState({ view: 'loading' })
}

/** 동의만 통과시키고 입력 화면에 세운다. 폼 캡쳐용 */
export function seedInput(): void {
  const store = useTeamStore.getState()
  store.reset()
  store.setConsent(true)
  store.setTeamName(SAMPLE_TEAM_NAME)
  useTeamStore.setState({ view: 'input' })
}

/** 동의를 안 한 랜딩. 해시에 consent 가 있으면 상세 모달도 같이 열린다 */
export function seedConsent(): void {
  useTeamStore.getState().reset()
  useTeamStore.setState({ consented: false, view: 'landing' })
}

/**
 * `#demo` 결과, `#demo-input` 입력, `#demo-loading` 로딩,
 * `#demo-consent` 랜딩과 개인정보 상세 모달, `#demo-personal` 개인 명식 탭, `#demo-solo` 1인 결과,
 * `#demo-filled` 팀원이 들어 있는 입력 화면, `#demo-removed` 되돌리기가 뜬 상태,
 * `#demo-water` 다른 오행이 주도하는 팀, `#demo-example` 예시 리포트,
 * `#demo-balanced` 균형형 팀, `#demo-golden` 황금 균형형 팀
 */
export function applyDemoHash(): void {
  if (window.location.hash === '#demo') seedDemo()
  if (window.location.hash === '#demo-input') seedInput()
  if (window.location.hash === '#demo-loading') seedLoading()
  if (window.location.hash === '#demo-consent') seedConsent()
  if (window.location.hash === '#demo-personal') seedDemo()
  if (window.location.hash === '#demo-solo') seedSolo()
  if (window.location.hash === '#demo-filled') seedFilledInput()
  if (window.location.hash === '#demo-removed') seedRemoved()
  if (window.location.hash === '#demo-water') seedWater()
  if (window.location.hash === '#demo-example') seedExample()
  if (window.location.hash === '#demo-balanced') seedBalanced()
  if (window.location.hash === '#demo-golden') seedGolden()
}
