import { describe, expect, it } from 'vitest'

import { ARCHETYPES } from '../archetypes'
import { LANDING_TASTE, SAMPLE_TEAM, SAMPLE_TEAM_NAME } from '../sample'

describe('랜딩에 미리 보여주는 유형', () => {
  it('칩 이름이 전부 실제 유형에 있다', () => {
    // #6 에서 유형 이름을 통째로 바꾼 적이 있다. 그때 랜딩만 옛 이름을 들고 있으면
    // 화면과 결과가 다른 말을 하게 된다
    const names = ARCHETYPES.map((a) => a.name)
    for (const t of LANDING_TASTE) {
      expect(names, `랜딩 칩에 없는 유형: ${t}`).toContain(t)
    }
  })

  it('칩에 같은 유형이 두 번 안 나온다', () => {
    expect(new Set(LANDING_TASTE).size).toBe(LANDING_TASTE.length)
  })

  it('나머지 개수를 손으로 안 적는다', () => {
    // "그리고 N가지 더" 는 계산해서 쓴다
    expect(ARCHETYPES.length - LANDING_TASTE.length).toBeGreaterThan(0)
  })
})

describe('예시 표본 팀', () => {
  it('결과를 뽑을 만큼 들어 있다', () => {
    expect(SAMPLE_TEAM.length).toBeGreaterThanOrEqual(2)
    expect(SAMPLE_TEAM_NAME.length).toBeGreaterThan(0)
  })

  it('생년월일 형식이 맞고 시간이 범위 안이다', () => {
    for (const s of SAMPLE_TEAM) {
      expect(s.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(s.birthHour).toBeGreaterThanOrEqual(0)
      expect(s.birthHour).toBeLessThanOrEqual(23)
      expect(s.name.length).toBeGreaterThan(0)
    }
  })
})
