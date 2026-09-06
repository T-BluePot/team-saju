import type { Archetype } from './archetypes'
import type { TeamAnalysis } from '../saju/types'

/**
 * 혼자 넣었을 때의 화법.
 *
 * 판정과 문구를 여기 모은다. 화면과 공유 카드가 같이 읽어야 해서다.
 * 컴포넌트마다 `size === 1` 을 따로 쓰면 카피가 늘 때 한 곳을 빠뜨리게 된다.
 *
 * **프레이밍이 핵심이다.** 21개 유형 이름이 전부 "...팀" 으로 끝나고, 강점과 처방도
 * "팀 안에 이미 있다" 처럼 여럿을 전제로 쓴 문장이다. 혼자인 사람에게 그대로 내밀면
 * 화면이 팀인 척하는 게 된다. 그렇다고 21세트를 1인용으로 다시 쓰는 건 과하다.
 *
 * 그래서 유형을 **"이 기운으로 팀을 만들면 이렇게 된다"** 로 읽게 한다.
 * 그러면 본문의 "팀" 이 전부 제자리를 찾는다.
 */

export function isSolo(analysis: Pick<TeamAnalysis, 'size'>): boolean {
  return analysis.size === 1
}

/** 유형 이름 위에 붙는 라벨. 혼자일 때만 나온다 */
export const SOLO_LEAD = '이 기운으로 팀을 만들면'

/** 유형 아래 안내 */
export const SOLO_NOTE =
  '혼자 넣은 결과입니다. 지금 기운만 놓고 보면 이런 팀이 되고, 사람을 넣을수록 섞여서 달라집니다'

/**
 * "이 팀에 들어오면 좋은 사람" 자리.
 *
 * 균형형만 따로 본다. `needsPerson` 이 "이미 다 있습니다" 인데 이건 여럿이 모여서
 * 고르다는 뜻으로 쓴 문장이다. 혼자한테 붙으면 앞뒤가 안 맞는다.
 */
export function needsBlock(
  solo: boolean,
  archetype: Pick<Archetype, 'id' | 'needsPerson'>,
): { heading: string; body: string } {
  if (solo && archetype.id === 'balanced') {
    return {
      heading: '지금은 이렇습니다',
      body:
        '다섯 기운이 고르게 나왔습니다. 누가 와도 크게 안 흔들릴 텐데, 뒤집으면 아직 어느 쪽으로도 ' +
        '안 기울어 있다는 뜻입니다. 먼저 손대볼 일 하나를 정해서 그쪽으로 기울여보세요',
    }
  }
  return {
    heading: solo ? '같이 하면 좋은 사람' : '이 팀에 들어오면 좋은 사람',
    body: archetype.needsPerson,
  }
}
