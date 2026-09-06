import { TRAIT_AXES } from '../saju/constants'
import type { TraitAxes, TraitAxis } from '../saju/types'

/**
 * 팀 5축 해석.
 *
 * 숫자만 두면 읽는 사람이 뭘 해야 할지 모른다. 제일 두꺼운 축과 제일 얇은 축에
 * 한 줄씩 붙인다. 얇은 쪽에는 반드시 처방이 같이 간다.
 */

/** 이 축이 두꺼울 때 팀에서 실제로 보이는 장면 */
const THICK: Record<TraitAxis, string> = {
  추진: '결정이 빠릅니다. 회의가 길어지기 전에 누군가 먼저 밀어붙입니다',
  기획: '새 안이 마르지 않습니다. 판을 짜는 사람이 여럿입니다',
  조율: '사이가 잘 안 어긋납니다. 커지기 전에 누군가 붙여놓습니다',
  실행: '말한 게 실제로 나옵니다. 손이 빠른 팀입니다',
  분석: '허투루 넘어가는 결정이 없습니다. 근거를 따지는 사람이 있습니다',
}

/** 이 축이 얇을 때 벌어지는 일과, 오늘 해볼 수 있는 것 */
const THIN: Record<TraitAxis, { effect: string; fix: string }> = {
  추진: {
    effect: '밀어붙이는 사람이 없어서 결정이 자꾸 다음 주로 넘어갑니다',
    fix: '안건마다 결정권자를 한 명 정해두세요. 합의가 아니라 결정입니다',
  },
  기획: {
    effect: '하던 건 잘 굴러가는데 다음에 뭘 할지가 잘 안 나옵니다',
    fix: '한 달에 한 번 일 얘기 없이 요즘 뭐가 궁금한지만 나누는 자리를 만드세요',
  },
  조율: {
    effect: '각자 잘하는데 사이를 붙여주는 사람이 없어서 한번 부딪히면 오래갑니다',
    fix: '회의마다 진행자를 한 명 두고, 그 사람은 의견을 내지 않는 규칙을 두세요',
  },
  실행: {
    effect: '계획은 좋은데 손이 잘 안 갑니다. 회의록만 두꺼워집니다',
    fix: '회의 끝에 이번 주에 만들 것 하나를 정하고 담당자 이름까지 붙이세요',
  },
  분석: {
    effect: '빠른데 재보는 사람이 없어서 나중에 돌아와 수습하는 일이 붙습니다',
    fix: '결정하기 전에 반대 근거 한 줄만 적어보세요. 한 줄이면 충분합니다',
  },
}

export type TraitReading = {
  top: TraitAxis
  bottom: TraitAxis
  /** 제일 두꺼운 값과 같은 축 전부. 동점이면 여러 개다 */
  topAxes: TraitAxis[]
  /** 제일 얇은 값과 같은 축 전부 */
  bottomAxes: TraitAxis[]
  /** 두꺼운 축 한 줄 */
  strength: string
  /** 얇은 축이 만드는 장면 */
  gap: string
  /** 얇은 축 처방 */
  fix: string
  /** 다섯 축이 고르게 나왔나 */
  even: boolean
}

/**
 * 다섯 축이 이 폭 안에 들어오면 고른 걸로 본다.
 *
 * `normalizeTraits` 가 합 100인 정수를 내니 평균은 20이다. 12면 축마다 평균에서
 * 6%p 안쪽이라는 뜻이고, 오행 쪽 `BALANCED_ARCHETYPE_THRESHOLD` 75가 허용하는
 * 축당 8%p 와 비슷한 눈금이 된다.
 *
 * 6으로 잡았더니 너무 빡빡했다. traits 는 십신 개수에서 나오는 거친 값이라
 * 소규모 팀에서 spread 6이 거의 안 나와서 even 분기가 죽어 있었고, 반대로
 * 4%p 차이를 놓고 "제일 얇습니다" 를 단정하게 됐다.
 */
const EVEN_SPREAD = 12

export function readTraits(traits: TraitAxes): TraitReading {
  const sorted = [...TRAIT_AXES].sort((a, b) => traits[b] - traits[a])
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  const thin = THIN[bottom]

  // 0% 인 축이 둘 나오는 일이 실제로 있다. 값이 같은데 하나만 강조하면
  // 읽는 사람 눈에는 그냥 버그로 보인다
  const topAxes = TRAIT_AXES.filter((a) => traits[a] === traits[top])
  const bottomAxes = TRAIT_AXES.filter((a) => traits[a] === traits[bottom])

  return {
    top,
    bottom,
    topAxes,
    bottomAxes,
    strength: THICK[top],
    gap: thin.effect,
    fix: thin.fix,
    even: traits[top] - traits[bottom] <= EVEN_SPREAD,
  }
}
