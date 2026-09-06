/** 오행. 문서 03-saju-spec.md 4장 */
export type Element = '木' | '火' | '土' | '金' | '水'

/** 천간 */
export type Stem =
  | '甲' | '乙' | '丙' | '丁' | '戊'
  | '己' | '庚' | '辛' | '壬' | '癸'

/** 지지 */
export type Branch =
  | '子' | '丑' | '寅' | '卯' | '辰' | '巳'
  | '午' | '未' | '申' | '酉' | '戌' | '亥'

export type YinYang = '陽' | '陰'

/** 십신. 문서 03-saju-spec.md 6장 */
export type TenGod =
  | '비견' | '겁재'
  | '식신' | '상관'
  | '편재' | '정재'
  | '편관' | '정관'
  | '편인' | '정인'

/** 협업 5축 */
export type TraitAxis = '추진' | '기획' | '조율' | '실행' | '분석'
export type TraitAxes = Record<TraitAxis, number>

export type PillarKind = 'year' | 'month' | 'day' | 'hour'

export type Pillar = {
  kind: PillarKind
  stem: Stem
  branch: Branch
  /** 천간의 십신. 일주는 일간 자신이라 null */
  stemGod: TenGod | null
  /** 지지 정기의 십신 */
  branchGod: TenGod
  /**
   * 십이운성. 일간이 이 지지에서 어느 세기에 있나.
   * 원어가 아니라 기운의 세기로 옮긴 말이다. `docs/03-saju-spec.md` 참고
   */
  stage: string
  /** 납음오행. 해중금 노중화 같은 60갑자 별칭 */
  naYin: string
  /** 지지에 든 천간. 오행 계산에 쓰던 걸 화면에도 펼친다 */
  hiddenStems: Stem[]
}

export type ElementScores = Record<Element, number>

export type ElementDistribution = {
  /** 가중 합산 원점수 */
  scores: ElementScores
  /** 0~100 비율. 합이 100 (반올림 오차는 최대 원소가 흡수) */
  percents: ElementScores
  dominant: Element
  lacking: Element
}

export type StrengthLevel = 'strong' | 'balanced' | 'weak'

export type Strength = {
  /** 아군 / (아군 + 적군) x 100 */
  index: number
  level: StrengthLevel
  support: number
  drain: number
}

export type TenGodCount = Record<TenGod, number>

/** 어떤 보정이 적용됐는지. 결과 화면에 근거로 노출한다 */
export type AppliedCorrection = {
  kind: 'dst' | 'longitude' | 'lunar' | 'lateZi'
  label: string
  detail: string
}

export type ConsentSource = 'self' | 'delegated'

export type MemberInput = {
  id: string
  name: string
  /** 'YYYY-MM-DD' */
  birthDate: string
  /** null 이면 시간 모름 */
  birthHour: number | null
  birthMinute: number
  calendar: 'solar' | 'lunar'
  isLeapMonth: boolean
  useTrueSolarTime: boolean
  consent: {
    source: ConsentSource
    confirmedAt: string
  }
}

export type SajuChart = {
  member: MemberInput
  pillars: {
    year: Pillar
    month: Pillar
    day: Pillar
    hour: Pillar | null
  }
  dayMaster: {
    stem: Stem
    element: Element
    yinYang: YinYang
  }
  elements: ElementDistribution
  strength: Strength
  tenGods: TenGodCount
  traits: TraitAxes
  /**
   * 공망. 일주 기준 순중에서 비는 지지 둘이다.
   * 빈 칸이라는 뜻이지 나쁜 게 아니다. 운을 점치는 데 쓰지 않는다
   */
  voidBranches: Branch[]
  corrections: AppliedCorrection[]
}

/** 오행 관계 */
export type PairRelation = 'generating' | 'same' | 'tension'

/**
 * 두 사람의 관계. **문장은 여기 없다.**
 *
 * 계산은 관계와 방향까지만 낸다. 사용자에게 보이는 문장은 `lib/report/pairs.ts` 가 만든다.
 * 계산 레이어가 카피를 들고 있으면 문구 한 글자 고칠 때마다 계산 테스트가 깨진다.
 */
type PairBase = {
  aId: string
  bId: string
  aName: string
  bName: string
  score: number
  /** 두 사람의 주도 오행 */
  aElement: Element
  bElement: Element
}

/**
 * 방향. 미는 쪽이나 브레이크를 거는 쪽이 누구인가. `ab` 면 a 가 주체다.
 *
 * 관계와 묶어서 유니온으로 둔다. 한 필드로 두면 `tension` 인데 방향이 없는 값이
 * 타입상 만들어지고, 읽는 쪽이 그걸 조용히 `'ab'` 로 떨어뜨린다.
 */
export type PairChemistry =
  | (PairBase & { relation: 'same'; flow: null })
  | (PairBase & { relation: Exclude<PairRelation, 'same'>; flow: 'ab' | 'ba' })

export type ElementFlag = 'excess' | 'lacking' | 'empty' | 'normal'

export type TeamAnalysis = {
  size: number
  teamName: string
  elements: ElementDistribution
  flags: Record<Element, ElementFlag>
  /** 0~100. 100 이면 완전 균등 */
  balance: number
  pairs: PairChemistry[]
  pairCounts: { generating: number; same: number; tension: number }
  traits: TraitAxes
  archetypeId: string
}

/** 링크에 담기는 전부. 생년월일, 이름, 개인 간지가 없다 */
export type SharePayload = {
  v: 1
  teamName: string
  size: number
  /** 木火土金水 순서의 비율 */
  elements: [number, number, number, number, number]
  balance: number
  pairs: { generating: number; same: number; tension: number }
}
