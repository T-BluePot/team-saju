import type { Element } from '../saju/types'

/** 오방색. 청(木) 적(火) 황(土) 백(金) 흑(水) */
export const ELEMENT_COLOR: Record<Element, string> = {
  木: 'var(--el-wood)',
  火: 'var(--el-fire)',
  土: 'var(--el-earth)',
  金: 'var(--el-metal)',
  水: 'var(--el-water)',
}

/** 캔버스에는 CSS 변수를 못 쓴다 */
export const ELEMENT_HEX: Record<Element, string> = {
  木: '#2F7D6B',
  火: '#D93A26',
  土: '#C08A2E',
  金: '#7C8188',
  水: '#2B3A55',
}

/**
 * 팀 유형에 붙는 일러스트.
 * 이미지는 いらすとや(irasutoya.com) 무료 소재를 내려받아 public/illust 에 두었다.
 *
 * 고르는 기준은 **결핍 오행**이다. 주도 오행이 아니다.
 * 유형의 성격은 뭐가 넘치냐가 아니라 뭐가 없냐에서 나온다. 화가 넘치는 팀이라고
 * 신난 그림을 붙이면, 정작 문구는 브레이크가 없다고 하는데 그림만 혼자 웃는다.
 */
const ILLUST_BY_LACKING: Record<Element, { src: string; alt: string }> = {
  木: { src: '/illust/no-wood.png', alt: '머리를 싸매고 있는 사람' },
  火: { src: '/illust/no-fire.png', alt: '회의 중에 조는 사람' },
  土: { src: '/illust/no-earth.png', alt: '손가락에 밀려 무너지는 도미노' },
  金: { src: '/illust/no-metal.png', alt: '결재 서류가 산더미로 쌓인 책상' },
  水: { src: '/illust/no-water.png', alt: '앞만 보고 돌진하는 멧돼지' },
}

/** 어디도 안 비어서 붙일 결핍이 없다. 아무도 안 집는 마지막 한 조각 */
const BALANCED_ILLUST = {
  src: '/illust/balanced.png',
  alt: '접시에 하나 남은 음식',
}

export function illustFor(archetypeId: string, lacking: Element) {
  if (archetypeId === 'balanced') return BALANCED_ILLUST
  return ILLUST_BY_LACKING[lacking]
}

export const ILLUST_SOURCE = 'いらすとや'
export const ILLUST_SOURCE_URL = 'https://www.irasutoya.com/'
