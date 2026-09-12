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
  hourBranchMidnightNote: '자시가 둘인 건 진태양시로 자정이 00:30 이기 때문입니다',

  /** `23:30` 처럼 두 자리로 읽는다. 목록이 열세 줄이라 한 줄이 짧아야 한다 */
  clockAt: (hour: number, minute: number) =>
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  hourRange: (from: string, to: string) => `${from}~${to}`,
  /** `야자시 (23:30~00:29)` */
  hourBranchOption: (name: string, range: string) => `${name} (${range})`,
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
