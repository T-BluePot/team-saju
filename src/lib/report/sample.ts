import type { Draft } from '../../store/teamStore'

/**
 * 예시 리포트에 쓰는 표본 팀.
 *
 * 랜딩에서 "예시 리포트 보기" 를 누르면 이 사람들로 결과를 보여준다.
 * 남의 생년월일시까지 받아와야 하는 입력을 시키기 전에, 뭐가 나오는지 먼저 보여주려는 것이다.
 *
 * 개발용 `#demo` 시드도 같은 표본을 쓴다. 두 벌을 들고 있을 이유가 없다.
 */
export type SampleSeed = Pick<Draft, 'name' | 'birthDate' | 'birthHour'>

/** 실존 인물이 아니다. 오행이 한쪽으로 쏠리게 골라 결과가 균형형으로 안 빠지게 했다 */
export const SAMPLE_TEAM: SampleSeed[] = [
  { name: '은우', birthDate: '1990-06-15', birthHour: 12 },
  { name: '서림', birthDate: '1988-06-20', birthHour: 14 },
  { name: '효경', birthDate: '1995-07-01', birthHour: 10 },
]

export const SAMPLE_TEAM_NAME = '푸른핫가마'
