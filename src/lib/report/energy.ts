import { object, subject } from '../text/josa'
import { ELEMENT_LABEL } from '../saju/constants'
import type { Element } from '../saju/types'

/**
 * 데려오면 좋은 기운, 지금은 안 되는 기운.
 *
 * 결과를 다 읽고 나면 "그래서 누굴 데려와야 되는데" 가 남는데 그 답이 제일 얇았다.
 * 팔자 8글자까지 갈 필요 없이 기운 하나로 말한다. 그게 더 잘 읽힌다.
 *
 * **실제로 입력한 팀원을 줄 세우지 않는다.** 누가 최고고 누가 최악인지 매기는 건
 * `docs/00-product-brief.md` 의 "궁합 점수로 사람 배제" 금지에 걸린다.
 * 여기 나오는 건 아직 팀에 없는 가상의 기운이다.
 */

type Profile = {
  /** 한 줄 별명 */
  nickname: string
  /** 이 사람이 오면 벌어지는 일. 두세 줄 */
  line: string
}

/** 이 기운이 센 사람 */
const STRONG: Record<Element, Profile> = {
  木: {
    nickname: '판 벌이는 사람',
    line: '회의 끝나갈 때쯤 "이거 이렇게 해보면 어때요" 를 기어이 하나 더 꺼내는 타입. 있으면 소재가 안 마릅니다.',
  },
  火: {
    nickname: '엔진 거는 사람',
    line: '"일단 해봅시다" 하고 그날 저녁에 뭔가 만들어 오는 타입. 회의실 온도를 혼자 3도쯤 올립니다.',
  },
  土: {
    nickname: '받쳐주는 사람',
    line: '남들 다 벌여놓고 간 자리를 조용히 정리해두는 타입. 티가 안 나는데 없으면 바로 티가 납니다.',
  },
  金: {
    nickname: '회의 끝내는 사람',
    line: '두 시간째 도는 회의에 "그래서 뭘로 갈 건데요" 한마디 던지고 노트북 덮는 타입입니다.',
  },
  水: {
    nickname: '한 번 더 묻는 사람',
    line: '다들 고개 끄덕일 때 혼자 "근데 이거 왜 하는 거였죠" 하는 타입. 그 한마디에 방향이 바뀝니다.',
  },
}

/** 이 기운이 약한 사람 */
const WEAK: Record<Element, Profile> = {
  木: {
    nickname: '하던 걸 하는 사람',
    line: '새로 벌이는 데는 관심이 없고 있는 걸 굴리는 데 집중하는 타입입니다.',
  },
  火: {
    nickname: '차분한 사람',
    line: '급해도 목소리가 안 커지는 타입. 분위기를 띄우지는 않습니다.',
  },
  土: {
    nickname: '앞만 보는 사람',
    line: '앞으로 가는 데 집중하고 벌여둔 걸 정리하는 쪽은 남한테 맡기는 타입입니다.',
  },
  金: {
    nickname: '다 받아주는 사람',
    line: '누가 뭘 하자고 하면 웬만하면 받아주는 타입. 접자는 말을 먼저 꺼내지는 않습니다.',
  },
  水: {
    nickname: '일단 가는 사람',
    line: '재보는 것보다 움직이는 게 빠른 타입. 왜 하는지는 나중에 생각합니다.',
  },
}

export type EnergyCard = {
  id: string
  element: Element
  /** 이 기운이 센 사람인지 약한 사람인지 */
  strength: 'strong' | 'weak'
  /** 지금 이 팀에 도움이 되는 쪽인가 */
  good: boolean
  /** "금 기운이 센 사람" */
  title: string
  nickname: string
  /** 이 사람이 어떤 타입인지 */
  line: string
  /** 지금 이 팀에 오면 벌어지는 일 */
  effect: string
  /** 좋지 않은 쪽에만 붙는다. 지적만 하고 끝내지 않는다 */
  fix?: string
}

function title(element: Element, strength: 'strong' | 'weak'): string {
  return `${ELEMENT_LABEL[element]} 기운이 ${strength === 'strong' ? '센' : '약한'} 사람`
}

/**
 * 팀의 주도와 결핍에서 네 장을 뽑는다.
 *
 * 축이 두 개다. 비어 있는 걸 채우느냐, 넘치는 걸 더하느냐.
 * 각각 좋은 쪽 하나 나쁜 쪽 하나가 나와서 네 장이 된다.
 */
export function energyCards(dominant: Element, lacking: Element): EnergyCard[] {
  const lack = ELEMENT_LABEL[lacking]
  const dom = ELEMENT_LABEL[dominant]

  const cards: EnergyCard[] = [
    {
      id: 'fill-lacking',
      element: lacking,
      strength: 'strong',
      good: true,
      title: title(lacking, 'strong'),
      nickname: STRONG[lacking].nickname,
      line: STRONG[lacking].line,
      effect: `지금 이 팀에 제일 없는 게 ${lack}입니다. 한 명만 들어와도 눈에 띄게 달라집니다.`,
    },
    {
      id: 'cool-dominant',
      element: dominant,
      strength: 'weak',
      good: true,
      title: title(dominant, 'weak'),
      nickname: WEAK[dominant].nickname,
      line: WEAK[dominant].line,
      effect: `${subject(dom)} 이미 넘치는 팀이라, 거기에 더 안 보태는 것만으로도 균형이 잡힙니다.`,
    },
    {
      id: 'more-dominant',
      element: dominant,
      strength: 'strong',
      good: false,
      title: title(dominant, 'strong'),
      nickname: `${dom}에 ${object(dom)} 더하기`,
      line: STRONG[dominant].line,
      effect: `안 그래도 ${subject(dom)} 넘치는데 한 명 더 넣으면 쏠림이 두 배가 됩니다. 재밌긴 하겠네요.`,
      fix: `그래도 데려오고 싶으면 ${lack} 쪽 한 명을 같이 뽑으세요. 둘이 세트입니다.`,
    },
    {
      id: 'empty-lacking',
      element: lacking,
      strength: 'weak',
      good: false,
      title: title(lacking, 'weak'),
      nickname: '빈 데를 더 비우는',
      line: WEAK[lacking].line,
      effect: `가뜩이나 ${subject(lack)} 비어 있는데 여기서 더 비면 그 자리를 아무도 안 맡게 됩니다.`,
      fix: `이 사람이 꼭 필요하면 ${object(lack)} 대신할 규칙을 하나 만들어두세요. 사람이 없으면 문서가 대신합니다.`,
    },
  ]

  return cards
}
