// 팀 만들기 화면. 팀 이름, 팀원 추가 폼, 팀원 목록, 되돌리기 토스트.

export const inputCopy = {
  teamNameLabel: '팀 이름',
  teamNameHint: '공유 이미지에 들어갑니다. 편한 이름으로 적어주세요',
  teamNamePlaceholder: '우리 팀',
  submitEmpty: '팀원을 1명 이상 넣어주세요',
  submit: (count: number) => `${count}명 분석하기`,
} as const

export const memberFormCopy = {
  title: '팀원 추가',
  nameLabel: '이름',
  namePlaceholder: '별칭도 괜찮아요',
  birthDateLabel: '생년월일',
  solar: '양력',
  lunar: '음력',
  leapMonth: '윤달',
  hourGroup: '태어난 시간',
  hourUnknown: '시간을 몰라요',
  hourLabel: '시',
  minuteLabel: '분',
  hourOption: (hour: string) => `${hour}시`,
  minuteOption: (minute: string) => `${minute}분`,
  hourUnknownNote: '시주를 빼고 세 기둥만 봅니다',
  trueSolarTime: '진태양시 보정',
  trueSolarTimeNote: '시계가 태양보다 30분 빨라서 빼줍니다. 대부분 켜두면 됩니다',
  sourceGroup: '누구 정보인가요',
  sourceSelfTitle: '본인 정보입니다',
  sourceSelfDesc: '내 생년월일시를 넣습니다',
  sourceDelegatedTitle: '본인에게 동의를 받고 대신 입력합니다',
  sourceDelegatedDesc: '팀원에게 알리고 허락을 받았습니다',
  delegatedWarning:
    '팀원에게 생년월일시를 넣는다고 알리고 동의를 받으셨나요. 동의 없이 타인의 개인정보를 입력하면 곤란해질 수 있습니다',
  submit: '팀원 추가',
  // 스크린리더에만 읽힌다. 화면에는 팀원 칩으로 이미 보인다
  addedFull: (name: string, count: number) => `${name} 추가했습니다. ${count}명으로 꽉 찼습니다`,
  added: (name: string, count: number) => `${name} 추가했습니다. 지금 ${count}명`,
} as const

export const memberListCopy = {
  count: (count: number) => `팀원 ${count}명`,
  max: (max: number) => `최대 ${max}명`,
  delegated: '대리',
  remove: (name: string) => `${name} 삭제`,
} as const

export const undoToastCopy = {
  removed: (name: string) => `${name} 뺐어요`,
  undo: '되돌리기',
} as const
