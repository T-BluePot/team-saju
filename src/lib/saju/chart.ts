import { Lunar, Solar } from 'lunar-typescript'

import {
  HIDDEN_STEMS,
  NAYIN_KO,
  STEM_ELEMENT,
  STEM_YINYANG,
  TWELVE_STAGE_KO,
} from './constants'
import {
  buildDistribution,
  computeElementScoresWithMonthIndex,
  computeStrength,
} from './elements'
import {
  emptyTenGodCount,
  getTenGod,
  normalizeTraits,
  tenGodsToTraits,
} from './tenGods'
import { correctTime } from './timeCorrection'
import type {
  AppliedCorrection,
  Branch,
  MemberInput,
  Pillar,
  PillarKind,
  SajuChart,
  Stem,
} from './types'

/** 시간을 모를 때 쓰는 기준 시각. 절기 경계에서만 의미가 있다 */
const UNKNOWN_HOUR = 12

/**
 * 야자시설. 23시 이후는 다음날 일주로 본다.
 * 라이브러리 기본값이 2(당일 유지)라 명시적으로 1로 바꿔야 한다.
 * 문서 03-saju-spec.md 3.5
 */
const SECT_LATE_ZI = 1

export class SajuInputError extends Error {}

function parseDate(birthDate: string): [number, number, number] {
  const parts = birthDate.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    throw new SajuInputError(`날짜 형식이 올바르지 않습니다: ${birthDate}`)
  }
  return [parts[0], parts[1], parts[2]]
}

/** 음력을 양력으로 옮긴다. 윤달은 월을 음수로 넣는 게 라이브러리 규칙이다 */
function toSolarDate(
  member: MemberInput,
  hour: number,
  minute: number,
): { year: number; month: number; day: number } {
  const [y, m, d] = parseDate(member.birthDate)

  if (member.calendar === 'solar') {
    return { year: y, month: m, day: d }
  }

  const lunarMonth = member.isLeapMonth ? -m : m
  let solar
  try {
    solar = Lunar.fromYmdHms(y, lunarMonth, d, hour, minute, 0).getSolar()
  } catch {
    throw new SajuInputError('그 음력 날짜는 존재하지 않습니다. 윤달 여부를 확인해 주세요')
  }
  if (!solar) {
    throw new SajuInputError('음력을 양력으로 바꾸지 못했습니다')
  }
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() }
}

function buildPillar(
  kind: PillarKind,
  ganZhi: string,
  dayStem: Stem,
  rawStage: string,
  rawNaYin: string,
): Pillar {
  const stem = ganZhi[0] as Stem
  const branch = ganZhi[1] as Branch
  return {
    kind,
    stem,
    branch,
    stemGod: kind === 'day' ? null : getTenGod(dayStem, stem),
    branchGod: getTenGod(dayStem, hiddenMainOf(branch)),
    // 매핑에 없으면 원문을 그대로 둔다. 표 하나 때문에 계산이 멈추면 안 된다
    stage: TWELVE_STAGE_KO[rawStage] ?? rawStage,
    naYin: NAYIN_KO[rawNaYin] ?? rawNaYin,
    hiddenStems: hiddenStemsOf(branch),
  }
}

/** 여기 중기 정기 순이다. 계산에 쓰는 가중치와 같은 순서로 보여준다 */
function hiddenStemsOf(branch: Branch): Stem[] {
  const h = HIDDEN_STEMS[branch]
  return [h.residual, h.middle, h.main].filter((s): s is Stem => s !== null)
}

function hiddenMainOf(branch: Branch): Stem {
  return HIDDEN_STEMS[branch].main
}

/**
 * 입력 하나를 사주 원국으로 바꾼다. 순수 함수다.
 * 같은 입력이면 항상 같은 출력이 나온다. 골든 테스트로 고정한다.
 */
