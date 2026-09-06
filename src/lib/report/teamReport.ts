import { ELEMENTS, ELEMENT_MISSING_EFFECT, ELEMENT_TEAM_MEANING } from '../saju/constants'
import { analyzeTeam } from '../saju/team'
import type { Element, SajuChart, TeamAnalysis } from '../saju/types'
import { getArchetype, type Archetype } from './archetypes'
import { teamModifiers, type Modifier } from './modifiers'

export type TeamReport = {
  analysis: TeamAnalysis
  archetype: Archetype
  dominant: { element: Element; percent: number; meaning: string }
  lacking: { element: Element; percent: number; effect: string }
  /** 유형 위에 얹는 변주. 같은 유형이어도 이게 다르면 다른 팀이다 */
  modifiers: Modifier[]
}

/** 계산 결과를 화면이 바로 쓸 수 있는 모양으로 바꾼다 */
export function buildTeamReport(
  charts: SajuChart[],
  teamName: string,
): TeamReport {
  const analysis = analyzeTeam(charts, teamName)
  const { dominant, lacking, percents } = analysis.elements

  return {
    analysis,
    archetype: getArchetype(analysis.archetypeId),
    dominant: {
      element: dominant,
      percent: percents[dominant],
      meaning: ELEMENT_TEAM_MEANING[dominant],
    },
    lacking: {
      element: lacking,
      percent: percents[lacking],
      effect: ELEMENT_MISSING_EFFECT[lacking],
    },
    modifiers: teamModifiers(analysis, charts),
  }
}

export { ELEMENTS }
