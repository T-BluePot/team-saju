import { describe, expect, it } from 'vitest'

import { buildChart } from '../chart'
import {
  correctTime,
  isDaylightSaving,
  needsLongitudeCorrection,
} from '../timeCorrection'
import type { MemberInput } from '../types'

function member(over: Partial<MemberInput> = {}): MemberInput {
  return {
    id: 'test',
    name: '테스트',
    birthDate: '1990-05-15',
    birthHour: 14,
    birthMinute: 30,
    calendar: 'solar',
    isLeapMonth: false,
    useTrueSolarTime: true,
    consent: { source: 'self', confirmedAt: '2026-09-06T00:00:00Z' },
    ...over,
  }
}

function ganzhi(input: MemberInput): string {
  const { year, month, day, hour } = buildChart(input).pillars
  const gz = (p: { stem: string; branch: string } | null) =>
    p ? `${p.stem}${p.branch}` : '--'
  return [gz(year), gz(month), gz(day), gz(hour)].join(' ')
}

/**
 * 골든 테스트. 문서 03-saju-spec.md 8장
 * 기대값은 고치지 않는다. 테스트가 깨지면 코드를 고친다.
 */
describe('골든 셋', () => {
  it('G1 기본 케이스', () => {
    expect(ganzhi(member())).toBe('庚午 辛巳 庚辰 癸未')
  })

  it('G2 입춘 전이라 연주가 전년도 간지', () => {
    const chart = buildChart(
      member({ birthDate: '1990-02-03', birthHour: 10, birthMinute: 0 }),
    )
    // 1990년에 태어났지만 입춘(2/4 10:14) 전이라 1989년 간지인 己巳년이다
    expect(`${chart.pillars.year.stem}${chart.pillars.year.branch}`).toBe('己巳')
    expect(ganzhi(member({ birthDate: '1990-02-03', birthHour: 10, birthMinute: 0 })))
      .toBe('己巳 丁丑 己亥 己巳')
  })

  it('G3 입춘 후라 당해 간지', () => {
    const chart = buildChart(
      member({ birthDate: '1990-02-05', birthHour: 10, birthMinute: 0 }),
    )
    expect(`${chart.pillars.year.stem}${chart.pillars.year.branch}`).toBe('庚午')
    expect(ganzhi(member({ birthDate: '1990-02-05', birthHour: 10, birthMinute: 0 })))
      .toBe('庚午 戊寅 辛丑 癸巳')
  })

  it('G4 서머타임이면 1시간을 뺀다', () => {
    const input = member({ birthDate: '1988-07-15', birthHour: 12, birthMinute: 0 })
    const chart = buildChart(input)
    const kinds = chart.corrections.map((c) => c.kind)
    expect(kinds).toContain('dst')
    expect(kinds).toContain('longitude')
    // 12:00 에서 60분과 30분을 빼면 10:30 이라 巳시가 된다
    expect(ganzhi(input)).toBe('戊辰 己未 辛未 癸巳')
  })

  it('G5 UTC+8:30 시기라 경도 보정을 하지 않는다', () => {
    const input = member({ birthDate: '1958-03-10', birthHour: 9, birthMinute: 0 })
    const chart = buildChart(input)
    expect(chart.corrections).toHaveLength(0)
    expect(ganzhi(input)).toBe('戊戌 乙卯 丙戌 癸巳')
  })

  it('G6 야자시라 다음날 일주를 쓴다', () => {
    const input = member({ birthDate: '2000-01-01', birthHour: 23, birthMinute: 30 })
    const chart = buildChart(input)
    // 당일 낮의 일주는 戊午. 야자시설이라 다음날 己未 가 나와야 한다
    expect(`${chart.pillars.day.stem}${chart.pillars.day.branch}`).toBe('己未')
    expect(chart.corrections.map((c) => c.kind)).toContain('lateZi')
    expect(ganzhi(input)).toBe('己卯 丙子 己未 甲子')
  })

  it('G7 시간을 모르면 시주 없이 세 기둥만 본다', () => {
    const input = member({ birthDate: '1995-06-10', birthHour: null })
    const chart = buildChart(input)
    expect(chart.pillars.hour).toBeNull()
    expect(ganzhi(input)).toBe('乙亥 壬午 壬申 --')
  })

  it('G8 음력을 양력으로 바꾼다', () => {
    const input = member({
      birthDate: '1993-04-15',
      birthHour: 8,
      birthMinute: 0,
      calendar: 'lunar',
    })
    const chart = buildChart(input)
    expect(chart.corrections.map((c) => c.kind)).toContain('lunar')
    expect(ganzhi(input)).toBe('癸酉 丁巳 丙辰 壬辰')
  })
})