export function buildChart(member: MemberInput): SajuChart {
  const hasHour = member.birthHour !== null
  const rawHour = hasHour ? member.birthHour! : UNKNOWN_HOUR
  const rawMinute = hasHour ? member.birthMinute : 0

  const corrections: AppliedCorrection[] = []
  const solarDate = toSolarDate(member, rawHour, rawMinute)

  if (member.calendar === 'lunar') {
    const pad = (n: number) => String(n).padStart(2, '0')
    corrections.push({
      kind: 'lunar',
      label: '음력을 양력으로 변환',
      detail: `음력 ${member.birthDate}${member.isLeapMonth ? ' 윤달' : ''} 은 양력 ${solarDate.year}-${pad(solarDate.month)}-${pad(solarDate.day)} 입니다`,
    })
  }

  let time = {
    year: solarDate.year,
    month: solarDate.month,
    day: solarDate.day,
    hour: rawHour,
    minute: rawMinute,
  }

  if (hasHour) {
    const corrected = correctTime(
      solarDate.year,
      solarDate.month,
      solarDate.day,
      rawHour,
      rawMinute,
      member.useTrueSolarTime,
    )
    time = corrected
    corrections.push(...corrected.corrections)
  } else {
    corrections.push({
      kind: 'longitude',
      label: '시간 미상',
      detail: '태어난 시간을 몰라서 시주를 빼고 세 기둥만 봤습니다. 절기 경계 판정에는 낮 12시를 기준으로 썼습니다',
    })
  }

  const solar = Solar.fromYmdHms(
    time.year,
    time.month,
    time.day,
    time.hour,
    time.minute,
    0,
  )
  const eightChar = solar.getLunar().getEightChar()
  eightChar.setSect(SECT_LATE_ZI)

  if (hasHour && time.hour === 23) {
    corrections.push({
      kind: 'lateZi',
      label: '야자시',
      detail: '23시 이후라 다음날 일주로 봤습니다. 유파에 따라 당일로 보기도 합니다',
    })
  }

  const dayGanZhi = eightChar.getDay()
  const dayStem = dayGanZhi[0] as Stem

  const year = buildPillar(
    'year',
    eightChar.getYear(),
    dayStem,
    eightChar.getYearDiShi(),
    eightChar.getYearNaYin(),
  )
  const month = buildPillar(
    'month',
    eightChar.getMonth(),
    dayStem,
    eightChar.getMonthDiShi(),
    eightChar.getMonthNaYin(),
  )
  const day = buildPillar(
    'day',
    dayGanZhi,
    dayStem,
    eightChar.getDayDiShi(),
    eightChar.getDayNaYin(),
  )
  const hour = hasHour
    ? buildPillar(
        'hour',
        eightChar.getTime(),
        dayStem,
        eightChar.getTimeDiShi(),
        eightChar.getTimeNaYin(),
      )
    : null

  const pillars = [year, month, day, ...(hour ? [hour] : [])]
  const stems = pillars.map((p) => p.stem)
  const branches = pillars.map((p) => p.branch)
  // [year, month, day, hour] 순서라 월지는 항상 1번
  const scores = computeElementScoresWithMonthIndex(stems, branches, 1)

  const tenGods = emptyTenGodCount()
  for (const p of pillars) {
    if (p.stemGod) tenGods[p.stemGod] += 1
    tenGods[p.branchGod] += 1
  }

  return {
    member,
    pillars: { year, month, day, hour },
    dayMaster: {
      stem: dayStem,
      element: STEM_ELEMENT[dayStem],
      yinYang: STEM_YINYANG[dayStem],
    },
    elements: buildDistribution(scores),
    strength: computeStrength(STEM_ELEMENT[dayStem], scores),
    tenGods,
    traits: normalizeTraits(tenGodsToTraits(tenGods)),
    // 라이브러리가 "戌亥" 처럼 두 글자로 준다
    voidBranches: [...eightChar.getDayXunKong()] as Branch[],
    corrections,
  }
}
