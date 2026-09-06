import { useEffect } from 'react'

import { useTeamStore } from '../../store/teamStore'

/** 되돌릴 수 있는 시간. 이 뒤에는 조용히 사라진다 */
const HOLD_MS = 6000

/**
 * 팀원을 지웠을 때 뜨는 되돌리기.
 *
 * v1은 아무것도 저장하지 않아서 잘못 지우면 그 사람 생년월일시를 다시 물어봐야 한다.
 * 대리 입력이면 팀원한테 또 물어보는 상황이 된다.
 *
 * **화면에 띄우지 않고 목록 바로 아래 흐름 안에 둔다.** fixed 로 하단에 띄웠더니
 * 같은 자리에 sticky 로 붙어 있는 "N명 분석하기" 를 통째로 덮었다. 흐름 안에 두면
 * 겹칠 게 없고, 삭제 버튼 바로 다음 순서라 Tab 한 번이면 되돌리기에 닿는다.
 */
export function InputUndoToast() {
  const removed = useTeamStore((s) => s.removed)
  const undoRemove = useTeamStore((s) => s.undoRemove)
  const dismissRemoved = useTeamStore((s) => s.dismissRemoved)

  useEffect(() => {
    if (!removed) return
    // removed 는 지울 때마다 새 객체라 연속으로 지우면 타이머가 다시 시작된다
    const t = window.setTimeout(dismissRemoved, HOLD_MS)
    return () => window.clearTimeout(t)
  }, [removed, dismissRemoved])

  if (!removed) return null

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-2"
      style={{ background: 'var(--ink)', color: 'var(--paper)' }}
    >
      {/* 라이브 리전은 알리는 자리다. 조작하는 버튼은 밖에 둔다 */}
      <span role="status" className="text-sm">
        {removed.member.name} 뺐어요
      </span>
      <button
        type="button"
        onClick={undoRemove}
        className="serif min-h-11 shrink-0 rounded-lg px-4 text-sm font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: 'var(--paper)', outlineColor: 'var(--paper)' }}
      >
        되돌리기
      </button>
    </div>
  )
}
