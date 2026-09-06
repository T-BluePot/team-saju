import { TRAIT_AXES } from '../saju/constants'
import type { SajuChart, TeamAnalysis } from '../saju/types'

/**
 * 유형 위에 얹는 변주.
 *
 * 지금은 주도와 결핍 두 변수뿐이라 3인 팀과 8인 팀이 같은 결과로 떨어진다.
 * 같은 "브레이크 없는 팀" 이어도 이게 다르면 다른 팀이다.
 *
 * **사람을 지목하지 않는다.** 누가 고립됐는지 이름을 쓰면 배제하는 UI 가 된다.
 * "한 명" 으로만 말하고 처방은 팀이 할 일로 쓴다.
 */

export type Modifier = {
  id: string
  /** 짧은 꼬리표 */
  label: string
  /** 무슨 뜻인지 */
  line: string
  /** 짚고 넘어가는 쪽이면 처방이 붙는다 */
  fix?: string
}

/** 이 폭 안에 들어오면 한쪽으로 쏠린 걸로 본다 */
const LEAN_RATIO = 0.7

/** 5축에서 이 아래면 비어 있는 걸로 본다 */
const EMPTY_AXIS = 5

function strengthLean(charts: SajuChart[]): Modifier | null {
  if (charts.length < 2) return null

  const strong = charts.filter((c) => c.strength.level === 'strong').length
  const weak = charts.filter((c) => c.strength.level === 'weak').length
  const need = Math.ceil(charts.length * LEAN_RATIO)

  if (strong >= need) {
    return {
      id: 'all-strong',
      label: '다 밀어붙이는 쪽',
      line: '자기 축이 뚜렷한 사람이 대부분입니다. 각자 판단이 빠른 대신 서로 안 굽힙니다',
      fix: '결론이 갈리면 누가 정할지를 안건마다 미리 정해두세요',
    }
  }
  if (weak >= need) {
    return {
      id: 'all-weak',
      label: '다 맞춰주는 쪽',
      line: '환경에 잘 맞추는 사람이 대부분입니다. 부딪히는 일이 적은 대신 아무도 안 밀어붙입니다',
      fix: '일마다 먼저 움직일 사람 한 명을 정해두세요. 다 같이 기다리는 걸 막습니다',
    }
  }
  return {
    id: 'mixed-strength',
    label: '섞인 쪽',
    line: '미는 사람과 맞추는 사람이 섞여 있습니다. 역할이 자연스럽게 갈립니다',
  }
}

function emptyAxes(traits: TeamAnalysis['traits']): Modifier | null {
  const empty = TRAIT_AXES.filter((a) => traits[a] <= EMPTY_AXIS)
  if (empty.length === 0) return null

  const names = empty.join('과 ')
  return {
    id: 'empty-axis',
    label: `${names} 공백`,
    line: `${names} 쪽이 거의 비어 있습니다. 그 일이 생기면 매번 같은 사람이 떠맡습니다`,
    fix: '그 자리를 사람이 아니라 규칙으로 메우세요. 회의 끝에 정해두는 절차 하나면 됩니다',
  }
}

function chainBreak(analysis: TeamAnalysis): Modifier | null {
  // 상생이 하나도 없으면 서로 밀어주는 사슬이 아예 없다
  if (analysis.size < 2) return null
  if (analysis.pairCounts.generating > 0) return null

  return {
    id: 'no-generating',
    label: '밀어주는 짝이 없음',
    line: '서로 기운을 밀어주는 조합이 한 쌍도 없습니다. 각자 자기 힘으로만 굴러갑니다',
    fix: '한 사람이 다 끌지 않게 일을 짝으로 묶어보세요. 조합이 없으면 순서라도 만듭니다',
  }
}

function isolated(analysis: TeamAnalysis): Modifier | null {
  if (analysis.size < 3) return null
  // 상생이 아예 없으면 chainBreak 가 같은 얘기를 이미 한다
  if (analysis.pairCounts.generating === 0) return null

  const linked = new Set<string>()
  for (const p of analysis.pairs) {
    if (p.relation === 'generating') {
      linked.add(p.aId)
      linked.add(p.bId)
    }
  }
  const alone = analysis.size - linked.size
  if (alone === 0) return null

  // 이름을 쓰지 않는다. 누가 겉도는지 지목하면 배제하는 UI 가 된다
  return {
    id: 'isolated',
    label: alone === 1 ? '혼자 도는 자리 하나' : `혼자 도는 자리 ${alone}개`,
    line:
      alone === 1
        ? '누구와도 밀어주는 관계가 아닌 자리가 하나 있습니다. 그 자리가 겉돌기 쉽습니다'
        : `밀어주는 관계에 안 들어간 자리가 ${alone}개 있습니다. 그 자리들이 겉돌기 쉽습니다`,
    fix: '그 자리를 없애는 게 아니라 짝을 붙이면 됩니다. 다른 결이 섞이면 사각지대가 줄어듭니다',
  }
}

function sizeBand(size: number): Modifier {
  if (size <= 3) {
    return {
      id: 'small',
      label: '작은 팀',
      line: '한 명이 빠지면 기운이 크게 흔들립니다. 대신 합을 맞추기는 제일 쉽습니다',
    }
  }
  if (size <= 6) {
    return {
      id: 'medium',
      label: '중간 팀',
      line: '역할이 갈릴 만큼은 되고 말이 안 통할 만큼 크지도 않습니다',
    }
  }
  return {
    id: 'large',
    label: '큰 팀',
    line: '기운이 고르게 섞여서 유형이 흐릿해지기 쉽습니다. 나눠서 보면 더 선명합니다',
    fix: '셋씩 나눠서 각각 돌려보세요. 팀 안의 팀이 보입니다',
  }
}

/**
 * 이 팀만의 변주를 모은다.
 *
 * 순서는 눈에 띄는 것부터다. 인원수는 항상 마지막이다. 늘 나오는 얘기라 앞에 두면 지겹다.
 */
export function teamModifiers(analysis: TeamAnalysis, charts: SajuChart[]): Modifier[] {
  return [
    chainBreak(analysis),
    isolated(analysis),
    emptyAxes(analysis.traits),
    strengthLean(charts),
    sizeBand(analysis.size),
  ].filter((m): m is Modifier => m !== null)
}
