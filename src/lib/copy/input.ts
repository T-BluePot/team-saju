// 팀 만들기 화면. 팀 이름, 팀원 추가 폼, 팀원 목록, 되돌리기 토스트.

export const inputCopy = {
  teamNameLabel: '팀 이름',
  teamNameHint: '공유 이미지에 표시됩니다',
  teamNamePlaceholder: '우리 팀',
  // 버튼 라벨은 상태와 무관하게 고정한다. 왜 못 누르는지는 버튼 위에서 말한다
  submitHint: '팀원을 1명 이상 추가해 주세요',
  submit: '분석하기',
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
  hourUnknownNote: '시주를 제외하고 계산합니다',

  /** 시간을 지시로 고를지 시각으로 넣을지 */
  hourModeGroup: '시간을 넣는 방법',
  hourModeBranch: '십이지시',
  hourModeClock: '직접 입력',
  hourBranchLabel: '지시',
  hourBranchNote: '태어난 시를 모르면 어림해도 괜찮습니다. 시주만 달라집니다',
  /** 자시가 자정을 걸쳐서 두 칸인 이유 */
  hourBranchMidnightNote: '자시는 자정을 걸쳐서 둘로 나눠 받습니다',

  /**
   * 시각 한 점을 읽는 말.
   *
   * 때 이름은 십이지시 경계에 맞춰 끊는다. 5시 30분은 새벽이고 6시는 오전,
   * 17시 30분은 오후고 19시는 저녁이다. 시간 단위로 반올림해서 끊으면
   * 지시의 시작과 끝이 다른 때 이름으로 읽혀서 한 칸이 두 때에 걸친다.
   *
   * 23시 59분은 자정으로 읽는다. 야자시의 끝이라 `밤 11:59` 보다 자정이 맞다.
   */
  clockAt: (hour: number, minute: number) => {
    if (minute === 0 && hour === 0) return '자정'
    if (minute === 59 && hour === 23) return '자정'
    if (minute === 0 && hour === 12) return '정오'
    const period =
      hour < 6 ? '새벽' : hour < 12 ? '오전' : hour < 18 ? '오후' : hour < 20 ? '저녁' : '밤'
    const h12 = hour % 12 === 0 ? 12 : hour % 12
    const mm = minute === 0 ? '' : `:${String(minute).padStart(2, '0')}`
    return `${period} ${h12}${mm}`
  },
  hourRange: (from: string, to: string) => `${from} ~ ${to}`,
  trueSolarTime: '진태양시 보정',
  trueSolarTimeNote:
    '태어난 시간을 실제 태양시 기준으로 보정합니다. 정확한 계산을 위해 켜두는 것을 권장합니다.',
  sourceGroup: '누구의 정보인가요?',
  sourceSelfTitle: '나',
  sourceSelfDesc: '본인 정보를 입력합니다',
  sourceDelegatedTitle: '팀원',
  sourceDelegatedDesc: '팀원 본인의 동의를 받아 정보를 입력합니다',
  delegatedWarning: '타인의 개인정보는 본인의 동의 없이 입력할 수 없습니다.',
  submit: '추가하기',
  // 스크린리더에만 읽힌다. 화면에는 팀원 칩으로 이미 보인다
  addedFull: (name: string, count: number) => `${name} 추가했습니다. ${count}명으로 꽉 찼습니다`,
  added: (name: string, count: number) => `${name} 추가했습니다. 지금 ${count}명`,
} as const

export const memberListCopy = {
  count: (count: number) => `팀원 ${count}명`,
  delegated: '대리',
  remove: (name: string) => `${name} 삭제`,
} as const

export const undoToastCopy = {
  removed: (name: string) => `${name}님을 목록에서 삭제했습니다`,
  undo: '되돌리기',
} as const
