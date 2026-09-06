import { describe, expect, it } from 'vitest'

import { readTraits } from '../traits'
import { TRAIT_AXES } from '../../saju/constants'
import type { TraitAxes, TraitAxis } from '../../saju/types'

function traits(over: Partial<TraitAxes> = {}): TraitAxes {
  return { 추진: 20, 기획: 20, 조율: 20, 실행: 20, 분석: 20, ...over }
}

describe('팀 5축 해석', () => {
  it('제일 두꺼운 축과 제일 얇은 축을 짚는다', () => {
    const r = readTraits(traits({ 추진: 40, 분석: 5 }))
    expect(r.top).toBe('추진')
    expect(r.bottom).toBe('분석')
  })

  it('얇은 축에는 항상 처방이 붙는다', () => {
    for (const axis of TRAIT_AXES) {
      const r = readTraits(traits({ [axis]: 2 } as Partial<TraitAxes>))
      expect(r.bottom).toBe(axis)
      expect(r.gap.length).toBeGreaterThan(0)
      // 지적만 하고 끝나면 안 된다. 오늘 해볼 수 있는 게 같이 와야 한다
      expect(r.fix.length).toBeGreaterThan(0)
      expect(r.fix).not.toBe(r.gap)
    }
  })

  it('다섯이 고르면 even 으로 본다', () => {
    expect(readTraits(traits()).even).toBe(true)
    expect(readTraits(traits({ 추진: 40, 분석: 5 })).even).toBe(false)
  })

  it('어느 축이 제일 두꺼워도 문구가 나온다', () => {
    for (const axis of TRAIT_AXES) {
      const r = readTraits(traits({ [axis]: 60 } as Partial<TraitAxes>))
      expect(r.top).toBe(axis)
      expect(r.strength.length).toBeGreaterThan(0)
    }
  })

  it('카피에 금지 표현이 없다', () => {
    const banned = [
      /부적합/,
      /협업\s*불가/,
      /맞지\s*않는\s*사람/,
      /질병/,
      /수명/,
      /건강/,
      /할\s*것이다/,
      /하게\s*된다/,
      /자질이\s*없/,
      /체온/,
      /피로/,
      /소진/,
    ]
    const axes = TRAIT_AXES as TraitAxis[]
    const all = axes
      .flatMap((axis) => {
        const high = readTraits(traits({ [axis]: 60 } as Partial<TraitAxes>))
        const low = readTraits(traits({ [axis]: 2 } as Partial<TraitAxes>))
        return [high.strength, low.gap, low.fix]
      })
      .join(' ')

    for (const rule of banned) {
      expect(rule.test(all), `금지 표현: ${rule}`).toBe(false)
    }
  })
})
