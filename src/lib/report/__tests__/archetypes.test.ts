import { describe, expect, it } from 'vitest'

import { ELEMENTS } from '../../saju/constants'
import { archetypeIdFor } from '../../saju/team'
import { ARCHETYPES, getArchetype } from '../archetypes'

describe('팀 유형', () => {
  it('20개 조합에 균형형을 더해 21개다', () => {
    expect(ARCHETYPES).toHaveLength(21)
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

  it('균형 점수가 75 이상이면 결핍과 무관하게 균형형이다', () => {
    expect(archetypeIdFor('火', '金', 75)).toBe('balanced')
    expect(archetypeIdFor('火', '金', 74)).toBe('fire-no-metal')
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
    // .claude/skills/report-voice/SKILL.md 의 절대 규칙
    const banned = [
      /부적합/,
      /협업\s*불가/,
      /맞지\s*않는\s*사람/,
      /질병/,
      /수명/,
      /건강/,
      /할\s*것이다/,
      /자질이\s*없/,
    ]
    for (const a of ARCHETYPES) {
      const text = [
        a.name,
        a.tagline,
        ...a.strengths,
        ...a.blindSpots,
        ...a.prescriptions,
        a.needsPerson,
      ].join(' ')
      for (const rule of banned) {
        expect(rule.test(text), `${a.id} 에 금지 표현: ${rule}`).toBe(false)
      }
    }
  })

  it('모든 처방은 구체적인 행동을 담고 있다', () => {
    // 처방이 뻔한 소리로 흐르는 걸 막는다
    const tooVague = [/^소통을/, /^협업을/, /^우선순위를 명확히 하세요$/]
    for (const a of ARCHETYPES) {
      for (const p of a.prescriptions) {
        expect(p.length).toBeGreaterThan(15)
        for (const rule of tooVague) {
          expect(rule.test(p), `${a.id}: ${p}`).toBe(false)
        }
      }
    }
  })
})
