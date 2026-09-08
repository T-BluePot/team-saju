// 결과 화면. 탭 껍데기, 요약 머리, 분석, 상세 보고서, 기운 카드, 다음 단계.

export const resultCopy = {
  tabTeam: '팀 결과',
  tabPersonal: '개인 명식',
  // 위쪽 탭 옆 버튼과 맨 아래 버튼이 같은 라벨을 쓴다. 같은 동작에 다른
  // 이름이 붙으면 사용자는 둘이 다른 일을 한다고 읽는다
  editMembers: '팀원 수정',
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
    水: '앞만 보고 돌진하는 멧돼지',
  },
  altBalanced: '접시에 하나 남은 음식',
} as const

export const analysisCopy = {
  index: '一',
  title: '분석',
  subtitleSolo: '기운을 살펴봤습니다',
  subtitleTeam: '팀의 기운을 살펴봤습니다',
  excess: '넘치는 기운',
  lacking: '비어 있는 곳',
  balanceNote: '균형 점수. 100이면 다섯 기운이 완전히 고른 상태입니다',
  traitsHeadingSolo: '일하는 방식',
  traitsHeadingTeam: '이 팀이 일하는 방식',
  traitsNoteSolo: '십신을 바탕으로 일하는 방식을 다섯 가지로 나누어 살펴봅니다',
  traitsNoteTeam: '팀원들의 십신을 바탕으로 일하는 방식을 다섯 가지로 나누어 살펴봅니다',
  even: '다섯 가지 성향이 고르게 나타납니다. 특정한 방식에 치우치지 않아 상황에 따라 유연하게 움직일 수 있는 팀입니다. 필요할 때는 우선할 방식을 명확히 정하면 팀의 방향을 잡는 데 도움이 됩니다.',
  // 축 이름이 굵게 들어가는 자리라 문장을 조각으로 나눠 둔다.
  // 앞에 붙는 조사는 `lib/text/josa.ts` 가 붙인다. 축이 늘어도 안 깨진다
  thickSuffix: '가장 두드러집니다.',
  thinSuffix: '상대적으로 적게 나타납니다.',
} as const

export const detailCopy = {
  index: '二',
  title: '상세 보고서',
  subtitleSolo: '이 기운이 팀 안에서 어떻게 나타나는지 살펴봅니다',
  subtitleTeam: '팀의 강점과 부족한 기운을 함께 살펴봅니다',
  strengthsSolo: '이 기운이 만드는 강점',
  strengthsTeam: '이 팀의 강점',
  blindSpots: '놓치기 쉬운 부분',
  prescriptionSeal: '處方',
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
  note: '새로운 기운이 더해졌을 때의 오행 조합 변화입니다',
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
