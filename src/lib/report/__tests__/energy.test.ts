import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES, VAGUE_PRESCRIPTION } from './bannedPhrases'
import { energyCards } from '../energy'
import { ELEMENTS } from '../../saju/constants'
import type { Element } from '../../saju/types'

/** 주도와 결핍이 다른 모든 조합. 균형형은 컴포넌트가 걸러낸다 */
const PAIRS: Array<[Element, Element]> = ELEMENTS.flatMap((d) =>
  ELEMENTS.filter((l) => l !== d).map((l) => [d, l] as [Element, Element]),
)

describe('데려오면 좋은 기운 카드', () => {
  it('스무 가지 조합이 전부 네 장을 낸다', () => {
    expect(PAIRS).toHaveLength(20)
    for (const [d, l] of PAIRS) {
      expect(energyCards(d, l), `${d}-${l}`).toHaveLength(4)
    }
  })

  it('좋은 쪽 둘, 안 되는 쪽 둘로 갈린다', () => {
    for (const [d, l] of PAIRS) {
      const cards = energyCards(d, l)
      expect(cards.filter((c) => c.good)).toHaveLength(2)
      expect(cards.filter((c) => !c.good)).toHaveLength(2)
    }
  })

  it('안 되는 쪽에는 반드시 처방이 붙는다', () => {
    // 지적만 하고 끝나면 안 된다. 이게 이 기능에서 제일 중요한 규칙이다
    for (const [d, l] of PAIRS) {
      for (const card of energyCards(d, l)) {
        if (card.good) continue
        expect(card.fix, `${d}-${l} ${card.id} 처방 없음`).toBeTruthy()
        expect(card.fix!.length).toBeGreaterThan(15)
        for (const vague of VAGUE_PRESCRIPTION) {
          expect(vague.test(card.fix!), `${card.id} 처방이 뭉뚱그렸다`).toBe(false)
        }
      }
    }
  })

  it('좋은 쪽에는 처방이 안 붙는다', () => {
    for (const [d, l] of PAIRS) {
      for (const card of energyCards(d, l)) {
        if (card.good) expect(card.fix).toBeUndefined()
      }
    }
  })

  it('결핍을 채우는 카드와 주도를 더하는 카드가 각각 하나씩 있다', () => {
    for (const [d, l] of PAIRS) {
      const cards = energyCards(d, l)
      const fill = cards.find((c) => c.id === 'fill-lacking')
      const more = cards.find((c) => c.id === 'more-dominant')
      expect(fill?.element).toBe(l)
      expect(fill?.good).toBe(true)
      expect(more?.element).toBe(d)
      expect(more?.good).toBe(false)
    }
  })

  it('카피에 금지 표현이 없다', () => {
    const all = PAIRS.flatMap(([d, l]) =>
      energyCards(d, l).flatMap((c) => [c.title, c.nickname, c.line, c.effect, c.fix ?? '']),
    ).join(' ')

    for (const rule of BANNED_PHRASES) {
      expect(rule.test(all), `금지 표현: ${rule}`).toBe(false)
    }
  })

  it('조사가 앞말 받침에 맞는다', () => {
    // 화 토 수는 받침이 없다. "화이 넘치는데" 같은 비문이 나오면 안 된다
    const broken = [/[화토수](?:이|을|은)\s/, /[목금](?:가|를|는)\s/]
    const all = PAIRS.flatMap(([d, l]) =>
      energyCards(d, l).flatMap((c) => [c.title, c.nickname, c.line, c.effect, c.fix ?? '']),
    ).join(' ')

    for (const rule of broken) {
      const hit = all.match(rule)
      expect(hit, `조사가 어긋난다: ${hit?.[0]}`).toBeNull()
    }
  })

  it('사람을 배제하는 말을 안 쓴다', () => {
    // "안 되는 기운" 이라고 해서 사람을 자르는 말이 되면 안 된다
    const excluding = [/뽑지\s*마/, /거르/, /피하세요/, /함께\s*할\s*수\s*없/, /안\s*뽑/]
    const all = PAIRS.flatMap(([d, l]) =>
      energyCards(d, l).flatMap((c) => [c.title, c.nickname, c.effect, c.fix ?? '']),
    ).join(' ')

    for (const rule of excluding) {
      expect(rule.test(all), `사람을 배제하는 표현: ${rule}`).toBe(false)
    }
  })
})
