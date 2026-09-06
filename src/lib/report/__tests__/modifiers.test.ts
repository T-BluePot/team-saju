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
    for (const n of [2, 3, 5, 8]) {
      const { charts, analysis } = teamOf(n)
      const mods = teamModifiers(analysis, charts)
      expect(mods.length).toBeGreaterThan(0)
      expect(['small', 'medium', 'large']).toContain(mods[mods.length - 1].id)
    }
  })

  it('혼자면 변주를 아예 안 낸다', () => {
    // "한 명이 빠지면 기운이 크게 흔들립니다" 를 혼자인 사람에게 내밀 수 없다.
    // 화면이 팀인 척하지 않는다는 규율이 이 섹션에도 적용된다
    const { charts, analysis } = teamOf(1)
    expect(teamModifiers(analysis, charts)).toEqual([])
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

  it('인원수 말고도 갈리는 구성이 있다', () => {
    // 이 기능을 만든 이유다. 크기 구간만 다르면 3인과 8인이 여전히 같은 얘기를 한다
    const BAND = ['small', 'medium', 'large']
    const withoutBand = (n: number) => {
      const { charts, analysis } = teamOf(n)
      return teamModifiers(analysis, charts)
        .map((m) => m.id)
        .filter((id) => !BAND.includes(id))
    }
    const seen = new Set<string>()
    for (let n = 2; n <= 8; n++) seen.add(withoutBand(n).join(','))
    expect(seen.size, `크기 말고는 다 같다: ${[...seen].join(' | ')}`).toBeGreaterThan(1)
  })

  it('두 명이면 혼자 도는 자리를 안 본다', () => {
    // 둘뿐이면 짝이 하나라 "혼자 도는 자리" 가 의미가 없다
    const { charts, analysis } = teamOf(2)
    expect(teamModifiers(analysis, charts).map((m) => m.id)).not.toContain('isolated')
  })

  it('짚고 넘어가는 변주에는 처방이 붙는다', () => {
    // 지적만 하고 끝나면 안 된다
    const needsFix = ['no-generating', 'isolated', 'empty-axis', 'all-strong', 'all-weak', 'large']
    for (let n = 2; n <= 8; n++) {
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
