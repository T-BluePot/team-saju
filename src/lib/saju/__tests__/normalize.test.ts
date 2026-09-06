import { describe, expect, it } from 'vitest'

import { TRAIT_AXES } from '../constants'
import { normalizeTraits } from '../tenGods'
import type { TraitAxes } from '../types'

const of = (v: number[]): TraitAxes =>
  Object.fromEntries(TRAIT_AXES.map((a, i) => [a, v[i]])) as TraitAxes

const sum = (t: TraitAxes) => TRAIT_AXES.reduce((n, a) => n + t[a], 0)

describe('5축 정규화', () => {
  it('합이 항상 100이고 음수가 없다', () => {
    // 예전에는 마지막 축에 반올림 오차를 몰아줘서 음수가 나왔다.
    // {"추진":36,"기획":29,"조율":14,"실행":22,"분석":-1} 이 실제로 나온 값이다
    const cases: number[][] = [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 2],
      [3, 3, 3, 3, 1],
      [1, 0, 0, 0, 0],
      [7, 5, 3, 2, 1],
      [100, 1, 1, 1, 1],
      [1, 1, 1, 1, 0],
      [2, 2, 2, 1, 0],
      [5, 4, 2, 3, 0],
      [6, 6, 6, 6, 1],
    ]
    for (const c of cases) {
      const r = normalizeTraits(of(c))
      expect(sum(r), `합이 100이 아니다: ${c}`).toBe(100)
      for (const a of TRAIT_AXES) {
        expect(r[a], `${a} 가 음수다: ${c} -> ${JSON.stringify(r)}`).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('무작위로 돌려도 불변식이 깨지지 않는다', () => {
    // 시드 고정. 같은 입력이면 같은 출력이라는 원칙을 테스트도 지킨다
    let seed = 12345
    const next = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed % 40
    }
    for (let i = 0; i < 2000; i++) {
      const c = [next(), next(), next(), next(), next()]
      if (c.every((v) => v === 0)) continue
      const r = normalizeTraits(of(c))
      expect(sum(r), `합이 100이 아니다: ${c}`).toBe(100)
      for (const a of TRAIT_AXES) {
        expect(r[a], `${a} 가 음수다: ${c}`).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('전부 0이면 균등하게 나눈다', () => {
    const r = normalizeTraits(of([0, 0, 0, 0, 0]))
    for (const a of TRAIT_AXES) expect(r[a]).toBe(20)
  })

  it('같은 입력이면 같은 출력이다', () => {
    const input = of([7, 5, 3, 2, 1])
    expect(normalizeTraits(input)).toEqual(normalizeTraits(input))
  })
})
