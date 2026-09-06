import { CommonButton } from '../Common'
import { useTeamStore } from '../../store/teamStore'

/**
 * 결과 맨 아래. 여기가 막다른 길이면 안 된다.
 * 공유 카드까지 다 읽고 나면 팀원을 더 넣어보거나 처음부터 다시 할 수 있게 둔다.
 */
export function TeamNextStep({ count }: { count: number }) {
  const goBack = useTeamStore((s) => s.goBack)
  const reset = useTeamStore((s) => s.reset)
  const full = count >= 8

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {full
          ? '여덟 명이 꽉 찼습니다. 사람을 바꿔 넣으면 결과가 달라집니다'
          : '한 명 더 넣으면 팀 유형이 바뀔 수도 있습니다'}
      </p>
      <div className="flex w-full gap-2.5">
        <CommonButton
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={goBack}
        >
          {full ? '팀원 바꾸기' : '팀원 더 넣기'}
        </CommonButton>
        <CommonButton
          type="button"
          variant="quiet"
          className="flex-1"
          onClick={reset}
        >
          다른 팀으로 다시
        </CommonButton>
      </div>
    </div>
  )
}
