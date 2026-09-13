import { STEM_ELEMENT } from './constants'
import type { Branch, Element, Pillar, Stem } from './types'

/**
 * 일주 두 글자를 말로 옮긴다.
 *
 * 명식표는 여덟 글자를 보여주기만 하고 그게 무슨 뜻인지는 안 말해줬다.
 * 사주를 처음 보는 사람에게 `庚戌` 은 읽을 수조차 없는 표시다.
 *
 * 근거는 일주다. 60갑자 단위로 표를 만들면 60줄이 필요한데, 실제로 필요한 건
 * 그 두 글자를 각각 풀어 쓴 것이라 아래 표 셋이면 같은 결과가 나온다.
 * `庚戌` 이면 **산 중턱의 바위** 와 **흰 개** 다.
 *
 * **성격을 덧붙이지 않는다.** `단단해서 잘 안 굽힙니다` 같은 문장은 이 표에 없는
 * 말이고 `docs/00-product-brief.md` 의 "주어진 팩트만" 에 걸린다. 명사까지가 몫이다.
 *
 * 도메인 어휘라 `src/lib/copy/` 로 올리지 않는다. 명세는 `docs/03-saju-spec.md`.
 */

/**
 * 일간의 물상. 명리에서 천간을 부르는 표준 비유다.
 *
 * 양간은 크고 거친 쪽, 음간은 작고 다듬어진 쪽으로 짝이 진다.
 * 甲乙 나무, 丙丁 불, 戊己 흙, 庚辛 쇠, 壬癸 물.
 */
export const STEM_IMAGE: Record<Stem, string> = {
  甲: '곧게 자란 큰 나무',
  乙: '바람에 눕는 풀과 덩굴',
  丙: '한낮의 해',
  丁: '어두운 데를 밝히는 촛불',
  戊: '넓게 앉은 산',
  己: '갈아 놓은 밭흙',
  庚: '산 중턱의 바위',
  辛: '깎아 놓은 보석',
  壬: '큰 강과 바다',
  癸: '풀잎에 맺힌 이슬',
}

/** 십이지 동물 */
export const BRANCH_ANIMAL: Record<Branch, string> = {
  子: '쥐', 丑: '소', 寅: '범', 卯: '토끼', 辰: '용', 巳: '뱀',
  午: '말', 未: '양', 申: '원숭이', 酉: '닭', 戌: '개', 亥: '돼지',
}

/**
 * 오행의 빛깔. 동물 앞에 붙는다.
 *
 * 색은 지지가 아니라 **일간의 오행**이 정한다. 십이지 동물에 색을 붙이는
 * 관습이 그렇다. 흔히 쓰는 `붉은 말` 은 연주로 세지만 여기는 일주를 본다.
 * 이 화면이 보여주는 게 그 사람 자신이라서다.
 */
export const TONE_KO: Record<Element, string> = {
  木: '푸른',
  火: '붉은',
  土: '누런',
  金: '흰',
  水: '검은',
}

export type DayReading = {
  /** 일간의 물상 */
  image: string
  /** 빛깔 + 십이지 동물 */
  animal: string
}

export function dayReading(day: Pick<Pillar, 'stem' | 'branch'>): DayReading {
  return {
    image: STEM_IMAGE[day.stem],
    animal: `${TONE_KO[STEM_ELEMENT[day.stem]]} ${BRANCH_ANIMAL[day.branch]}`,
  }
}
