// 결과 화면. 탭 껍데기, 요약 머리, 분석, 상세 보고서, 기운 카드, 다음 단계.

export const resultCopy = {
  tabTeam: '팀 결과',
  tabPersonal: '개인 명식',
  // 위쪽 탭 옆 버튼과 맨 아래 버튼이 같은 라벨을 쓴다. 같은 동작에 다른
  // 이름이 붙으면 사용자는 둘이 다른 일을 한다고 읽는다
  editMembers: '팀원 수정',
  /** 처방 도장. 분석과 상세 보고서가 같은 글자를 쓴다 */
  prescriptionMark: '處',
} as const

export const exampleNoticeCopy = {
  notice: '예시 데이터로 만든 결과입니다',
  cta: '내 팀 분석하기',
} as const

export const headlineCopy = {
  seal: '占',
  solo: '아직 혼자',
  size: (size: number) => `${size}명`,
} as const

/**
 * 유형 족자. 첫 화면과 결과 화면이 같은 판을 걸어서 문구도 같이 쓴다.
 */
export const scrollCopy = {
  /**
   * 왜 그런 사람이 필요한지. 오행 한자를 색으로 보여주려고 문장을 앞뒤로 나눴다.
   * 조사는 한자가 아니라 오행의 한글 이름이 정한다. 한자로는 받침을 못 센다
   */
  whyHead: '비어 있는 ',
  whyTail: (josa: string) => `${josa} 채워 줄 사람입니다`,
  whyBalanced: '오행이 고루 갖춰진 팀입니다',
  seal: '四柱',
} as const

export const illustrationCopy = {
  caption: '일러스트',
  /**
   * 화면에 안 보이지만 스크린리더로 읽히는 카피다.
   * 그림은 결핍 오행으로 고르니 alt 도 결핍 기준으로 묶는다.
   */
  altByLacking: {
    木: '머리를 싸매고 있는 사람',
    火: '회의 중에 조는 사람',
    土: '손가락에 밀려 무너지는 도미노',
    金: '결재 서류가 산더미로 쌓인 책상',
    水: '팜플렛을 들고 앞을 가리키는 여행자들',
  },
  altBalanced: '접시에 하나 남은 음식',
  /**
   * 기운 카드 그림. 이쪽은 결핍이 아니라 **그 기운이 센 사람**을 그린다.
   * 데려오면 좋은 사람을 보여주는 자리라 없는 장면을 붙이면 뜻이 뒤집힌다.
   */
  /**
   * 유형별 그림. 21개 유형이 저마다 다른 장면을 쓴다.
   *
   * 앞의 `altByLacking` 은 결핍 오행 여섯 장이라 한 장을 유형 넷이 나눠 썼다.
   * 이름과 태그라인은 넷이 완전히 다른데 그림만 같아서, 특히 첫 화면에서
   * 한 장씩 넘겨볼 때 절반이 같은 그림으로 나왔다.
   */
  altByArchetype: {
    'wood-no-fire': '포스트잇을 붙이며 회의하는 사람들',
    'wood-no-earth': '치우지 못한 어질러진 방에 앉은 사람',
    'wood-no-metal': '새것과 헌것 사이에서 질려버린 사람',
    'wood-no-water': '지도를 들고 길을 헤매는 사람',
    'fire-no-wood': '백지 두 장을 들고 선 사람',
    'fire-no-earth': '다 타버려 재가 된 회사원',
    'fire-no-metal': '빠르게 달려 나가는 자동차',
    'fire-no-water': '멱살을 잡고 다투는 회사원 둘',
    'earth-no-wood': '쳇바퀴 안에서 달리는 회사원',
    'earth-no-fire': '말없이 앉아 있는 가족',
    'earth-no-metal': '밤에 혼자 남아 일하는 사람',
    'earth-no-water': '우물 안에서 하늘을 보는 개구리',
    'metal-no-wood': '가위로 종이를 반듯하게 자르는 손',
    'metal-no-fire': '팔을 벌리고 자랑하는 사람',
    'metal-no-earth': '책상을 치며 혼내는 상사',
    'metal-no-water': '매뉴얼을 펼쳐 든 사람',
    'water-no-wood': '둘러앉아 토론하는 사람들',
    'water-no-fire': '고개를 돌린 동료들 사이에 선 사람',
    'water-no-earth': '헐고 다시 짓는 집',
    'water-no-metal': '끝나지 않는 회의',
    'balanced': '쌓인 상자 앞에서 머리를 감싸쥔 사람',
  },
  /**
   * 그 기운이 **약한 사람**. 기운 카드의 나머지 반쪽이다.
   *
   * 다섯 다 사람이다. 한동안 水 자리에 결핍 그림(돌진하는 멧돼지)을 뒀는데,
   * 나머지 아홉이 전부 사람인 자리에 짐승 한 마리만 서 있었다.
   */
  altByWeak: {
    木: '자리에 앉아 하던 일을 하는 사람',
    火: '책상 너머로 웃으며 이야기를 듣는 사람',
    土: '레일 위 광차를 타고 앞으로 가는 회사원',
    金: 'OK 사인을 내는 회사원',
    水: '팜플렛을 들고 앞을 가리키는 여행자들',
  },
  altByStrong: {
    木: '머리 위에 서랍이 잔뜩 열린 회사원',
    火: '의욕에 불타는 사람',
    土: '웃으며 짐을 나르는 사람',
    金: '가방을 들고 콧노래 부르며 걸어가는 사람',
    水: '손을 들어 묻는 사람',
  },
} as const

