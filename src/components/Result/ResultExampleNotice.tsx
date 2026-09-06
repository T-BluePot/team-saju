import { CommonButton } from '../Common'

/**
 * 예시 리포트를 보고 있다는 표시.
 *
 * 이게 없으면 사용자가 자기 팀 결과로 오해한다. 화면 맨 위에 두고,
 * 바로 내 팀으로 넘어갈 수 있게 버튼을 같이 둔다.
 */
export function ResultExampleNotice({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
      style={{ background: 'var(--accent-wash)' }}
    >
      <p className="text-sm leading-relaxed" style={{ color: 'var(--accent-deep)' }}>
        <b>예시입니다.</b> 실제 사람이 아니라 만들어둔 표본 팀으로 뽑은 결과예요
      </p>
      <CommonButton
        type="button"
        variant="ghost"
        className="shrink-0 whitespace-nowrap"
        onClick={onStart}
      >
        내 팀으로 해보기
      </CommonButton>
    </div>
  )
}
