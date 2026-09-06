import { create } from 'zustand'

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
  gender: 'male' | 'female'
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
  gender: 'male',
  useTrueSolarTime: true,
  consentSource: null,
})

export const MAX_MEMBERS = 8

type State = {
  consented: boolean
  teamName: string
  members: MemberInput[]
  charts: SajuChart[]
  view: 'landing' | 'input' | 'loading' | 'result'
  error: string | null

  agree: () => void
  setTeamName: (name: string) => void
  addMember: (draft: Draft) => string | null
  removeMember: (id: string) => void
  goInput: () => void
  goResult: () => void
  finishLoading: () => void
  goBack: () => void
  reset: () => void
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
    gender: draft.gender,
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
  view: 'landing',
  error: null,

  agree: () => set({ consented: true }),
  setTeamName: (teamName) => set({ teamName }),

  addMember: (draft) => {
    const { members } = get()
    if (members.length >= MAX_MEMBERS) return `팀원은 ${MAX_MEMBERS}명까지 넣을 수 있어요`
    if (!draft.name.trim()) return '이름이나 별칭을 적어주세요'
    if (!draft.birthDate) return '생년월일을 골라주세요'
    if (!draft.consentSource) return '본인 정보인지 대신 입력하는지 골라주세요'

    const input = draftToInput(draft)
    let chart
    try {
      chart = buildChart(input)
    } catch (e) {
      if (e instanceof SajuInputError) return e.message
      return '사주를 계산하지 못했어요. 날짜를 다시 확인해 주세요'
    }

    set((s) => ({
      members: [...s.members, input],
      charts: [...s.charts, chart],
      error: null,
    }))
    return null
  },

  removeMember: (id) =>
    set((s) => ({
      members: s.members.filter((m) => m.id !== id),
      charts: s.charts.filter((c) => c.member.id !== id),
    })),

  goInput: () => set({ view: 'input' }),
  goResult: () => set({ view: 'loading' }),
  finishLoading: () => set({ view: 'result' }),
  goBack: () => set({ view: 'input' }),
  reset: () =>
    set({
      teamName: '',
      members: [],
      charts: [],
      view: 'input',
      error: null,
    }),
}))
