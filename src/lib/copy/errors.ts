// 입력을 막을 때 폼에 뜨는 문장. role="alert" 로 읽힌다.

export const errorCopy = {
  tooMany: (max: number) => `팀원은 ${max}명까지 넣을 수 있어요`,
  noName: '이름이나 별칭을 적어주세요',
  noBirthDate: '생년월일을 골라주세요',
  noConsentSource: '본인 정보인지 대신 입력하는지 골라주세요',
  chartFailed: '사주를 계산하지 못했어요. 날짜를 다시 확인해 주세요',
} as const
