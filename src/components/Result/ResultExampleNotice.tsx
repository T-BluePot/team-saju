import { exampleNoticeCopy } from '../../lib/copy'

/**
 * 예시 리포트를 보고 있다는 표시.
 *
 * 이게 없으면 사용자가 자기 팀 결과로 오해한다. 다만 이건 알림이지 결론이 아니다.
 * 분홍 상자에 큰 버튼까지 얹었더니 결과보다 먼저 눈에 들어왔다. 한 줄짜리 띠로
 * 낮추고, 넘어가는 길은 밑줄 친 글자로 둔다. 회색 테두리 버튼은 옆의 흐린 본문과
 * 붙어 보여서 눌러야 할 것으로 안 읽혔다.
 */
export function ResultExampleNotice({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-xs"
      style={{ background: 'var(--paper-deep)', color: 'var(--ink-soft)' }}
    >
      <p>{exampleNoticeCopy.notice}</p>
      <button
        type="button"
        onClick={onStart}
        className="press -my-1 shrink-0 rounded px-1 py-1 font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: 'var(--ink)', outlineColor: 'var(--accent)' }}
      >
        {exampleNoticeCopy.cta}
      </button>
    </div>
  )
}
