import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES, VAGUE_PRESCRIPTION } from './bannedPhrases'
import { teamModifiers } from '../modifiers'
import { buildChart } from '../../saju/chart'
import { analyzeTeam } from '../../saju/team'
import type { MemberInput } from '../../saju/types'

const member = (name: string, birthDate: string, birthHour = 12): MemberInput => ({
  id: name,
  name,
  birthDate,
  birthHour,
  birthMinute: 0,
  calendar: 'solar',
  isLeapMonth: false,
  useTrueSolarTime: true,
  consent: { source: 'self', confirmedAt: '2026-09-07T00:00:00Z' },
})

/** 여러 팀 구성을 만들어 모디파이어를 두루 뽑는다 */
const DATES = [
  '1988-03-11',
  '1991-07-22',
  '1994-11-05',
  '1986-09-18',
  '1997-01-30',
  '1990-05-14',
  '1993-12-27',
  '1985-08-03',
]

function teamOf(n: number) {
  const charts = DATES.slice(0, n).map((d, i) => buildChart(member(`팀원${i}`, d, 9 + i)))
  return { charts, analysis: analyzeTeam(charts, '테스트') }
}

describe('팀 변주', () => {
  it('인원수 구간은 항상 하나 나오고 마지막에 온다', () => {
    for (const n of [1, 3, 5, 8]) {
      const { charts, analysis } = teamOf(n)
      const mods = teamModifiers(analysis, charts)
      expect(mods.length).toBeGreaterThan(0)
      expect(['small', 'medium', 'large']).toContain(mods[mods.length - 1].id)
    }
  })

  it('팀 크기에 맞는 구간을 고른다', () => {
    const band = (n: number) => {
      const { charts, analysis } = teamOf(n)
      return teamModifiers(analysis, charts).at(-1)!.id
    }
    expect(band(2)).toBe('small')
    expect(band(3)).toBe('small')
    expect(band(4)).toBe('medium')
    expect(band(6)).toBe('medium')
    expect(band(7)).toBe('large')
    expect(band(8)).toBe('large')
  })

  it('3인 팀과 8인 팀이 다른 변주를 낸다', () => {
    // 이 기능을 만든 이유다. 지금까지는 둘이 같은 결과로 떨어졌다
    const three = teamOf(3)
    const eight = teamOf(8)
    const a = teamModifiers(three.analysis, three.charts).map((m) => m.id)
    const b = teamModifiers(eight.analysis, eight.charts).map((m) => m.id)
    expect(a).not.toEqual(b)
  })

  it('혼자면 짝에 대한 변주가 안 나온다', () => {
    const { charts, analysis } = teamOf(1)
    const ids = teamModifiers(analysis, charts).map((m) => m.id)
    expect(ids).not.toContain('no-generating')
    expect(ids).not.toContain('isolated')
    expect(ids).not.toContain('all-strong')
  })

  it('짚고 넘어가는 변주에는 처방이 붙는다', () => {
    // 지적만 하고 끝나면 안 된다
    const needsFix = ['no-generating', 'isolated', 'empty-axis', 'all-strong', 'all-weak', 'large']
    for (let n = 1; n <= 8; n++) {
      const { charts, analysis } = teamOf(n)
      for (const m of teamModifiers(analysis, charts)) {
        if (!needsFix.includes(m.id)) continue
        expect(m.fix, `${m.id} 처방 없음`).toBeTruthy()
        expect(m.fix!.length).toBeGreaterThan(15)
        for (const vague of VAGUE_PRESCRIPTION) {
          expect(vague.test(m.fix!), `${m.id} 처방이 뭉뚱그렸다`).toBe(false)
        }
      }
    }
  })

  it('사람 이름을 쓰지 않는다', () => {
    // 누가 겉도는지 지목하면 배제하는 UI 가 된다
    for (let n = 1; n <= 8; n++) {
      const { charts, analysis } = teamOf(n)
      const text = teamModifiers(analysis, charts)
        .flatMap((m) => [m.label, m.line, m.fix ?? ''])
        .join(' ')
      for (const c of charts) {
        expect(text.includes(c.member.name), `이름이 샜다: ${c.member.name}`).toBe(false)
      }
    }
  })

  it('카피에 금지 표현이 없다', () => {
    let text = ''
    for (let n = 1; n <= 8; n++) {
      const { charts, analysis } = teamOf(n)
      text += teamModifiers(analysis, charts)
        .flatMap((m) => [m.label, m.line, m.fix ?? ''])
        .join(' ')
    }
    for (const rule of BANNED_PHRASES) {
      expect(rule.test(text), `금지 표현: ${rule}`).toBe(false)
    }
  })
})
