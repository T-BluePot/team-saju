import type { Element, ElementFlag } from '../saju/types'
import { illustrationCopy } from '../copy'

/**
 * 오행이 어느 단계인지.
 *
 * 명리 용어라 카피가 아니라 도메인 어휘다. 오행 막대와 분석 카드의
 * 주목할 부분이 같은 말을 써야 해서 여기 둔다.
 */
export const FLAG_LABEL: Record<ElementFlag, string> = {
  excess: '넘침',
  lacking: '부족',
  empty: '비어 있음',
  normal: '',
}

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
 * 글자용 진한 오방색. index.css 의 --accent-deep 과 같은 값이다.
 * 오방색 원본은 한지색 배경에서 土 2.99:1, 金 3.86:1 이라 글자로 쓰면 4.5:1 에 못 미친다.
 * 공유 카드는 항상 밝은 배경이라 라이트 기준 값만 있으면 된다.
 */
export const ELEMENT_HEX_DEEP: Record<Element, string> = {
  木: '#1F5A4C',
  火: '#A82A19',
  土: '#8A6220',
  金: '#565B61',
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
  木: { src: '/illust/no-wood.png', alt: illustrationCopy.altByLacking.木 },
  火: { src: '/illust/no-fire.png', alt: illustrationCopy.altByLacking.火 },
  土: { src: '/illust/no-earth.png', alt: illustrationCopy.altByLacking.土 },
  金: { src: '/illust/no-metal.png', alt: illustrationCopy.altByLacking.金 },
  水: { src: '/illust/no-water.png', alt: illustrationCopy.altByLacking.水 },
}

/** 어디도 안 비어서 붙일 결핍이 없다. 아무도 안 집는 마지막 한 조각 */
const BALANCED_ILLUST = {
  src: '/illust/no-lacking.png',
  alt: illustrationCopy.altBalanced,
}

export function illustFor(archetypeId: string, lacking: Element | null) {
  // 균형형은 결핍이 없다. 랜딩 족자가 유형 표를 그대로 훑어서 null 이 들어온다
  if (archetypeId === 'balanced' || lacking === null) return BALANCED_ILLUST
  return ILLUST_BY_LACKING[lacking]
}

export const ILLUST_SOURCE = 'いらすとや'
export const ILLUST_SOURCE_URL = 'https://www.irasutoya.com/'
