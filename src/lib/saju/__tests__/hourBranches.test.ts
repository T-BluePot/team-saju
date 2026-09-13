import { describe, expect, it } from 'vitest'

import { buildChart } from '../chart'
import { BRANCHES, HOUR_BRANCHES, hourBranchAt } from '../constants'
import type { MemberInput } from '../types'

/**
 * 십이지시로 고른 시간이 그 지시로 계산되는가.
 *
 * 표가 들고 있는 `at` 은 화면에서 지시를 고를 때 저장하는 시각이다. 이게
 * 틀리면 사용자는 자시를 골랐는데 여덟 글자에는 해시가 박힌다. 화면에서는
 * 안 보이고 결과만 조용히 어긋나는 종류라 여기서 막는다.
 *
 * 진태양시 보정을 켜든 끄든 같은 지시여야 한다. 그래서 `at` 을 구간의 시작이
 * 아니라 한가운데로 뒀다. 경계값이면 보정 30분에 밀려 옆 칸으로 넘어간다.
 */
function member(hour: number, minute: number, useTrueSolarTime: boolean): MemberInput {
  return {
    id: 'test',
    name: '테스트',
    birthDate: '2000-01-01',
    birthHour: hour,
    birthMinute: minute,
    calendar: 'solar',
    isLeapMonth: false,
    useTrueSolarTime,
    consent: { source: 'self', confirmedAt: '2026-01-01T00:00:00.000Z' },
  }
}

describe('십이지시 표', () => {
  it('열세 칸이다. 子 만 야자시와 자시로 갈린다', () => {
    expect(HOUR_BRANCHES).toHaveLength(13)
    expect(HOUR_BRANCHES.filter((b) => b.branch === '子')).toHaveLength(2)
    expect(new Set(HOUR_BRANCHES.map((b) => b.branch)).size).toBe(12)
  })

  it('열두 지지를 순서대로 한 번씩 덮는다', () => {
    const seen = [...new Set(HOUR_BRANCHES.map((b) => b.branch))]
    expect(seen).toEqual(BRANCHES)
  })

  /**
   * 하루 1440분이 빈 데 없이 딱 한 칸씩 덮이는가.
   *
   * 야자시가 자정을 걸쳐서 `from > to` 라 정렬로 이어붙이는 걸로는 못 본다.
   * 분마다 물어보는 게 제일 확실하고 1440번이면 금방이다.
   */
  it('하루 어느 분이든 정확히 한 칸에 든다', () => {
    const hit = (m: number) =>
      HOUR_BRANCHES.filter((b) => {
        const from = b.from[0] * 60 + b.from[1]
        const to = b.to[0] * 60 + b.to[1]
        return from > to ? m >= from || m <= to : m >= from && m <= to
      })

    for (let m = 0; m < 24 * 60; m += 1) {
      expect(hit(m)).toHaveLength(1)
    }
  })

  it('야자시는 자정을 걸친다', () => {
    const [night] = HOUR_BRANCHES
    expect(night.name).toBe('야자시')
    expect(night.from).toEqual([23, 30])
    expect(night.to).toEqual([0, 29])
    // 진태양시로 자정이 시계 00:30 이다. 00:29 까지는 아직 어제 자시다
    expect(hourBranchAt(0, 29)).toBe(night)
    expect(hourBranchAt(0, 30)).not.toBe(night)
  })

  it('at 은 제 구간 안에 있다', () => {
    for (const b of HOUR_BRANCHES) {
      expect(hourBranchAt(b.at[0], b.at[1])).toBe(b)
    }
  })
})

describe('지시를 고르면 그 지시로 계산된다', () => {
  it.each(HOUR_BRANCHES.map((b) => [b.name, b] as const))(
    '%s',
    (_name, b) => {
      for (const useTrueSolarTime of [true, false]) {
        const chart = buildChart(member(b.at[0], b.at[1], useTrueSolarTime))
        // 시간을 넣었으니 시주가 없을 수 없다. 없으면 그 자체가 실패다
        expect(chart.pillars.hour?.branch).toBe(b.branch)
      }
    },
  )

  /**
   * 자시를 둘로 가른 이유가 이것이다.
   *
   * 같은 날짜인데 자정 앞이면 야자시설에 따라 다음날 일주가 되고, 자정 뒤면
   * 당일이다. 한 칸으로 두면 둘 중 한쪽은 여덟 글자 중 하나가 틀린 채로 나온다.
   * 문서 03-saju-spec.md 의 G6 과 같은 자리다.
   */
  it('야자시와 자시는 일주가 갈린다', () => {
    const [night, late] = HOUR_BRANCHES
    expect(night.name).toBe('야자시')
    expect(late.name).toBe('자시')

    const a = buildChart(member(night.at[0], night.at[1], true)).pillars.day
    const b = buildChart(member(late.at[0], late.at[1], true)).pillars.day

    expect(`${a.stem}${a.branch}`).toBe('己未')
    expect(`${b.stem}${b.branch}`).toBe('戊午')
  })
})
