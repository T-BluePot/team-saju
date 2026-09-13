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

/**
 * 글자용 오방색.
 *
 * 면과 선은 `ELEMENT_COLOR`, 글자는 이쪽이다. 원본 오방색을 글자로 쓰면
 * 한지색 위에서 土 2.99:1, 金 3.86:1 로 4.5:1 에 못 미친다.
 * 값은 `index.css` 가 들고 있고 다크에서는 알아서 밝은 쪽으로 바뀐다.
 */
export const ELEMENT_COLOR_DEEP: Record<Element, string> = {
  木: 'var(--el-wood-deep)',
  火: 'var(--el-fire-deep)',
  土: 'var(--el-earth-deep)',
  金: 'var(--el-metal-deep)',
  水: 'var(--el-water-deep)',
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

/**
 * 그 기운이 **센 사람**.
 *
 * 위 여섯 장과 기준이 반대다. 저쪽은 이 오행이 없을 때 벌어지는 일을 그리고
 * 이쪽은 이 오행을 들고 오는 사람을 그린다. 기운 카드가 "데려오면 좋은 사람" 을
 * 보여주는 자리라 없는 장면을 붙이면 `화 기운이 센 사람` 카드에 회의 중 조는
 * 그림이 들어간다. 실제로 한 번 그렇게 붙였다가 뺐다.
 *
 * 출처는 위와 같은 いらすとや 다. 파일 이름은 내용이 바뀌면 같이 바꾼다.
 * `public/_headers` 가 1년 immutable 캐시를 걸어둬서 같은 이름으로 내용만 갈면
 * 이미 받아간 사람은 옛 그림을 계속 본다.
 */
const ILLUST_BY_STRONG: Record<Element, { src: string; alt: string }> = {
  木: { src: '/illust/strong-wood.png', alt: illustrationCopy.altByStrong.木 },
  火: { src: '/illust/strong-fire.png', alt: illustrationCopy.altByStrong.火 },
  土: { src: '/illust/strong-earth.png', alt: illustrationCopy.altByStrong.土 },
  金: { src: '/illust/strong-metal.png', alt: illustrationCopy.altByStrong.金 },
  水: { src: '/illust/strong-water.png', alt: illustrationCopy.altByStrong.水 },
}

/**
 * 유형마다 한 장.
 *
 * 앞의 `ILLUST_BY_LACKING` 은 결핍 오행 여섯 장이라 한 장을 유형 넷이 나눠 썼다.
 * 결과 화면은 제 유형 하나만 보니까 티가 안 났는데, 첫 화면 족자를 한 장씩
 * 넘겨보면 다섯 중 두 쌍이 같은 그림이었다. 넘겨볼 이유가 없어지는 자리다.
 *
 * 출처는 앞의 여섯 장과 같은 いらすとや 다. 21점 이상 유료는 상용 디자인에만
 * 걸리고 지금은 비상용이라 점수 제한이 없다. 상용으로 돌리면 그때 다시 본다.
 */
const ILLUST_BY_ARCHETYPE: Record<string, { src: string; alt: string }> = {
  'wood-no-fire': {
    src: '/illust/type-wood-no-fire.png',
    alt: illustrationCopy.altByArchetype['wood-no-fire'],
  },
  'wood-no-earth': {
    src: '/illust/type-wood-no-earth.png',
    alt: illustrationCopy.altByArchetype['wood-no-earth'],
  },
  'wood-no-metal': {
    src: '/illust/type-wood-no-metal.png',
    alt: illustrationCopy.altByArchetype['wood-no-metal'],
  },
  'wood-no-water': {
    src: '/illust/type-wood-no-water.png',
    alt: illustrationCopy.altByArchetype['wood-no-water'],
  },
  'fire-no-wood': {
    src: '/illust/type-fire-no-wood.png',
    alt: illustrationCopy.altByArchetype['fire-no-wood'],
  },
  'fire-no-earth': {
    src: '/illust/type-fire-no-earth.png',
    alt: illustrationCopy.altByArchetype['fire-no-earth'],
  },
  'fire-no-metal': {
    src: '/illust/type-fire-no-metal.png',
    alt: illustrationCopy.altByArchetype['fire-no-metal'],
  },
  'fire-no-water': {
    src: '/illust/type-fire-no-water.png',
    alt: illustrationCopy.altByArchetype['fire-no-water'],
  },
  'earth-no-wood': {
    src: '/illust/type-earth-no-wood.png',
    alt: illustrationCopy.altByArchetype['earth-no-wood'],
  },
  'earth-no-fire': {
    src: '/illust/type-earth-no-fire.png',
    alt: illustrationCopy.altByArchetype['earth-no-fire'],
  },
  'earth-no-metal': {
    src: '/illust/type-earth-no-metal.png',
    alt: illustrationCopy.altByArchetype['earth-no-metal'],
  },
  'earth-no-water': {
    src: '/illust/type-earth-no-water.png',
    alt: illustrationCopy.altByArchetype['earth-no-water'],
  },
  'metal-no-wood': {
    src: '/illust/type-metal-no-wood.png',
    alt: illustrationCopy.altByArchetype['metal-no-wood'],
  },
  'metal-no-fire': {
    src: '/illust/type-metal-no-fire.png',
    alt: illustrationCopy.altByArchetype['metal-no-fire'],
  },
  'metal-no-earth': {
    src: '/illust/type-metal-no-earth.png',
    alt: illustrationCopy.altByArchetype['metal-no-earth'],
  },
  'metal-no-water': {
    src: '/illust/type-metal-no-water.png',
    alt: illustrationCopy.altByArchetype['metal-no-water'],
  },
  'water-no-wood': {
    src: '/illust/type-water-no-wood.png',
    alt: illustrationCopy.altByArchetype['water-no-wood'],
  },
  'water-no-fire': {
    src: '/illust/type-water-no-fire.png',
    alt: illustrationCopy.altByArchetype['water-no-fire'],
  },
  'water-no-earth': {
    src: '/illust/type-water-no-earth.png',
    alt: illustrationCopy.altByArchetype['water-no-earth'],
  },
  'water-no-metal': {
    src: '/illust/type-water-no-metal.png',
    alt: illustrationCopy.altByArchetype['water-no-metal'],
  },
  'balanced': {
    src: '/illust/type-balanced.png',
    alt: illustrationCopy.altByArchetype['balanced'],
  },
}

/** 어디도 안 비어서 붙일 결핍이 없다. 아무도 안 집는 마지막 한 조각 */
const BALANCED_ILLUST = {
  src: '/illust/no-lacking.png',
  alt: illustrationCopy.altBalanced,
}

export function illustFor(archetypeId: string, lacking: Element | null) {
  const own = ILLUST_BY_ARCHETYPE[archetypeId]
  if (own) return own
  // 유형 표에 없는 id 가 들어오면 결핍 오행으로 떨어진다. 유형이 늘 때의 안전망이다
  if (lacking === null) return BALANCED_ILLUST
  return ILLUST_BY_LACKING[lacking]
}

/**
 * 그 기운이 **약한 사람**.
 *
 * 유형 21장이 생기면서 `ILLUST_BY_LACKING` 은 여기 말고는 쓸 데가 없어졌는데,
 * 그 여섯 장은 `이 오행이 없는 팀에 벌어지는 일` 이라 사람 카드로는 반만 맞았다.
 * 金 약한 사람은 `다 받아주는 사람` 인데 붙는 그림이 결재 서류 산더미였다.
 *
 * 다섯 다 사람이다. 한동안 水 자리에 결핍 그림(돌진하는 멧돼지)을 뒀는데,
 * 나머지 아홉이 전부 사람인 자리에 짐승 한 마리만 서 있었다.
 */
const ILLUST_BY_WEAK: Record<Element, { src: string; alt: string }> = {
  木: { src: '/illust/weak-wood.png', alt: illustrationCopy.altByWeak.木 },
  火: { src: '/illust/weak-fire.png', alt: illustrationCopy.altByWeak.火 },
  土: { src: '/illust/weak-earth.png', alt: illustrationCopy.altByWeak.土 },
  金: { src: '/illust/weak-metal.png', alt: illustrationCopy.altByWeak.金 },
  水: { src: '/illust/weak-water.png', alt: illustrationCopy.altByWeak.水 },
}

/**
 * 기운 카드가 쓰는 그림.
 *
 * 센 쪽과 약한 쪽이 서로 다른 표를 본다. 한 표로 덮으면 `화 기운이 센 사람`
 * 카드에 화가 없는 장면이 붙는 식으로 절반이 뒤집힌다.
 */
export function illustForEnergy(element: Element, strength: 'strong' | 'weak') {
  return strength === 'strong' ? ILLUST_BY_STRONG[element] : ILLUST_BY_WEAK[element]
}

export const ILLUST_SOURCE = 'いらすとや'
export const ILLUST_SOURCE_URL = 'https://www.irasutoya.com/'