describe('결정론', () => {
  const inputs = [
    member(),
    member({ birthDate: '1990-02-03', birthHour: 10, birthMinute: 0 }),
    member({ birthDate: '2000-01-01', birthHour: 23, birthMinute: 30 }),
    member({ birthDate: '1995-06-10', birthHour: null }),
  ]

  it('같은 입력을 두 번 넣으면 결과가 완전히 같다', () => {
    for (const input of inputs) {
      expect(buildChart(input)).toEqual(buildChart(input))
    }
  })
})

describe('오행과 강약', () => {
  it('G1 오행 비율은 손으로 계산한 값과 맞는다', () => {
    const chart = buildChart(member())
    // 庚午 辛巳 庚辰 癸未. 월지 巳는 1.5배. 총점 10.75
    expect(chart.elements.percents).toEqual({
      木: 5,
      火: 27,
      土: 24,
      金: 32,
      水: 12,
    })
    expect(chart.elements.dominant).toBe('金')
    expect(chart.elements.lacking).toBe('木')
  })

  it('비율 합은 항상 100이다', () => {
    const dates = ['1990-05-15', '1988-07-15', '2000-01-01', '1958-03-10', '1993-11-02']
    for (const birthDate of dates) {
      const { percents } = buildChart(member({ birthDate })).elements
      const sum = Object.values(percents).reduce((a, b) => a + b, 0)
      expect(sum).toBe(100)
    }
  })

  it('강약은 아군 비중으로 판정한다', () => {
    const strong = buildChart(
      member({ birthDate: '1990-02-03', birthHour: 10, birthMinute: 0 }),
    ).strength
    expect(strong.level).toBe('strong')
    expect(strong.index).toBeGreaterThanOrEqual(58)

    const weak = buildChart(
      member({ birthDate: '1993-04-15', birthHour: 8, birthMinute: 0, calendar: 'lunar' }),
    ).strength
    expect(weak.level).toBe('weak')
    expect(weak.index).toBeLessThan(42)
  })
})

describe('시간 보정 테이블', () => {
  it('서머타임 시행 기간을 정확히 가른다', () => {
    expect(isDaylightSaving(1988, 5, 8)).toBe(true)
    expect(isDaylightSaving(1988, 5, 7)).toBe(false)
    expect(isDaylightSaving(1988, 10, 9)).toBe(true)
    expect(isDaylightSaving(1988, 10, 10)).toBe(false)
    expect(isDaylightSaving(1989, 7, 1)).toBe(false)
  })

  it('표준자오선이 135도였던 기간에만 경도 보정을 한다', () => {
    expect(needsLongitudeCorrection(1950, 6, 1)).toBe(true)
    expect(needsLongitudeCorrection(1958, 3, 10)).toBe(false)
    expect(needsLongitudeCorrection(1961, 8, 9)).toBe(false)
    expect(needsLongitudeCorrection(1961, 8, 10)).toBe(true)
    expect(needsLongitudeCorrection(2000, 1, 1)).toBe(true)
  })

  it('자정 근처에서 날짜가 하루 밀린다', () => {
    const r = correctTime(2000, 1, 2, 0, 10, true)
    expect([r.year, r.month, r.day, r.hour, r.minute]).toEqual([2000, 1, 1, 23, 40])
  })

  it('보정을 끄면 서머타임만 되돌리고 경도는 그대로 둔다', () => {
    const off = correctTime(1988, 7, 15, 12, 0, false)
    expect([off.hour, off.minute]).toEqual([11, 0])
    const on = correctTime(1988, 7, 15, 12, 0, true)
    expect([on.hour, on.minute]).toEqual([10, 30])
  })
})
