import type {
  Branch,
  Element,
  Stem,
  TenGod,
  TraitAxis,
  YinYang,
} from './types'

export const ELEMENTS: Element[] = ['木', '火', '土', '金', '水']

export const ELEMENT_LABEL: Record<Element, string> = {
  木: '목',
  火: '화',
  土: '토',
  金: '금',
  水: '수',
}

/** 팀에서 이 기운이 뜻하는 것. 문서 07-team-report.md */
export const ELEMENT_TEAM_MEANING: Record<Element, string> = {
  木: '새 아이디어, 시작, 확장',
  火: '열정, 속도, 표현',
  土: '안정, 중재, 축적',
  金: '기준, 결단, 마감',
  水: '유연, 통찰, 질문',
}

export const ELEMENT_MISSING_EFFECT: Record<Element, string> = {
  木: '하던 것만 반복한다',
  火: '불이 안 붙는다',
  土: '쌓이는 게 없다',
  金: '자르질 못한다',
  水: '왜 하는지 안 묻는다',
}

export const STEMS: Stem[] = [
  '甲', '乙', '丙', '丁', '戊',
  '己', '庚', '辛', '壬', '癸',
]

export const BRANCHES: Branch[] = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥',
]

export const STEM_ELEMENT: Record<Stem, Element> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

export const STEM_YINYANG: Record<Stem, YinYang> = {
  甲: '陽', 乙: '陰',
  丙: '陽', 丁: '陰',
  戊: '陽', 己: '陰',
  庚: '陽', 辛: '陰',
  壬: '陽', 癸: '陰',
}

/** 지지 본기 오행 */
export const BRANCH_ELEMENT: Record<Branch, Element> = {
  寅: '木', 卯: '木',
  巳: '火', 午: '火',
  辰: '土', 戌: '土', 丑: '土', 未: '土',
  申: '金', 酉: '金',
  亥: '水', 子: '水',
}

/**
 * 지장간. 여기(餘氣) / 중기(中氣) / 정기(正氣).
 * 본기만 세면 土가 과대평가되고 실제 기운을 놓친다.
 * 문서 03-saju-spec.md 4.2
 */
export const HIDDEN_STEMS: Record<
  Branch,
  { residual: Stem | null; middle: Stem | null; main: Stem }
> = {
  子: { residual: '壬', middle: null, main: '癸' },
  丑: { residual: '癸', middle: '辛', main: '己' },
  寅: { residual: '戊', middle: '丙', main: '甲' },
  卯: { residual: '甲', middle: null, main: '乙' },
  辰: { residual: '乙', middle: '癸', main: '戊' },
  巳: { residual: '戊', middle: '庚', main: '丙' },
  午: { residual: '丙', middle: '己', main: '丁' },
  未: { residual: '丁', middle: '乙', main: '己' },
  申: { residual: '戊', middle: '壬', main: '庚' },
  酉: { residual: '庚', middle: null, main: '辛' },
  戌: { residual: '辛', middle: '丁', main: '戊' },
  亥: { residual: '戊', middle: null, main: '壬' },
}

/** 문서 03-saju-spec.md 4.3 */
export const WEIGHT = {
  stem: 1.0,
  branchMain: 1.0,
  branchMiddle: 0.3,
  branchResidual: 0.2,
  /** 월령. 계절 기운이 가장 강하다 */
  monthBranchBonus: 1.5,
} as const

/** 상생. 木 -> 火 -> 土 -> 金 -> 水 -> 木 */
export const GENERATES: Record<Element, Element> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
}

/** 상극. 木 -> 土 -> 水 -> 火 -> 金 -> 木 */
export const CONTROLS: Record<Element, Element> = {
  木: '土',
  土: '水',
  水: '火',
  火: '金',
  金: '木',
}

/** 나를 생하는 오행 */
export const GENERATED_BY: Record<Element, Element> = {
  火: '木',
  土: '火',
  金: '土',
  水: '金',
  木: '水',
}

/** 나를 극하는 오행 */
export const CONTROLLED_BY: Record<Element, Element> = {
  土: '木',
  水: '土',
  火: '水',
  金: '火',
  木: '金',
}

/** 십신 -> 협업 5축. 문서 03-saju-spec.md 6장 */
export const TEN_GOD_TRAIT: Record<TenGod, TraitAxis> = {
  비견: '실행',
  겁재: '추진',
  식신: '실행',
  상관: '기획',
  편재: '추진',
  정재: '분석',
  편관: '추진',
  정관: '조율',
  편인: '기획',
  정인: '분석',
}

export const TEN_GOD_KEYWORD: Record<TenGod, string> = {
  비견: '자립, 동료의식',
  겁재: '경쟁, 돌파',
  식신: '표현, 몰입',
  상관: '창의, 비판',
  편재: '기회포착, 확장',
  정재: '관리, 꼼꼼함',
  편관: '결단, 위기대응',
  정관: '원칙, 프로세스',
  편인: '통찰, 비정형 학습',
  정인: '학습, 문서화',
}

export const TRAIT_AXES: TraitAxis[] = ['추진', '기획', '조율', '실행', '분석']

export const TEN_GODS: TenGod[] = [
  '비견', '겁재', '식신', '상관', '편재',
  '정재', '편관', '정관', '편인', '정인',
]

/** 강약 판정 경계. 문서 03-saju-spec.md 5장 */
export const STRENGTH_THRESHOLD = { strong: 58, weak: 42 } as const

/** 과잉 결핍 판정. 문서 03-saju-spec.md 7장 */
export const ELEMENT_FLAG_THRESHOLD = { excess: 30, lacking: 12 } as const

/** 균형점수가 이 이상이면 결핍을 따지지 않고 균형형 */
export const BALANCED_ARCHETYPE_THRESHOLD = 75
