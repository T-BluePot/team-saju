import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES, VAGUE_PRESCRIPTION } from './bannedPhrases'
import {
  BALANCED_ARCHETYPE_THRESHOLD,
  ELEMENTS,
  GOLDEN_ARCHETYPE_THRESHOLD,
} from '../../saju/constants'
import { archetypeIdFor } from '../../saju/team'
import { ARCHETYPES, getArchetype } from '../archetypes'

describe('팀 유형', () => {
  it('20개 조합에 균형형 둘을 더해 22개다', () => {
    expect(ARCHETYPES).toHaveLength(22)
  })

  it('id 가 겹치지 않는다', () => {
    const ids = ARCHETYPES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('team.ts 가 만드는 모든 id 에 카피가 있다', () => {
    // id 가 어긋나면 조용히 균형형으로 떨어져서 티가 안 난다. 그래서 막아둔다
    for (const dominant of ELEMENTS) {
      for (const lacking of ELEMENTS) {
        if (dominant === lacking) continue
        const id = archetypeIdFor(dominant, lacking, 50)
        const found = ARCHETYPES.find((a) => a.id === id)
        expect(found, `${id} 카피가 없다`).toBeDefined()
      }
    }
  })

  /*
   * 문턱 넷을 다 고정한다. 85 와 95 는 각각 아래위로 갈리는 자리라 한쪽만
   * 적어두면 부등호를 `>` 로 바꿔도 테스트가 안 깨진다.
   */
  it('균형 점수 85 부터 균형형, 95 부터 황금형이다', () => {
    expect(archetypeIdFor('火', '金', 84)).toBe('fire-no-metal')
    expect(archetypeIdFor('火', '金', 85)).toBe('balanced')
    expect(archetypeIdFor('火', '金', 94)).toBe('balanced')
    expect(archetypeIdFor('火', '金', 95)).toBe('golden')
    expect(archetypeIdFor('火', '金', 100)).toBe('golden')
  })

  it('황금형 문턱이 균형형보다 먼저 걸린다', () => {
    // 순서가 뒤집히면 95 이상도 균형형으로 떨어져서 황금형이 영영 안 나온다
    expect(GOLDEN_ARCHETYPE_THRESHOLD).toBeGreaterThan(BALANCED_ARCHETYPE_THRESHOLD)
  })

  it('균형 계열 둘은 채울 결핍이 없다', () => {
    // 기운 카드와 1인 화법이 id 가 아니라 이 값으로 갈린다
    const noLacking = ARCHETYPES.filter((a) => a.lacking === null).map((a) => a.id)
    expect(noLacking).toEqual(['balanced', 'golden'])
  })

  it('없는 id 를 넣으면 균형형으로 떨어진다', () => {
    expect(getArchetype('없는-유형').id).toBe('balanced')
  })

  it('사각지대와 처방은 개수가 같다', () => {
    for (const a of ARCHETYPES) {
      expect(a.blindSpots).toHaveLength(2)
      expect(a.prescriptions).toHaveLength(2)
      expect(a.strengths).toHaveLength(2)
    }
  })

  it('카피에 금지 표현이 없다', () => {
    for (const a of ARCHETYPES) {
      const text = [
        a.name,
        a.tagline,
        ...a.strengths,
        ...a.blindSpots,
        ...a.prescriptions,
        a.needsPerson,
      ].join(' ')
      for (const rule of BANNED_PHRASES) {
        expect(rule.test(text), `${a.id} 에 금지 표현: ${rule}`).toBe(false)
      }
    }
  })

  it('모든 처방은 구체적인 행동을 담고 있다', () => {
    // 처방이 뻔한 소리로 흐르는 걸 막는다
    for (const a of ARCHETYPES) {
      for (const p of a.prescriptions) {
        expect(p.length).toBeGreaterThan(15)
        for (const rule of VAGUE_PRESCRIPTION) {
          expect(rule.test(p), `${a.id}: ${p}`).toBe(false)
        }
      }
    }
  })
})
