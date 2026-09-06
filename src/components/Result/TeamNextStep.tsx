import { CommonButton } from '../Common'

/**
 * 결과 맨 아래. 여기가 막다른 길이면 안 된다.
 * 다 읽고 나면 팀원을 고치거나 다른 팀으로 다시 갈 수 있게 둔다.
 *
 * 라벨은 위쪽 컨트롤과 맞춘다. 같은 동작에 다른 이름이 붙으면
 * 사용자는 셋이 다른 일을 한다고 읽는다.
 */
export function TeamNextStep({
  count,
  onEdit,
  onRestart,
}: {
  count: number
  onEdit: () => void
  onRestart: () => void
}) {
  const full = count >= 8

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <p className="text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
        {full
          ? '여덟 명이 꽉 찼습니다. 사람을 바꿔 넣으면 결과가 달라집니다'
          : '한 명 더 넣으면 팀 유형이 바뀔 수도 있습니다'}
      </p>
      <div className="flex w-full gap-2.5">
        <CommonButton type="button" variant="ghost" className="flex-1" onClick={onEdit}>
          팀원 수정
        </CommonButton>
        <CommonButton
          type="button"
          variant="ghost"
          className="flex-1 whitespace-nowrap"
          onClick={onRestart}
        >
          다른 팀으로 다시
        </CommonButton>
      </div>
    </div>
  )
}
