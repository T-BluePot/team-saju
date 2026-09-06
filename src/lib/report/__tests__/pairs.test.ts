import { describe, expect, it } from 'vitest'

import { pairCopy } from '../pairs'
import type { Element, PairChemistry } from '../../saju/types'

/** 사람 쪽만 바꿔 끼운다. 관계와 방향은 아래 두 헬퍼가 짝지어 든다 */
type People = Partial<Pick<PairChemistry, 'aName' | 'bName' | 'aElement' | 'bElement'>>

/**
 * `pairCopy` 는 `score` 를 안 읽는다. 엔진 상수(90/70/55)를 여기 복사해두면
 * 점수를 검증하는 것처럼 보이고, 엔진이 바꾸면 조용히 낡는다.
 * 점수 계약은 `saju/__tests__/team.test.ts` 가 잡는다.
 */
const BASE = {
  aId: 'a',
  bId: 'b',
  aName: '은우',
  bName: '서림',
  aElement: '木',
  bElement: '火',
  score: 0,
} as const

/**
 * 방향이 있는 관계.
 *
 * 예전 픽스처는 `Partial<PairChemistry>` 하나로 다 받아서
 * `relation: 'tension'` 에 `flow: null` 같은 값도 만들 수 있었다. 이제 타입이 막는다.
 */
const directed = (
  relation: 'generating' | 'tension',
  flow: 'ab' | 'ba',
  people: People = {},
): PairChemistry => ({
  ...BASE,
  relation,
  flow,
  ...people,
})

/** 같은 오행. 방향이 없다 */
const same = (element: Element): PairChemistry => ({
  ...BASE,
  aElement: element,
  bElement: element,
  relation: 'same',
  flow: null,
})

describe('조합 문장', () => {
  it('미는 쪽이 주어가 된다', () => {
    expect(pairCopy(directed('generating', 'ab')).direction).toBe('은우가 서림을 밀어주는 방향')
    expect(pairCopy(directed('generating', 'ba')).direction).toBe('서림이 은우를 밀어주는 방향')
  })

  it('브레이크를 거는 쪽이 주어가 된다', () => {
    // 처방까지 한 문장이다. 지적만 남기고 뒤를 자르면 규칙을 어긴다
    expect(pairCopy(directed('tension', 'ab')).direction).toBe(
      '은우가 서림에게 브레이크를 거는 방향. 견제가 품질을 올릴 수도 있다',
    )
    expect(pairCopy(directed('tension', 'ba')).direction).toBe(
      '서림이 은우에게 브레이크를 거는 방향. 견제가 품질을 올릴 수도 있다',
    )
  })

  it('같은 결이면 방향이 없고 오행을 말한다', () => {
    const p = same('火')
    expect(pairCopy(p).direction).toBe('둘 다 火 기운이 앞선다. 말이 잘 통하는 대신 사각지대도 같다')
    expect(pairCopy(p).direction).not.toContain('은우')
  })

  it('관계마다 라벨이 정해져 있다', () => {
    // Set 크기만 보면 오타가 통과한다. 값을 그대로 박는다
    expect(pairCopy(directed('generating', 'ab')).label).toBe('상생')
    expect(pairCopy(same('木')).label).toBe('비슷한 결')
    expect(pairCopy(directed('tension', 'ab')).label).toBe('긴장감 있는 조합')
  })

  it('이름 받침에 맞는 조사를 쓴다', () => {
    // 계산에 문장이 있던 시절에는 이(가) 을(를) 로 도망갔다
    expect(pairCopy(directed('generating', 'ab', { bName: '김' })).direction).toBe(
      '은우가 김을 밀어주는 방향',
    )
    expect(
      pairCopy(directed('generating', 'ab', { aName: '서림', bName: '효경' })).direction,
    ).toBe('서림이 효경을 밀어주는 방향')
  })

  it('한글이 아닌 이름은 둘 다 적는다', () => {
    expect(pairCopy(directed('generating', 'ab', { aName: 'Kim' })).direction).toBe(
      'Kim이(가) 서림을 밀어주는 방향',
    )
  })
})
