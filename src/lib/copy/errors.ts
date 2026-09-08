// 입력을 막을 때 폼에 뜨는 문장. role="alert" 로 읽힌다.

export const errorCopy = {
  tooMany: (max: number) => `팀원은 최대 ${max}명까지 추가할 수 있습니다.`,
  noName: '이름 또는 별칭을 입력해 주세요.',
  noBirthDate: '생년월일을 선택해 주세요.',
  noConsentSource: '본인 또는 팀원을 선택해 주세요.',
  chartFailed: '사주를 계산하지 못했습니다. 생년월일을 다시 확인해 주세요.',
} as const
