import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES, VAGUE_PRESCRIPTION } from './bannedPhrases'
import { ARCHETYPES } from '../archetypes'
import { SOLO_LEAD, SOLO_NOTE, isSolo, needsBlock } from '../solo'

describe('1인 결과 화법', () => {
  it('한 명이면 solo 다', () => {
    expect(isSolo({ size: 1 })).toBe(true)
    expect(isSolo({ size: 2 })).toBe(false)
    expect(isSolo({ size: 8 })).toBe(false)
  })

  it('여럿일 때는 유형의 needsPerson 을 그대로 쓴다', () => {
    for (const a of ARCHETYPES) {
      const block = needsBlock(false, a)
      expect(block.heading).toBe('이 팀에 들어오면 좋은 사람')
      expect(block.body).toBe(a.needsPerson)
    }
  })

  it('혼자일 때 균형형만 다른 문구로 간다', () => {
    for (const a of ARCHETYPES) {
      const block = needsBlock(true, a)
      if (a.id === 'balanced') {
        expect(block.heading).toBe('지금은 이렇습니다')
        expect(block.body).not.toBe(a.needsPerson)
      } else {
        expect(block.heading).toBe('같이 하면 좋은 사람')
        expect(block.body).toBe(a.needsPerson)
      }
    }
  })

  it('혼자 균형형 문구도 지적으로 끝나지 않는다', () => {
    // "어느 쪽으로도 안 기울어 있다" 는 지적이다. 뭘 하면 되는지가 같이 와야 한다
    const { body } = needsBlock(true, ARCHETYPES.find((a) => a.id === 'balanced')!)
    expect(body).toMatch(/보세요|하세요|해보세요/)
  })

  it('1인 전용 문구에 금지 표현이 없다', () => {
    const balanced = needsBlock(true, ARCHETYPES.find((a) => a.id === 'balanced')!)
    const all = [SOLO_LEAD, SOLO_NOTE, balanced.heading, balanced.body].join(' ')
    for (const rule of BANNED_PHRASES) {
      expect(rule.test(all), `금지 표현: ${rule}`).toBe(false)
    }
    for (const vague of VAGUE_PRESCRIPTION) {
      expect(vague.test(balanced.body), `뭉뚱그린 처방: ${balanced.body}`).toBe(false)
    }
  })
})
