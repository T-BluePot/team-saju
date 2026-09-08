import { CommonButton } from '../Common'
import { exampleNoticeCopy } from '../../lib/copy'

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
        {exampleNoticeCopy.notice}
      </p>
      <CommonButton
        type="button"
        variant="ghost"
        className="shrink-0 whitespace-nowrap"
        onClick={onStart}
      >
        {exampleNoticeCopy.cta}
      </CommonButton>
    </div>
  )
}
