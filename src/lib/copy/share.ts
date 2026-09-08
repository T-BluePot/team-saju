// 공유 섹션과 공유 카드 캔버스에 그리는 문자열.

export const shareCardCopy = {
  heading: '이미지로 공유하기',
  note: '팀 유형과 오행 분포만 담깁니다. 이름과 생년월일은 안 들어가요',
  previewAlt: '공유 카드 미리보기',
  longPressHint: '저장이 안 되면 이 이미지를 길게 눌러도 됩니다',
  preview: '미리보기',
  busy: '만드는 중',
  share: '이미지 공유',
  download: '이미지 저장',
  failed: '이미지를 못 만들었습니다. 화면을 새로고침하고 다시 해보세요',
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
  lacking: '비어 있는 곳',
  prescription: '處方 · 이번 주에 해볼 것',
  balance: (balance: number) => `균형 ${balance}점`,
  balanceWithPairs: (balance: number, generating: number, same: number, tension: number) =>
    `균형 ${balance}점 · 상생 ${generating}쌍 · 비슷한 결 ${same}쌍 · 긴장 ${tension}쌍`,
  footer: '팀사주 · 재미로 보는 콘텐츠입니다',
  fileName: (teamName: string, archetype: string) => `팀사주-${teamName}-${archetype}.png`,
} as const
