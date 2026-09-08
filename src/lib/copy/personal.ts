// 개인 명식 탭.

export const personalCopy = {
  sourceDelegated: '대리 입력',
  sourceSelf: '본인 입력',
  pillarNote:
    '기둥마다 지장간, 기운의 단계, 납음을 적었어요. 단계는 그 글자에서 기운이 어디쯤 있는지 보여주는 거지 좋고 나쁨을 가르는 게 아니에요',
  // 일간과 공망은 글자가 굵게 들어가는 자리라 앞뒤를 나눠 둔다
  dayMasterPrefix: '일간은',
  dayMasterSuffix: '. 사주에서 나 자신에 해당하는 글자예요',
  voidPrefix: '공망은',
  voidSuffix: '. 이 사주에서 비어 있는 칸이에요. 나쁜 뜻은 아니에요',
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
  strong: { name: '신강', note: '주도적이고 추진력이 있어요. 대신 고집이 셀 수 있어요' },
  balanced: { name: '중화', note: '균형이 잡혀 있고 적응이 빨라요' },
  weak: { name: '신약', note: '협력형이에요. 환경에 민감하고 조율을 잘해요' },
} as const
