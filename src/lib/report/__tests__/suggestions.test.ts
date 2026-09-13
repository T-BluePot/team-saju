import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES } from './bannedPhrases'
import { ELEMENTS } from '../../saju/constants'
import { SUGGESTIONS, suggestionsFor } from '../suggestions'

/**
 * 이 기능은 프로젝트 금지선에 제일 가까이 붙어 있다.
 * 운동과 음식이 들어가는 순간 건강 조언으로 읽히므로 낱말로 막아둔다.
 */
const HEALTH_WORDS = [
  /운동/,
  /헬스/,
  /다이어트/,
  /식단/,
  /영양/,
  /칼로리/,
  /스트레칭/,
  /요가/,
  /등산/,
  /수영/,
  /달리기/,
  /러닝/,
  /명상/,
  /잠[을은]?\s*(잘|푹|더)/,
]

describe('해보면 좋은 것', () => {
  it('오행 다섯에 셋씩 있다', () => {
    for (const el of ELEMENTS) {
      expect(SUGGESTIONS[el], el).toHaveLength(3)
      for (const item of SUGGESTIONS[el]) expect(item.length, item).toBeGreaterThan(4)
    }
  })

  it('열다섯 개가 다 다르다', () => {
    const all = ELEMENTS.flatMap((el) => SUGGESTIONS[el])
    expect(new Set(all).size).toBe(all.length)
  })

  it('건강 조언으로 읽힐 낱말이 없다', () => {
    const all = ELEMENTS.flatMap((el) => SUGGESTIONS[el]).join(' ')
    for (const rule of HEALTH_WORDS) {
      expect(rule.test(all), `건강 조언에 가까운 표현: ${rule}`).toBe(false)
    }
  })

  it('금지 표현이 없다', () => {
    const all = ELEMENTS.flatMap((el) => SUGGESTIONS[el]).join(' ')
    for (const rule of BANNED_PHRASES) {
      expect(rule.test(all), `금지 표현: ${rule}`).toBe(false)
    }
  })

  it('하지 말라는 말이 없다', () => {
    // 사람을 배제하지 않는다. 다섯 다 해보라는 쪽으로만 쓴다
    const all = ELEMENTS.flatMap((el) => SUGGESTIONS[el]).join(' ')
    expect(all).not.toMatch(/하지\s*마|피하세요|줄이세요|안\s*하는\s*게/)
  })

  it('부족한 오행으로 고른다', () => {
    for (const el of ELEMENTS) expect(suggestionsFor(el)).toBe(SUGGESTIONS[el])
  })
})
