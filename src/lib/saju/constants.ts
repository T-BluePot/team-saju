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

export type HourBranch = {
  branch: Branch
  /** 화면에 세우는 이름 */
  name: string
  /** 시계 시각 [시, 분]. `to` 는 그 분까지 포함한다 */
  from: [number, number]
  to: [number, number]
  /** 고르면 저장하는 시각. 구간 한가운데다 */
  at: [number, number]
}

/**
 * 십이지시. 시간을 시각이 아니라 지시로 고를 때 쓴다.
 *
 * 경계가 30분씩 밀려 있는 건 진태양시 때문이다. 한국은 동경 135도를 표준자오선으로
 * 쓰는데 국토는 127.5도쯤에 있어서 시계가 태양보다 30분 빠르다. 문서 03-saju-spec.md
 *
 * **`at` 은 구간의 시작이 아니라 한가운데다.** 경계값을 저장하면 진태양시 보정을
 * 껐을 때 옆 칸으로 넘어간다. 한가운데는 보정을 켜든 끄든 같은 지시에 남는다.
 *
 * 자시가 둘이다. 야자시설을 쓰므로 23시 이후는 다음날 일주로 본다 (같은 문서).
 * 갈리는 자리는 **진태양시 00:00, 곧 시계로 00:30** 이다. 시계 자정으로 끊으면
 * 00:00~00:29 가 조자시로 들어가는데 그 30분은 진태양시로 23:30~23:59 라 야자시다.
 *
 * 야자시 한 칸에는 자정 앞뒤가 같이 들어간다. 같은 시각을 두고도 생년월일을
 * 자정 앞으로 적은 사람과 뒤로 적은 사람이 있어서, 한 칸에 시각 하나만 둘 수는
 * 없다. `at` 은 자정 앞(23:45)으로 잡았다. 자정을 넘겨 태어났으면 직접 입력이 맞다.
 */
export const HOUR_BRANCHES: HourBranch[] = [
  { branch: '子', name: '야자시', from: [23, 30], to: [0, 29], at: [23, 45] },
  { branch: '子', name: '자시', from: [0, 30], to: [1, 29], at: [0, 45] },
  { branch: '丑', name: '축시', from: [1, 30], to: [3, 29], at: [2, 30] },
  { branch: '寅', name: '인시', from: [3, 30], to: [5, 29], at: [4, 30] },
  { branch: '卯', name: '묘시', from: [5, 30], to: [7, 29], at: [6, 30] },
  { branch: '辰', name: '진시', from: [7, 30], to: [9, 29], at: [8, 30] },
  { branch: '巳', name: '사시', from: [9, 30], to: [11, 29], at: [10, 30] },
  { branch: '午', name: '오시', from: [11, 30], to: [13, 29], at: [12, 30] },
  { branch: '未', name: '미시', from: [13, 30], to: [15, 29], at: [14, 30] },
  { branch: '申', name: '신시', from: [15, 30], to: [17, 29], at: [16, 30] },
  { branch: '酉', name: '유시', from: [17, 30], to: [19, 29], at: [18, 30] },
  { branch: '戌', name: '술시', from: [19, 30], to: [21, 29], at: [20, 30] },
  { branch: '亥', name: '해시', from: [21, 30], to: [23, 29], at: [22, 30] },
]

/**
 * 시계 시각이 어느 지시에 드는가.
 *
 * 직접 입력에서 지시로 돌아올 때 고른 칸을 되살리는 데 쓴다.
 * 야자시만 자정을 걸쳐서 `from` 이 `to` 보다 크다. 그 칸은 둘 중 하나만 맞으면 든다.
 */
export function hourBranchAt(hour: number, minute: number): HourBranch | null {
  const m = hour * 60 + minute
  return (
    HOUR_BRANCHES.find((b) => {
      const from = b.from[0] * 60 + b.from[1]
      const to = b.to[0] * 60 + b.to[1]
      return from > to ? m >= from || m <= to : m >= from && m <= to
    }) ?? null
  )
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

/**
 * 균형점수가 이 이상이면 결핍을 따지지 않고 균형형.
 *
 * 원래 75였다. 인원이 늘수록 오행이 저절로 섞여서 점수가 올라가는데, 실측하니
 * 5명 팀의 97%가 75를 넘었다. 그러면 20유형이 화면에 안 나온다. 85면 5명 팀의
 * 41%가 제 유형을 받는다. 분포표는 07-team-report.md 에 있다.
 */
export const BALANCED_ARCHETYPE_THRESHOLD = 85

/**
 * 이 이상이면 황금 균형형.
 *
 * 어느 인원에서도 드물다. 1명 0.3%, 8명 4%. 균형형과 갈라놓은 건 99점 팀과
 * 86점 팀이 같은 결론을 받고 있어서다.
 */
export const GOLDEN_ARCHETYPE_THRESHOLD = 95

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
