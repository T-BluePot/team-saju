import { emptyDraft, useTeamStore, type Draft } from './store/teamStore'

/**
 * 개발 모드에서만 도는 데모 시드.
 *
 * PR 마다 바뀐 화면 캡쳐를 붙여야 하는데, 결과 화면까지 가려면 폼을 여러 번
 * 채워야 해서 헤드리스 캡쳐가 안 된다. `#demo` 를 붙이면 표본 팀을 넣고
 * 결과 화면으로 바로 간다.
 *
 * 프로덕션 번들에는 들어가지 않는다. main.tsx 에서 import.meta.env.DEV 로 막는다.
 */

type Seed = Pick<Draft, 'name' | 'birthDate' | 'birthHour'>

/** 실존 인물이 아니다. 오행이 한쪽으로 쏠리게 골라 결과가 균형형으로 안 빠지게 했다 */
const SAMPLE: Seed[] = [
  { name: '은우', birthDate: '1990-06-15', birthHour: 12 },
  { name: '서림', birthDate: '1988-06-20', birthHour: 14 },
  { name: '효경', birthDate: '1995-07-01', birthHour: 10 },
]

function seedMembers(): boolean {
  const store = useTeamStore.getState()
  store.reset()
  store.agree()
  store.setTeamName('푸른핫가마')

  for (const seed of SAMPLE) {
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

/** 로딩 화면에 세운다. 사람이 여럿일 때 명식이 넘어가는 걸 보려면 여기로 */
export function seedLoading(): void {
  if (seedMembers()) useTeamStore.setState({ view: 'loading' })
}

/** 동의만 통과시키고 입력 화면에 세운다. 폼 캡쳐용 */
export function seedInput(): void {
  const store = useTeamStore.getState()
  store.reset()
  store.agree()
  store.setTeamName('푸른핫가마')
  useTeamStore.setState({ view: 'input' })
}

/** 동의 모달이 뜬 상태로 세운다. 동의를 안 한 채 입력 화면에 있으면 모달이 뜬다 */
export function seedConsent(): void {
  useTeamStore.getState().reset()
  useTeamStore.setState({ consented: false, view: 'input' })
}

/** `#demo` 결과, `#demo-input` 입력, `#demo-loading` 로딩, `#demo-consent` 동의 모달 */
export function applyDemoHash(): void {
  if (window.location.hash === '#demo') seedDemo()
  if (window.location.hash === '#demo-input') seedInput()
  if (window.location.hash === '#demo-loading') seedLoading()
  if (window.location.hash === '#demo-consent') seedConsent()
}
