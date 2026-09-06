import {
  CONTROLLED_BY,
  CONTROLS,
  ELEMENTS,
  ELEMENT_FLAG_THRESHOLD,
  GENERATED_BY,
  GENERATES,
  HIDDEN_STEMS,
  STEM_ELEMENT,
  STRENGTH_THRESHOLD,
  WEIGHT,
} from './constants'
import type {
  Branch,
  Element,
  ElementDistribution,
  ElementFlag,
  ElementScores,
  Stem,
  Strength,
} from './types'

export function emptyScores(): ElementScores {
  return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
}

/** 월지 보너스는 한 번만 주어야 해서 지지 배열에 중복이 있어도 monthBranch 로 걸러진다 */
export function computeElementScoresWithMonthIndex(
  stems: Stem[],
  branches: Branch[],
  monthBranchIndex: number,
): ElementScores {
  const scores = emptyScores()

  for (const stem of stems) {
    scores[STEM_ELEMENT[stem]] += WEIGHT.stem
  }

  branches.forEach((branch, i) => {
    const bonus = i === monthBranchIndex ? WEIGHT.monthBranchBonus : 1
    const hidden = HIDDEN_STEMS[branch]

    scores[STEM_ELEMENT[hidden.main]] += WEIGHT.branchMain * bonus
    if (hidden.middle) {
      scores[STEM_ELEMENT[hidden.middle]] += WEIGHT.branchMiddle * bonus
    }
    if (hidden.residual) {
      scores[STEM_ELEMENT[hidden.residual]] += WEIGHT.branchResidual * bonus
    }
  })

  return scores
}

export function addScores(a: ElementScores, b: ElementScores): ElementScores {
  const result = emptyScores()
  for (const el of ELEMENTS) result[el] = a[el] + b[el]
  return result
}

/**
 * 비율로 바꾼다. 반올림 오차는 가장 큰 원소가 흡수해서 합이 항상 100이 되게 한다.
 * 리포트에 비율을 그대로 보여주니까 합이 99나 101이면 눈에 띈다.
 */
export function toPercents(scores: ElementScores): ElementScores {
  const total = ELEMENTS.reduce((sum, el) => sum + scores[el], 0)
  if (total === 0) return { 木: 20, 火: 20, 土: 20, 金: 20, 水: 20 }

  const percents = emptyScores()
  for (const el of ELEMENTS) {
    percents[el] = Math.round((scores[el] / total) * 100)
  }

  const diff = 100 - ELEMENTS.reduce((sum, el) => sum + percents[el], 0)
  if (diff !== 0) {
    const biggest = ELEMENTS.reduce((a, b) => (scores[a] >= scores[b] ? a : b))
    percents[biggest] += diff
  }
  return percents
}

/** 동점이면 목 화 토 금 수 순서로 자른다. 문서 03-saju-spec.md 7장 */
export function pickDominant(scores: ElementScores): Element {
  return ELEMENTS.reduce((a, b) => (scores[b] > scores[a] ? b : a))
}

export function pickLacking(scores: ElementScores): Element {
  return ELEMENTS.reduce((a, b) => (scores[b] < scores[a] ? b : a))
}

export function buildDistribution(scores: ElementScores): ElementDistribution {
  return {
    scores,
    percents: toPercents(scores),
    dominant: pickDominant(scores),
    lacking: pickLacking(scores),
  }
}

/**
 * 일간 강약. 아군은 비겁과 인성, 적군은 식상 재성 관성.
 * 실제 명리학은 통근 투출 합충까지 봐야 한다. 이건 정량화 가능한 근사치라
 * UI에 "간이 판정"이라고 명시한다. 문서 03-saju-spec.md 5장
 */
export function computeStrength(
  dayElement: Element,
  scores: ElementScores,
): Strength {
  const support = scores[dayElement] + scores[GENERATED_BY[dayElement]]
  const drain =
    scores[GENERATES[dayElement]] +
    scores[CONTROLS[dayElement]] +
    scores[CONTROLLED_BY[dayElement]]

  const total = support + drain
  const index = total === 0 ? 50 : Math.round((support / total) * 100)

  const level =
    index >= STRENGTH_THRESHOLD.strong
      ? 'strong'
      : index < STRENGTH_THRESHOLD.weak
        ? 'weak'
        : 'balanced'

  return { index, level, support, drain }
}

export function flagElements(
  percents: ElementScores,
): Record<Element, ElementFlag> {
  const flags = {} as Record<Element, ElementFlag>
  for (const el of ELEMENTS) {
    const v = percents[el]
    flags[el] =
      v === 0
        ? 'empty'
        : v >= ELEMENT_FLAG_THRESHOLD.excess
          ? 'excess'
          : v <= ELEMENT_FLAG_THRESHOLD.lacking
            ? 'lacking'
            : 'normal'
  }
  return flags
}

/**
 * 팀 균형 점수. 100이면 완전 균등.
 * 편차 = 각 원소가 20에서 얼마나 벗어났나의 합 / 2
 * 문서 03-saju-spec.md 7장
 */
export function computeBalance(percents: ElementScores): number {
  const deviation =
    ELEMENTS.reduce((sum, el) => sum + Math.abs(percents[el] - 20), 0) / 2
  return Math.max(0, Math.min(100, Math.round(100 - deviation * 1.25)))
}
