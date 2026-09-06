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

/**
 * 5축을 합이 100인 비율로. 전부 0이면 균등하게 나눈다.
 *
 * 최대 잔차 분배를 쓴다. 내림한 뒤 남은 몫을 소수부가 큰 축부터 하나씩 준다.
 *
 * 예전에는 앞 네 축을 반올림하고 마지막 축에 `100 - assigned` 를 몰아줬는데,
 * 앞 넷의 반올림이 올림으로 몰리면 **마지막 축이 음수가 됐다.**
 * 막대 폭에 음수가 들어가고 5축 공백 판정에도 걸려서 화면 문구로 새어 나왔다.
 *
 * 잔차가 같으면 `TRAIT_AXES` 순서가 이긴다. 정렬이 안정적이라 결정론적이다.
 */
export function normalizeTraits(traits: TraitAxes): TraitAxes {
  const total = TRAIT_AXES.reduce((sum, a) => sum + traits[a], 0)
  if (total === 0) {
    return Object.fromEntries(TRAIT_AXES.map((a) => [a, 20])) as TraitAxes
  }

  const exact = TRAIT_AXES.map((axis) => ({ axis, value: (traits[axis] / total) * 100 }))
  const result = emptyTraits()
  let assigned = 0
  for (const { axis, value } of exact) {
    const floor = Math.floor(value)
    result[axis] = floor
    assigned += floor
  }

  const rest = 100 - assigned
  const byRemainder = [...exact].sort((a, b) => (b.value % 1) - (a.value % 1))
  for (let i = 0; i < rest; i++) {
    result[byRemainder[i].axis] += 1
  }
  return result
}
