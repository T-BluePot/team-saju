import {
  CONTROLS,
  GENERATES,
  STEM_ELEMENT,
  STEM_YINYANG,
  TEN_GODS,
  TEN_GOD_TRAIT,
  TRAIT_AXES,
} from './constants'
import type { Stem, TenGod, TenGodCount, TraitAxes } from './types'

/**
 * 십신. 일간과 대상 글자의 오행 관계, 그리고 음양이 같은지로 정해진다.
 * 문서 03-saju-spec.md 6장
 */
export function getTenGod(dayStem: Stem, target: Stem): TenGod {
  const me = STEM_ELEMENT[dayStem]
  const other = STEM_ELEMENT[target]
  const same = STEM_YINYANG[dayStem] === STEM_YINYANG[target]

  if (other === me) return same ? '비견' : '겁재'
  if (GENERATES[me] === other) return same ? '식신' : '상관'
  if (CONTROLS[me] === other) return same ? '편재' : '정재'
  if (CONTROLS[other] === me) return same ? '편관' : '정관'
  return same ? '편인' : '정인'
}

export function emptyTenGodCount(): TenGodCount {
  return Object.fromEntries(TEN_GODS.map((g) => [g, 0])) as TenGodCount
}

export function emptyTraits(): TraitAxes {
  return Object.fromEntries(TRAIT_AXES.map((a) => [a, 0])) as TraitAxes
}

/** 십신 분포를 협업 5축으로 옮긴다 */
export function tenGodsToTraits(counts: TenGodCount): TraitAxes {
  const traits = emptyTraits()
  for (const god of TEN_GODS) {
    traits[TEN_GOD_TRAIT[god]] += counts[god]
  }
  return traits
}

/** 5축을 합이 100인 비율로. 전부 0이면 균등하게 나눈다 */
export function normalizeTraits(traits: TraitAxes): TraitAxes {
  const total = TRAIT_AXES.reduce((sum, a) => sum + traits[a], 0)
  if (total === 0) {
    return Object.fromEntries(TRAIT_AXES.map((a) => [a, 20])) as TraitAxes
  }
  const result = emptyTraits()
  let assigned = 0
  TRAIT_AXES.forEach((axis, i) => {
    if (i === TRAIT_AXES.length - 1) {
      result[axis] = 100 - assigned
      return
    }
    const v = Math.round((traits[axis] / total) * 100)
    result[axis] = v
    assigned += v
  })
  return result
}
