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

/**
 * 천간과 지지의 우리말 음.
 *
 * 계산에는 안 쓴다. 명식표에서 한자 밑에 음을 같이 보여주려고 둔다.
 * 사주를 처음 보는 사람에게 庚 한 글자는 읽을 수조차 없는 표시다.
 * `TWELVE_STAGE_KO` `NAYIN_KO` 와 같은 갈래라 여기 같이 둔다.
 */
export const STEM_KO: Record<Stem, string> = {
  甲: '갑', 乙: '을',
  丙: '병', 丁: '정',
  戊: '무', 己: '기',
  庚: '경', 辛: '신',
  壬: '임', 癸: '계',
}

export const BRANCH_KO: Record<Branch, string> = {
  子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사',
  午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해',
}

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

/**
 * 십이운성. 일간이 각 지지에서 어느 세기에 있는지.
 *
 * **원어를 화면에 그대로 안 쓴다.** 열둘 중 病 死 墓 絕 넷이
 * `docs/00-product-brief.md` 의 건강 수명 질병 사망 언급 금지에 걸린다.
 * 명리에서는 일생에 빗댄 비유지만, 재미로 보는 화면에 그 글자가 뜨면 놀란다.
 *
 * 라이브러리는 간체로 준다. 대응표는 `docs/03-saju-spec.md` 에 있다.
 */
export const TWELVE_STAGE_KO: Record<string, string> = {
  长生: '막 트는',
  沐浴: '씻기는',
  冠带: '갖추는',
  临官: '자리 잡은',
  帝旺: '제일 센',
  衰: '한풀 꺾인',
  病: '힘이 빠진',
  死: '가라앉은',
  墓: '잠긴',
  绝: '쉬어 가는',
  胎: '다시 맺히는',
  养: '자라는',
}

/** 십이운성이 센 쪽인지. 화면에서 색을 가를 때 쓴다 */
export const STRONG_STAGES = new Set(['막 트는', '갖추는', '자리 잡은', '제일 센', '자라는'])

/**
 * 납음오행. 60갑자마다 붙는 별칭이고 30종이다.
 * 해중금 노중화처럼 이미지가 있어서 읽는 재미가 크다.
 */
export const NAYIN_KO: Record<string, string> = {
  海中金: '해중금',
  炉中火: '노중화',
  大林木: '대림목',
  路旁土: '노방토',
  剑锋金: '검봉금',
  山头火: '산두화',
  涧下水: '간하수',
  城头土: '성두토',
  白蜡金: '백랍금',
  杨柳木: '양류목',
  泉中水: '천중수',
  屋上土: '옥상토',
  霹雳火: '벽력화',
  松柏木: '송백목',
  长流水: '장류수',
  沙中金: '사중금',
  山下火: '산하화',
  平地木: '평지목',
  壁上土: '벽상토',
  金箔金: '금박금',
  覆灯火: '복등화',
  天河水: '천하수',
  大驿土: '대역토',
  钗钏金: '차천금',
  桑柘木: '상자목',
  大溪水: '대계수',
  沙中土: '사중토',
  天上火: '천상화',
  石榴木: '석류목',
  大海水: '대해수',
}
