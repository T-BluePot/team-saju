import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES, VAGUE_PRESCRIPTION } from './bannedPhrases'
import { readTraits } from '../traits'
import { TRAIT_AXES } from '../../saju/constants'
import type { TraitAxes } from '../../saju/types'

/** 합이 100이어야 실제 normalizeTraits 출력과 같은 눈금이 된다 */
function traits(over: Partial<TraitAxes> = {}): TraitAxes {
  const base: TraitAxes = { 추진: 20, 기획: 20, 조율: 20, 실행: 20, 분석: 20 }
  const next = { ...base, ...over }
  const sum = TRAIT_AXES.reduce((n, a) => n + next[a], 0)
  if (sum !== 100) throw new Error(`합이 100이 아니다: ${sum}`)
  return next
}

describe('팀 5축 해석', () => {
  it('제일 두꺼운 축과 제일 얇은 축을 짚는다', () => {
    const r = readTraits(traits({ 추진: 40, 분석: 0 }))
    expect(r.top).toBe('추진')
    expect(r.bottom).toBe('분석')
  })

  it('값이 같은 축은 다 같이 짚는다', () => {
    // 0% 가 둘 나오는 일이 실제로 있다. 하나만 굵으면 버그로 보인다
    const r = readTraits(traits({ 추진: 60, 기획: 20, 조율: 20, 실행: 0, 분석: 0 }))
    expect(r.bottomAxes).toEqual(['실행', '분석'])
    expect(r.topAxes).toEqual(['추진'])
  })

  it('다섯이 다 같으면 위아래 모두 다섯 축이다', () => {
    const r = readTraits(traits())
    expect(r.topAxes).toHaveLength(5)
    expect(r.bottomAxes).toHaveLength(5)
    expect(r.even).toBe(true)
  })

  it('even 경계가 EVEN_SPREAD 에서 갈린다', () => {
    // spread 12 는 고른 걸로, 13 은 아닌 걸로 본다
    expect(readTraits(traits({ 추진: 26, 분석: 14 })).even).toBe(true) // spread 12
    expect(readTraits(traits({ 추진: 27, 분석: 13 })).even).toBe(false) // spread 14
    expect(readTraits(traits({ 추진: 40, 분석: 0 })).even).toBe(false)
  })

  it('얇은 축에는 항상 처방이 붙고, 그 처방이 훈계가 아니다', () => {
    for (const axis of TRAIT_AXES) {
      const rest = TRAIT_AXES.filter((a) => a !== axis)
      const over = { [axis]: 0 } as Partial<TraitAxes>
      // 나머지 넷이 100을 나눠 갖는다
      rest.forEach((a, i) => {
        ;(over as Record<string, number>)[a] = i === 0 ? 25 : 25
      })
      const r = readTraits(traits(over))

      expect(r.bottom).toBe(axis)
      expect(r.gap.length).toBeGreaterThan(0)
      expect(r.fix.length).toBeGreaterThan(15)
      expect(r.fix).not.toBe(r.gap)
      for (const vague of VAGUE_PRESCRIPTION) {
        expect(vague.test(r.fix), `${axis} 처방이 뭉뚱그렸다: ${r.fix}`).toBe(false)
      }
    }
  })

  it('어느 축이 제일 두꺼워도 문구가 나온다', () => {
    for (const axis of TRAIT_AXES) {
      const rest = TRAIT_AXES.filter((a) => a !== axis)
      const over = { [axis]: 60 } as Partial<TraitAxes>
      rest.forEach((a) => {
        ;(over as Record<string, number>)[a] = 10
      })
      const r = readTraits(traits(over))
      expect(r.top).toBe(axis)
      expect(r.strength.length).toBeGreaterThan(15)
    }
  })

  it('카피에 금지 표현이 없다', () => {
    const all = TRAIT_AXES.flatMap((axis) => {
      const rest = TRAIT_AXES.filter((a) => a !== axis)
      const high = { [axis]: 60 } as Partial<TraitAxes>
      const low = { [axis]: 0 } as Partial<TraitAxes>
      rest.forEach((a) => {
        ;(high as Record<string, number>)[a] = 10
        ;(low as Record<string, number>)[a] = 25
      })
      const h = readTraits(traits(high))
      const l = readTraits(traits(low))
      return [h.strength, l.gap, l.fix]
    }).join(' ')

    for (const rule of BANNED_PHRASES) {
      expect(rule.test(all), `금지 표현: ${rule}`).toBe(false)
    }
  })
})
