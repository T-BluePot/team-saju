import { describe, expect, it } from 'vitest'

import { seedBalanced, seedGolden } from '../devSeed'
import { analyzeTeam } from '../lib/saju/team'
import { useTeamStore } from '../store/teamStore'

/**
 * 캡쳐용 시드가 제 유형을 띄우는가.
 *
 * 시드는 분을 안 적어서 `emptyDraft()` 기본값을 탄다. 그 기본값이 0 에서 30 으로
 * 바뀌자 진태양시 보정과 겹쳐 시주가 한 칸 밀렸고, `#demo-golden` 이 조용히
 * 균형형을 띄우고 있었다. 그 전에는 `#demo-balanced` 가 60점짜리 일반 유형을
 * 띄우고 있었다. 둘 다 화면만 봐서는 안 보이는 자리라 여기서 막는다.
 */
function archetypeAfter(seed: () => void): string {
  seed()
  return analyzeTeam(useTeamStore.getState().charts, '').archetypeId
}

describe('데모 시드', () => {
  it('#demo-golden 은 황금 균형형이다', () => {
    expect(archetypeAfter(seedGolden)).toBe('golden')
  })

  it('#demo-balanced 는 균형형이다', () => {
    expect(archetypeAfter(seedBalanced)).toBe('balanced')
  })
})