export const analysisCopy = {
  index: '一',
  title: '분석',
  subtitleSolo: '기운을 살펴봤습니다',
  subtitleTeam: '팀의 기운을 살펴봤습니다',
  /** 카드 안을 나누는 블록 라벨 */
  elementsBlock: '오행 분포',
  noticeBlock: '주목할 부분',
  balanceLabel: '균형 점수',
  balanceUnit: '점',
  /** ? 를 누르면 뜨는 설명. 라벨 옆에 늘 붙어 있을 문장은 아니다 */
  balanceHelp: '100이면 다섯 기운이 완전히 고른 상태입니다',
  traitsHeadingSolo: '일하는 방식',
  traitsHeadingTeam: '이 팀이 일하는 방식',
  traitsNoteSolo: '십신을 바탕으로 일하는 방식을 다섯 가지로 나누어 살펴봅니다',
  traitsNoteTeam: '팀원들의 십신을 바탕으로 일하는 방식을 다섯 가지로 나누어 살펴봅니다',
  even: '다섯 가지 성향이 고르게 나타납니다. 특정한 방식에 치우치지 않아 상황에 따라 유연하게 움직일 수 있는 팀입니다. 필요할 때는 우선할 방식을 명확히 정하면 팀의 방향을 잡는 데 도움이 됩니다.',
  // 축 이름이 굵게 들어가는 자리라 문장을 조각으로 나눠 둔다.
  // 앞에 붙는 조사는 `lib/text/josa.ts` 가 붙인다. 축이 늘어도 안 깨진다
  thickSuffix: '가장 두드러집니다.',
  thinSuffix: '상대적으로 적게 나타납니다.',
  /** 머리줄 배지. 두꺼운 축과 얇은 축을 한 글자로 표시한다 */
  thickMark: '厚',
  thinMark: '薄',
} as const

export const detailCopy = {
  index: '二',
  title: '상세 보고서',
  subtitleSolo: '이 기운이 팀 안에서 어떻게 나타나는지 살펴봅니다',
  subtitleTeam: '팀의 강점과 부족한 기운을 함께 살펴봅니다',
  strengthsSolo: '이 기운이 만드는 강점',
  strengthsTeam: '이 팀의 강점',
  blindSpots: '놓치기 쉬운 부분',
  pairsHeading: '팀원 간 조합',
  pairGenerating: '상생',
  pairSame: '비슷한 결',
  pairTension: '긴장감 있는 조합',
  pairUnit: '쌍',
  pairsNote:
    '팀원 간 세부 조합은 공유 이미지에 포함되지 않습니다. 개인 명식에서만 확인할 수 있습니다.',
} as const

export const modifiersCopy = {
  heading: '이 팀만의 변주',
  note: '같은 유형이어도 오행 조합에 따라 다른 특징이 나타납니다.',
} as const

export const energyCardsCopy = {
  index: '三',
  title: '우리 팀에 필요한 기운은?',
  subtitle: '현재 팀의 오행 조합을 기준으로 살펴봅니다',
  carousel: '팀에 더해질 기운에 따른 변화',
  /** 도움이 되는 쪽 / 이미 넘치는 쪽. 두 묶음을 갈라 놓는다 */
  tabGood: '균형을 더하는 기운',
  tabFull: '현재와 겹치는 기운',
  note: '새로운 기운이 더해졌을 때의 오행 조합 변화입니다',
  noteFull: '현재 팀의 오행 조합에서 이미 비중이 높은 기운입니다.',
} as const

export const nextStepCopy = {
  // 최대 인원은 상수에서 받는다. 글자로 박으면 MAX_MEMBERS 와 따로 논다
  full: (max: number) => `팀원은 최대 ${max}명까지 추가할 수 있습니다.`,
  more: '팀원을 추가해 다양한 조합을 확인해 보세요.',
  restart: '새 팀으로 시작하기',
} as const

export const sajuCopy = {
  /**
   * 오행 이름은 `ELEMENT_LABEL` 이 들고 있다. copy 는 lib/saju 를 import 하지
   * 않으므로 완성된 조각을 받아 잇기만 한다.
   */
  radarPart: (label: string, percent: number) => `${label} ${percent}퍼센트`,
  radarLabel: (parts: readonly string[]) => `팀 오행 분포. ${parts.join(', ')}`,
  hourUnknownLabel: '시간',
  hourUnknownValue: '미상',
} as const
