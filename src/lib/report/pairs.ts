import { object, subject } from '../text/josa'
import type { PairChemistry } from '../saju/types'

/**
 * 두 사람 조합에 붙는 문장.
 *
 * 계산은 관계와 방향까지만 낸다. 문장은 여기서 만든다.
 * 계산 레이어가 카피를 들고 있으면 문구 한 글자 고칠 때마다 계산 테스트가 깨지고,
 * 카피를 손볼 때 `saju-writer` 가 아니라 `saju-engine` 영역을 건드려야 한다.
 */

export type PairCopy = {
  label: string
  /** 누가 누구를 생하거나 극하는지 */
  direction: string
}

/** 방향이 있는 관계에서 주체와 대상을 가른다 */
function ends(pair: PairChemistry): { from: string; to: string } {
  return pair.flow === 'ba'
    ? { from: pair.bName, to: pair.aName }
    : { from: pair.aName, to: pair.bName }
}

export function pairCopy(pair: PairChemistry): PairCopy {
  if (pair.relation === 'same') {
    return {
      label: '비슷한 결',
      direction: `둘 다 ${pair.aElement} 기운이 앞선다. 말이 잘 통하는 대신 사각지대도 같다`,
    }
  }

  const { from, to } = ends(pair)

  if (pair.relation === 'generating') {
    return {
      label: '상생',
      direction: `${subject(from)} ${object(to)} 밀어주는 방향`,
    }
  }

  return {
    label: '긴장감 있는 조합',
    direction: `${subject(from)} ${to}에게 브레이크를 거는 방향. 견제가 품질을 올릴 수도 있다`,
  }
}
