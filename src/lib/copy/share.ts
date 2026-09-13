// 공유 섹션과 공유 카드 캔버스에 그리는 문자열.

import { topic } from '../text/josa'

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
  /**
   * 앞에 `이미지` 를 붙인다.
   *
   * 하단 바에 링크를 보내는 `공유하기` 가 생기면서 모바일에서 같은 이름 버튼이
   * 둘이 됐다. 기기에 따라 갈리는 건 그대로 둔다. 시스템 시트가 뜨는 자리와
   * 파일이 내려오는 자리는 실제로 다른 일이고, 라벨이 그걸 그대로 말해야 한다.
   */
  share: '이미지 보내기',
  download: '이미지 저장',
  failed: '이미지를 만들지 못했습니다. 새로고침 후 다시 시도해 주세요.',
} as const

/**
 * 결과 하단 바에서 여는 공유 시트.
 *
 * 이미지는 `四` 구역이 맡고 여기는 링크를 보낸다. v1 은 결과를 저장하지 않아서
 * 보낼 수 있는 건 유형 한 줄과 서비스 주소까지다. 받은 사람이 자기 팀으로
 * 다시 해보는 게 이 링크의 목적이다.
 */
export const shareSheetCopy = {
  open: '공유하기',
  title: '어디로 보낼까요',
  note: '보내는 내용에는 이름과 생년월일이 들어가지 않습니다. 팀 유형과 서비스 주소만 나갑니다.',
  kakao: '카카오톡으로 보내기',
  copy: '링크 복사',
  copied: '링크를 복사했습니다',
  copyFailed: '복사가 안 됐습니다. 주소창의 주소를 그대로 보내주세요.',
  kakaoFailed: '카카오톡을 열지 못했습니다. 링크 복사로 보내주세요.',
  close: '닫기',
  /**
   * 카카오톡 피드에 실려 나가는 두 줄.
   *
   * 팀 이름과 유형까지만 넣는다. 개인 이름과 생년월일은 안 들어간다.
   * 굵게 뜨는 제목에 유형을 두고, 팀 이름은 아래 설명 줄로 내린다.
   * 유형이 먼저 읽혀야 받은 사람이 자기 팀은 뭔지 궁금해진다.
   */
  cardTitle: (archetype: string) => archetype,
  cardDescription: (teamName: string, tagline: string) => `${topic(teamName)} ${tagline}`,
  cardButton: '우리 팀도 보기',
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
