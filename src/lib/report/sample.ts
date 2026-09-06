/**
 * 예시 리포트에 쓰는 표본 팀.
 *
 * 랜딩에서 "예시 리포트 보기" 를 누르면 이 사람들로 결과를 보여준다.
 * 남의 생년월일시까지 받아와야 하는 입력을 시키기 전에, 뭐가 나오는지 먼저 보여주려는 것이다.
 *
 * 개발용 `#demo` 시드도 같은 표본을 쓴다. 두 벌을 들고 있을 이유가 없다.
 */
/**
 * `Draft` 를 Pick 하지 않는다. `lib` 이 `store` 를 참조하면 의존 방향이 거꾸로다.
 * 어긋나면 `showExample` 의 `{ ...emptyDraft(), ...seed }` 자리에서 타입 에러로 잡힌다.
 */
export type SampleSeed = { name: string; birthDate: string; birthHour: number }

/** 실존 인물이 아니다. 오행이 한쪽으로 쏠리게 골라 결과가 균형형으로 안 빠지게 했다 */
export const SAMPLE_TEAM: SampleSeed[] = [
  { name: '은우', birthDate: '1990-06-15', birthHour: 12 },
  { name: '서림', birthDate: '1988-06-20', birthHour: 14 },
  { name: '효경', birthDate: '1995-07-01', birthHour: 10 },
]

export const SAMPLE_TEAM_NAME = '푸른핫가마'

/**
 * 랜딩에 스치듯 보여주는 유형 이름.
 *
 * 21개 중 제일 알아보기 쉬운 것들을 손으로 골랐다. `ARCHETYPES` 에서 자동으로 뽑으면
 * 아무거나 나온다. 대신 실제 유형에 있는 이름인지는 테스트가 지킨다.
 *
 * 이게 이 제품에서 제일 재미있는 부분인데 지금까지는 결과 화면에 도착해야만 보였다.
 */
export const LANDING_TASTE = [
  '브레이크 없는 팀',
  '회의록만 두꺼워지는 팀',
  '결론이 안 나는 팀',
  '온도가 낮은 팀',
  '다 있는데 안 움직이는 팀',
]
