import { create } from 'zustand'

import { errorCopy } from '../lib/copy'
import { SAMPLE_TEAM, SAMPLE_TEAM_NAME } from '../lib/report/sample'
import { buildChart, SajuInputError } from '../lib/saju/chart'
import type { MemberInput, SajuChart } from '../lib/saju/types'

/**
 * v1은 아무것도 저장하지 않는다. localStorage 도 안 쓴다.
 * 새로고침하면 사라지는 게 의도된 동작이다. 문서 06-privacy.md
 */

export type Draft = {
  name: string
  birthDate: string
  hourKnown: boolean
  birthHour: number
  birthMinute: number
  calendar: 'solar' | 'lunar'
  isLeapMonth: boolean
  useTrueSolarTime: boolean
  consentSource: 'self' | 'delegated' | null
}

export const emptyDraft = (): Draft => ({
  name: '',
  birthDate: '',
  hourKnown: true,
  birthHour: 12,
  birthMinute: 0,
  calendar: 'solar',
  isLeapMonth: false,
  useTrueSolarTime: true,
  consentSource: null,
})

export const MAX_MEMBERS = 8

type State = {
  consented: boolean
  teamName: string
  members: MemberInput[]
  charts: SajuChart[]
  /** 지금 보고 있는 게 예시 리포트인가. 자기 결과로 오해하면 안 된다 */
  isExample: boolean
  /** 방금 지운 사람. 되돌릴 수 있게 잠깐 들고 있는다 */
  removed: { member: MemberInput; chart: SajuChart; index: number } | null
  view: 'landing' | 'input' | 'loading' | 'result'

  setConsent: (next: boolean) => void
  setTeamName: (name: string) => void
  addMember: (draft: Draft) => string | null
  removeMember: (id: string) => void
  showExample: () => void
  undoRemove: () => void
  dismissRemoved: () => void
  goInput: () => void
  goLanding: () => void
  goResult: () => void
  finishLoading: () => void
  goBack: () => void
  goEdit: () => void
  reset: () => void
}

/**
 * 입력 화면에 설 수 있는가.
 *
 * 동의는 랜딩의 체크박스 하나로만 받는다. 그러니 동의 없이 입력 화면에 서 있는
 * 상태가 아예 없어야 한다. 예시 리포트의 "내 팀으로 해보기" 가 `reset()` 을 부르는데
 * 예시는 동의 없이 보는 화면이라 여기가 유일하게 새는 자리였다.
 * 화면 진입점마다 검사하지 않고 한 곳에서 막는다.
 */
function entryView(consented: boolean): 'input' | 'landing' {
  return consented ? 'input' : 'landing'
}

function draftToInput(draft: Draft): MemberInput {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `m-${Date.now()}-${performance.now()}`,
    name: draft.name.trim(),
    birthDate: draft.birthDate,
    birthHour: draft.hourKnown ? draft.birthHour : null,
    birthMinute: draft.hourKnown ? draft.birthMinute : 0,
    calendar: draft.calendar,
    isLeapMonth: draft.calendar === 'lunar' && draft.isLeapMonth,
    useTrueSolarTime: draft.useTrueSolarTime,
    consent: {
      source: draft.consentSource ?? 'self',
      confirmedAt: new Date().toISOString(),
    },
  }
}

