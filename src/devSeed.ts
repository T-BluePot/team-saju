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

function seedMembers(only = SAMPLE.length): boolean {
  const store = useTeamStore.getState()
  store.reset()
  store.agree()
  store.setTeamName(SAMPLE_TEAM_NAME)

  for (const seed of SAMPLE.slice(0, only)) {
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

export function seedDemo(): void {
  // 로딩 화면을 건너뛰고 결과를 바로 띄운다. 캡쳐가 타이밍을 안 타게
  if (seedMembers()) useTeamStore.setState({ view: 'result' })
}

/** 팀원을 넣어둔 입력 화면. 팀원 목록을 보려면 여기로 */
export function seedFilledInput(): void {
  if (seedMembers()) useTeamStore.setState({ view: 'input' })
}

/** 균형형이 나오는 팀. 기운 카드 섹션이 안 뜨는 걸 확인하려면 여기로 */
const BALANCED_SAMPLE: SampleSeed[] = [
  { name: '가람', birthDate: '1988-03-11', birthHour: 9 },
  { name: '나린', birthDate: '1991-07-22', birthHour: 15 },
  { name: '다온', birthDate: '1994-11-05', birthHour: 20 },
]

export function seedBalanced(): void {
  const store = useTeamStore.getState()
  store.reset()
  store.agree()
  store.setTeamName(SAMPLE_TEAM_NAME)
  for (const seed of BALANCED_SAMPLE) {
    const error = useTeamStore.getState().addMember({
      ...emptyDraft(),
      ...seed,
      consentSource: 'self',
    })
    if (error) {
      console.error('[devSeed]', seed.name, error)
      return
    }
  }
  useTeamStore.setState({ view: 'result' })
}

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

export function seedWater(): void {
  const store = useTeamStore.getState()
  store.reset()
  store.agree()
  store.setTeamName(SAMPLE_TEAM_NAME)
  for (const seed of WATER_SAMPLE) {
    const error = useTeamStore.getState().addMember({
      ...emptyDraft(),
      ...seed,
      consentSource: 'self',
    })
    if (error) {
      console.error('[devSeed]', seed.name, error)
      return
    }
  }
  useTeamStore.setState({ view: 'result' })
}

/** 한 명을 지운 직후. 되돌리기가 떠 있는 상태를 캡쳐하려면 여기로 */
export function seedRemoved(): void {
  if (!seedMembers()) return
  useTeamStore.setState({ view: 'input' })
  const second = useTeamStore.getState().members[1]
  if (second) useTeamStore.getState().removeMember(second.id)
}

/** 한 명만 넣은 결과. 1인 모드 화면을 보려면 여기로 */
export function seedSolo(): void {
  if (seedMembers(1)) useTeamStore.setState({ view: 'result' })
}

/** 로딩 화면에 세운다. 사람이 여럿일 때 명식이 넘어가는 걸 보려면 여기로 */
export function seedLoading(): void {
  if (seedMembers()) useTeamStore.setState({ view: 'loading' })
}

/** 동의만 통과시키고 입력 화면에 세운다. 폼 캡쳐용 */
export function seedInput(): void {
  const store = useTeamStore.getState()
  store.reset()
  store.agree()
  store.setTeamName(SAMPLE_TEAM_NAME)
  useTeamStore.setState({ view: 'input' })
}

/** 동의 모달이 뜬 상태로 세운다. 동의를 안 한 채 입력 화면에 있으면 모달이 뜬다 */
export function seedConsent(): void {
  useTeamStore.getState().reset()
  useTeamStore.setState({ consented: false, view: 'input' })
}

/**
 * `#demo` 결과, `#demo-input` 입력, `#demo-loading` 로딩,
 * `#demo-consent` 동의 모달, `#demo-personal` 개인 명식 탭, `#demo-solo` 1인 결과,
 * `#demo-filled` 팀원이 들어 있는 입력 화면, `#demo-removed` 되돌리기가 뜬 상태,
 * `#demo-water` 다른 오행이 주도하는 팀, `#demo-example` 예시 리포트,
 * `#demo-balanced` 균형형 팀
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
}
