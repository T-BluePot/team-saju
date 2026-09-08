// 결과 화면. 탭 껍데기, 요약 머리, 분석, 상세 보고서, 기운 카드, 다음 단계.

export const resultCopy = {
  tabTeam: '팀 리포트',
  tabPersonal: '개인 명식',
  // 위쪽 탭 옆 버튼과 맨 아래 버튼이 같은 라벨을 쓴다. 같은 동작에 다른
  // 이름이 붙으면 사용자는 둘이 다른 일을 한다고 읽는다
  editMembers: '팀원 수정',
} as const

export const exampleNoticeCopy = {
  lead: '예시입니다.',
  body: '실제 사람이 아니라 만들어둔 표본 팀으로 뽑은 결과예요',
  cta: '내 팀으로 해보기',
} as const

export const headlineCopy = {
  seal: '占',
  solo: '아직 혼자',
  size: (size: number) => `${size}명`,
} as const

export const illustrationCopy = {
  caption: '일러스트',
} as const

export const analysisCopy = {
  index: '一',
  title: '분석',
  subtitleSolo: '기운을 재봤습니다',
  subtitleTeam: '팀 전체의 기운을 재봤습니다',
  excess: '넘치는 기운',
  lacking: '비어 있는 곳',
  balanceNote: '균형 점수. 100이면 다섯 기운이 완전히 고른 상태입니다',
  traitsHeadingSolo: '일하는 방식',
  traitsHeadingTeam: '이 팀이 일하는 방식',
  traitsNoteSolo: '십신을 다섯 가지로 나눠봤습니다',
  traitsNoteTeam: '팀원들의 십신을 합쳐서 다섯 가지로 나눠봤습니다',
  even: '다섯이 고르게 나왔습니다. 어느 쪽으로 일해도 되는 팀인데, 뒤집으면 이 팀만의 방식이 없다는 뜻이기도 합니다. 분기마다 한쪽을 정해 일부러 기울여보세요',
  // 축 이름이 굵게 들어가는 자리라 문장을 조각으로 나눠 둔다
  axisJoin: '과 ',
  thickSuffix: '이 제일 두껍습니다.',
  thinSuffix: '이 제일 얇습니다.',
} as const

export const detailCopy = {
  index: '二',
  title: '상세 보고서',
  subtitleSolo: '이 기운이 팀이 되면 어떻게 되나',
  subtitleTeam: '강점과 빈자리, 그리고 처방',
  strengthsSolo: '이 기운이 만드는 강점',
  strengthsTeam: '이 팀의 강점',
  blindSpots: '놓치기 쉬운 것',
  prescriptionSeal: '處方',
  pairsHeading: '조합 집계',
  pairGenerating: '상생',
  pairSame: '비슷한 결',
  pairTension: '긴장감 있는 조합',
  pairUnit: '쌍',
  pairsNote: '누가 누구인지는 공유 이미지에 안 들어갑니다. 개인 탭에서만 보여요',
} as const

export const modifiersCopy = {
  heading: '이 팀만의 변주',
  note: '같은 유형이어도 여기가 다르면 다른 팀입니다',
} as const

export const energyCardsCopy = {
  index: '三',
  title: '누굴 데려오면 되나',
  subtitle: '아직 팀에 없는 기운입니다',
  carousel: '데려오면 좋은 기운과 지금은 안 되는 기운',
  note: '지금 팀원을 두고 하는 얘기가 아닙니다. 아직 없는 기운을 말합니다',
} as const

export const nextStepCopy = {
  full: '여덟 명이 꽉 찼습니다. 사람을 바꿔 넣으면 결과가 달라집니다',
  more: '한 명 더 넣으면 팀 유형이 바뀔 수도 있습니다',
  restart: '다른 팀으로 다시',
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