export const useTeamStore = create<State>((set, get) => ({
  consented: false,
  teamName: '',
  members: [],
  charts: [],
  isExample: false,
  removed: null,
  view: 'landing',

  setConsent: (next) => set({ consented: next }),
  setTeamName: (teamName) => set({ teamName }),

  addMember: (draft) => {
    const { members } = get()
    if (members.length >= MAX_MEMBERS) return errorCopy.tooMany(MAX_MEMBERS)
    if (!draft.name.trim()) return errorCopy.noName
    if (!draft.birthDate) return errorCopy.noBirthDate
    if (!draft.consentSource) return errorCopy.noConsentSource

    const input = draftToInput(draft)
    let chart
    try {
      chart = buildChart(input)
    } catch (e) {
      if (e instanceof SajuInputError) return e.message
      return errorCopy.chartFailed
    }

    set((s) => ({
      members: [...s.members, input],
      charts: [...s.charts, chart],
      // 새로 넣었으면 되돌리기는 무효다. 안 그러면 상한을 넘길 수 있다
      removed: null,
      // 예시를 보다가 직접 넣기 시작하면 더 이상 예시가 아니다
      isExample: false,
    }))
    return null
  },

  /**
   * 지운 사람을 잠깐 들고 있는다.
   *
   * v1은 아무것도 저장하지 않아서 잘못 지우면 그 사람 생년월일시를 다시 물어봐야 한다.
   * 대리 입력이면 팀원한테 또 물어보는 상황이 된다.
   * 저장을 안 하는 설계일수록 실수 취소가 더 중요하다.
   */
  removeMember: (id) =>
    set((s) => {
      const index = s.members.findIndex((m) => m.id === id)
      if (index < 0) return {}
      return {
        members: s.members.filter((m) => m.id !== id),
        charts: s.charts.filter((c) => c.member.id !== id),
        removed: { member: s.members[index], chart: s.charts[index], index },
      }
    }),

  /** 지웠던 자리에 그대로 되돌린다 */
  undoRemove: () =>
    set((s) => {
      if (!s.removed) return {}
      const { member, chart, index } = s.removed
      const members = [...s.members]
      const charts = [...s.charts]
      members.splice(index, 0, member)
      charts.splice(index, 0, chart)
      return { members, charts, removed: null }
    }),

  dismissRemoved: () => set({ removed: null }),

  goInput: () =>
    set((s) => ({ view: entryView(s.consented), removed: null, isExample: false })),

  /**
   * 표본 팀으로 결과를 보여준다.
   *
   * 남의 생년월일시까지 받아와야 하는 입력을 시키기 전에, 뭐가 나오는지 먼저 보여준다.
   * 동의는 건드리지 않는다. 예시를 보는 데 개인정보를 넣는 게 아니라서다.
   */
  showExample: () => {
    set({ teamName: SAMPLE_TEAM_NAME, members: [], charts: [], removed: null })
    for (const seed of SAMPLE_TEAM) {
      const error = get().addMember({ ...emptyDraft(), ...seed, consentSource: 'self' })
      if (error) {
        // 반쯤 채워진 표본을 남기면 다음에 팀 만들기를 눌렀을 때 그게 섞인다.
        // `goLanding()` 은 화면만 옮기니까 여기서는 비우는 쪽을 부른다
        get().reset()
        set({ view: 'landing' })
        return
      }
    }
    // addMember 가 isExample 을 끄니 마지막에 다시 켠다
    set({ view: 'result', isExample: true })
  },
  /**
   * 첫 화면으로 옮긴다. **아무것도 지우지 않는다.**
   *
   * 머리글 로고가 부른다. 한때 여기서 팀원까지 비웠는데, 넷째 사람을 넣다가
   * 로고를 누르면 확인 한 번 없이 전부 날아갔다. v1 은 저장을 안 하니 되돌릴 데도 없다.
   * 지우는 동작은 그렇게 적힌 자리에만 둔다. `새 팀으로 시작하기` 의 `reset()` 이다.
   *
   * 되돌리기 버퍼는 비운다. 팀원을 지운 직후에 로고를 눌러 나갔다 돌아오면
   * 이미 지나간 토스트가 처음부터 다시 뜨고 되돌리기도 살아 있었다.
   * `goBack()` `goResult()` 가 하는 것과 같이 맞춘다.
   */
  goLanding: () => set({ view: 'landing', removed: null }),
  goResult: () => set({ view: 'loading', removed: null }),
  finishLoading: () => set({ view: 'result' }),
  goBack: () => set((s) => ({ view: entryView(s.consented), removed: null })),

  /**
   * 결과에서 입력으로 되돌아간다. **예시를 보고 있었으면 비우고 나간다.**
   *
   * 예시의 표본 팀이 그대로 남아서 편집으로 나가면, 은우 서림 효경이 사용자가
   * 직접 넣은 팀원인 척 입력 화면에 선다. 그 상태로 분석하면 자기 결과 위에
   * `예시 데이터로 만든 결과입니다` 띠가 달린다.
   *
   * 이 갈림을 화면에 두면 결과로 나가는 자리마다 각자 챙겨야 한다. 실제로
   * `팀원 수정` 만 챙기고 머리글 화살표가 빠져 있었다. 한 곳에 둔다.
   */
  goEdit: () => (get().isExample ? get().reset() : get().goBack()),
  reset: () =>
    set((s) => ({
      teamName: '',
      members: [],
      charts: [],
      removed: null,
      isExample: false,
      view: entryView(s.consented),
    })),
}))
