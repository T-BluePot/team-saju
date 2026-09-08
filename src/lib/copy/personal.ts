// 개인 명식 탭.

export const personalCopy = {
  sourceDelegated: '팀원 정보',
  sourceSelf: '본인 정보',
  pillarNote:
    '각 기둥에는 지장간, 기운의 단계, 납음이 표시돼요. 단계는 기운의 흐름을 보여주는 값입니다.',
  // 일간과 공망은 글자가 굵게 들어가는 자리라 앞뒤를 나눠 둔다
  dayMasterPrefix: '일간은',
  dayMasterSuffix: '. 사주에서 나 자신을 나타내는 글자예요.',
  voidPrefix: '공망은',
  voidSuffix:
    '. 일주를 기준으로 정해지는 두 글자로, 개인 명식을 살펴볼 때 참고하는 정보예요.',
  strengthIndex: (index: number) => `지수 ${index} · 간이 판정`,
  traitsHeading: '협업 성향',
  tenGodsHeading: '십신',
  pairsHeading: '다른 팀원과의 조합',
  corrections: '계산 근거 보기',
} as const

/**
 * 일간 강약 3단계.
 *
 * 이름과 판정 기준은 `docs/03-saju-spec.md` 의 강약 표에서 왔다. 다만 화면에
 * 나가는 문장은 그 표의 키워드를 풀어 쓴 카피라 여기 둔다. 표를 고치면 이
 * 문장도 같이 봐야 한다.
 */
export const strengthCopy = {
  strong: {
    name: '신강',
    note: '주도적이고 추진력이 있어요. 다만 한 번 정한 방향을 쉽게 바꾸지 않을 수 있어요.',
  },
  balanced: { name: '중화', note: '균형이 잡혀 있고 적응이 빨라요' },
  weak: {
    name: '신약',
    note: '주변을 잘 살피고 조율을 잘해요. 다만 환경의 영향을 많이 받을 수 있어요.',
  },
} as const
