import {
  BALANCED_ARCHETYPE_THRESHOLD,
  CONTROLS,
  ELEMENTS,
  GENERATES,
} from './constants'
import {
  addScores,
  buildDistribution,
  computeBalance,
  emptyScores,
  flagElements,
} from './elements'
import { object, subject } from '../text/josa'
import { emptyTraits, normalizeTraits } from './tenGods'
import type {
  Element,
  PairChemistry,
  SajuChart,
  TeamAnalysis,
  TraitAxes,
} from './types'
import { TRAIT_AXES } from './constants'

const ELEMENT_SLUG: Record<Element, string> = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water',
}

export const BALANCED_ARCHETYPE_ID = 'balanced'

/**
 * 팀 유형 id. 주도와 결핍 조합으로 20개, 균형형 1개.
 * 문서 07-team-report.md
 */
export function archetypeIdFor(
  dominant: Element,
  lacking: Element,
  balance: number,
): string {
  if (balance >= BALANCED_ARCHETYPE_THRESHOLD) return BALANCED_ARCHETYPE_ID
  if (dominant === lacking) return BALANCED_ARCHETYPE_ID
  return `${ELEMENT_SLUG[dominant]}-no-${ELEMENT_SLUG[lacking]}`
}

/**
 * 두 사람의 주도 오행 관계로 케미를 본다.
 * 상극을 나쁨으로 표기하지 않는다. 라벨은 긴장감 있는 조합이고 조언이 따라붙는다.
 * 문서 03-saju-spec.md 7.2
 */
export function pairChemistry(a: SajuChart, b: SajuChart): PairChemistry {
  const ea = a.elements.dominant
  const eb = b.elements.dominant
  const an = a.member.name
  const bn = b.member.name

  const base = { aId: a.member.id, bId: b.member.id, aName: an, bName: bn }

  if (ea === eb) {
    return {
      ...base,
      relation: 'same',
      score: 70,
      label: '비슷한 결',
      direction: `둘 다 ${ea} 기운이 앞선다. 말이 잘 통하는 대신 사각지대도 같다`,
    }
  }
  if (GENERATES[ea] === eb) {
    return {
      ...base,
      relation: 'generating',
      score: 90,
      label: '상생',
      direction: `${subject(an)} ${object(bn)} 밀어주는 방향`,
    }
  }
  if (GENERATES[eb] === ea) {
    return {
      ...base,
      relation: 'generating',
      score: 90,
      label: '상생',
      direction: `${subject(bn)} ${object(an)} 밀어주는 방향`,
    }
  }
  if (CONTROLS[ea] === eb) {
    return {
      ...base,
      relation: 'tension',
      score: 55,
      label: '긴장감 있는 조합',
      direction: `${subject(an)} ${bn}에게 브레이크를 거는 방향. 견제가 품질을 올릴 수도 있다`,
    }
  }
  return {
    ...base,
    relation: 'tension',
    score: 55,
    label: '긴장감 있는 조합',
    direction: `${subject(bn)} ${an}에게 브레이크를 거는 방향. 견제가 품질을 올릴 수도 있다`,
  }
}

function sumTraits(charts: SajuChart[]): TraitAxes {
  const total = emptyTraits()
  for (const chart of charts) {
    for (const axis of TRAIT_AXES) total[axis] += chart.traits[axis]
  }
  return normalizeTraits(total)
}

/** 팀 전체 분석. 개인 팩트를 집계로 바꾼다 */
export function analyzeTeam(charts: SajuChart[], teamName: string): TeamAnalysis {
  const scores = charts.reduce(
    (acc, chart) => addScores(acc, chart.elements.scores),
    emptyScores(),
  )
  const elements = buildDistribution(scores)
  const balance = computeBalance(elements.percents)

  const pairs: PairChemistry[] = []
  for (let i = 0; i < charts.length; i += 1) {
    for (let j = i + 1; j < charts.length; j += 1) {
      pairs.push(pairChemistry(charts[i], charts[j]))
    }
  }

  const pairCounts = {
    generating: pairs.filter((p) => p.relation === 'generating').length,
    same: pairs.filter((p) => p.relation === 'same').length,
    tension: pairs.filter((p) => p.relation === 'tension').length,
  }

  return {
    size: charts.length,
    teamName: teamName.trim() || '우리 팀',
    elements,
    flags: flagElements(elements.percents),
    balance,
    pairs,
    pairCounts,
    traits: sumTraits(charts),
    archetypeId: archetypeIdFor(elements.dominant, elements.lacking, balance),
  }
}

/** 오행 순서대로 비율 배열. 공유 페이로드에 쓴다 */
export function elementTuple(
  analysis: TeamAnalysis,
): [number, number, number, number, number] {
  return ELEMENTS.map((el) => analysis.elements.percents[el]) as [
    number, number, number, number, number,
  ]
}
