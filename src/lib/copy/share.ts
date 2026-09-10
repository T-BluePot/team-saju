// 공유 섹션과 공유 카드 캔버스에 그리는 문자열.

export const shareCardCopy = {
  index: '四',
  heading: '이미지로 공유하기',
  note: '공유 이미지에는 이름과 생년월일이 포함되지 않습니다.',
  emptyHint: '미리보기를 누르면 공유될 이미지를 볼 수 있습니다',
  zoomHint: '눌러서 크게 볼 수 있어요',
  close: '닫기',
  previewAlt: '공유 카드 미리보기',
  longPressHint: '저장이 되지 않으면 이미지를 길게 눌러 저장해 주세요.',
  preview: '미리보기',
  busy: '이미지 만드는 중',
  share: '공유하기',
  download: '저장하기',
  failed: '이미지를 만들지 못했습니다. 새로고침 후 다시 시도해 주세요.',
} as const

/**
 * 캔버스에 직접 그리는 글자.
 *
 * 화면 쪽과 같은 문장이 몇 개 있지만 키를 합치지 않는다. 카드는 한 번 퍼지면
 * 못 고치는 이미지라 화면만 문구를 바꾸는 일이 생긴다.
 */
export const shareCanvasCopy = {
  solo: '아직 혼자',
  size: (size: number) => `${size}명`,
  excess: '넘치는 기운',
  lacking: '비어 있는 기운',
  prescription: '이번 주에 해볼 것',
  prescriptionMark: '處',
  /**
   * 균형 점수와 조합은 한 줄로 잇지 않고 나눠 적는다. 카드 아래쪽은 훑어보는
   * 자리라 `균형 69점 · 상생 0쌍 · …` 처럼 이으면 한 덩어리로 뭉쳐 읽힌다.
   */
  balanceLabel: '균형 점수',
  balanceUnit: '점',
  pairGenerating: '상생',
  pairSame: '비슷한 결',
  /** 화면은 `긴장감 있는 조합` 인데 카드는 칩이 좁아서 줄인다 */
  pairTension: '긴장',
  pairUnit: '쌍',
  seal: '占',
  brand: '팀사주',
  note: '재미로 보는 콘텐츠입니다',
  fileName: (teamName: string, archetype: string) => `팀사주-${teamName}-${archetype}.png`,
} as const
