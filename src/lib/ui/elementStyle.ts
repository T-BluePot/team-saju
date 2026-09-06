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
 * 주도 오행으로 고르고, 균형형은 따로 둔다.
 */
const ILLUST_BY_ELEMENT: Record<Element, { src: string; credit: string }> = {
  木: { src: '/illust/wood.png', credit: 'アイディアの共有' },
  火: { src: '/illust/fire.png', credit: '元気な男性会社員' },
  土: { src: '/illust/earth.png', credit: '協力して進む子どもたち' },
  金: { src: '/illust/metal.png', credit: '編集者' },
  水: { src: '/illust/water.png', credit: '本を読んで閃いた人' },
}

const BALANCED_ILLUST = {
  src: '/illust/balanced.png',
  credit: '協力しあう人達',
}

export function illustFor(archetypeId: string, dominant: Element) {
  if (archetypeId === 'balanced') return BALANCED_ILLUST
  return ILLUST_BY_ELEMENT[dominant]
}

export const ILLUST_SOURCE = 'いらすとや'
export const ILLUST_SOURCE_URL = 'https://www.irasutoya.com/'
