import { describe, expect, it } from 'vitest'

import { pairCopy } from '../pairs'
import type { PairChemistry } from '../../saju/types'

const pair = (over: Partial<PairChemistry> = {}): PairChemistry => ({
  aId: 'a',
  bId: 'b',
  aName: '은우',
  bName: '서림',
  relation: 'generating',
  score: 90,
  aElement: '木',
  bElement: '火',
  flow: 'ab',
  ...over,
})

describe('조합 문장', () => {
  it('미는 쪽이 주어가 된다', () => {
    expect(pairCopy(pair({ flow: 'ab' })).direction).toBe('은우가 서림을 밀어주는 방향')
    expect(pairCopy(pair({ flow: 'ba' })).direction).toBe('서림이 은우를 밀어주는 방향')
  })

  it('브레이크를 거는 쪽이 주어가 된다', () => {
    const p = pair({ relation: 'tension', flow: 'ba' })
    // 처방까지 한 문장이다. 지적만 남기고 뒤를 자르면 규칙을 어긴다
    expect(pairCopy(p).direction).toBe(
      '서림이 은우에게 브레이크를 거는 방향. 견제가 품질을 올릴 수도 있다',
    )
  })

  it('같은 결이면 방향이 없고 오행을 말한다', () => {
    const p = pair({ relation: 'same', flow: null, aElement: '火', bElement: '火' })
    expect(pairCopy(p).direction).toBe('둘 다 火 기운이 앞선다. 말이 잘 통하는 대신 사각지대도 같다')
    expect(pairCopy(p).direction).not.toContain('은우')
  })

  it('관계마다 라벨이 정해져 있다', () => {
    // Set 크기만 보면 오타가 통과한다. 값을 그대로 박는다
    const labelOf = (relation: PairChemistry['relation']) =>
      pairCopy(pair({ relation, flow: relation === 'same' ? null : 'ab' })).label
    expect(labelOf('generating')).toBe('상생')
    expect(labelOf('same')).toBe('비슷한 결')
    expect(labelOf('tension')).toBe('긴장감 있는 조합')
  })

  it('이름 받침에 맞는 조사를 쓴다', () => {
    // 계산에 문장이 있던 시절에는 이(가) 을(를) 로 도망갔다
    expect(pairCopy(pair({ aName: '은우', bName: '김' })).direction).toBe(
      '은우가 김을 밀어주는 방향',
    )
    expect(pairCopy(pair({ aName: '서림', bName: '효경' })).direction).toBe(
      '서림이 효경을 밀어주는 방향',
    )
  })

  it('한글이 아닌 이름은 둘 다 적는다', () => {
    expect(pairCopy(pair({ aName: 'Kim' })).direction).toBe('Kim이(가) 서림을 밀어주는 방향')
  })
})
