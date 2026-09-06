import { useEffect } from 'react'

import { useTeamStore } from '../../store/teamStore'

/** 되돌릴 수 있는 시간. 이 뒤에는 조용히 사라진다 */
const HOLD_MS = 6000

/**
 * 팀원을 지웠을 때 뜨는 되돌리기.
 *
 * v1은 아무것도 저장하지 않아서 잘못 지우면 그 사람 생년월일시를 다시 물어봐야 한다.
 * 대리 입력이면 팀원한테 또 물어보는 상황이 된다.
 */
export function InputUndoToast() {
  const removed = useTeamStore((s) => s.removed)
  const undoRemove = useTeamStore((s) => s.undoRemove)
  const dismissRemoved = useTeamStore((s) => s.dismissRemoved)

  const name = removed?.member.name

  useEffect(() => {
    if (!name) return
    const t = window.setTimeout(dismissRemoved, HOLD_MS)
    return () => window.clearTimeout(t)
    // 같은 사람을 다시 지우면 타이머도 다시 시작해야 해서 removed 자체를 본다
  }, [removed, name, dismissRemoved])

  if (!removed) return null

  return (
    <div
      // AppNotice 가 하단에 고정돼 있어서 그 위로 띄운다
      className="fixed inset-x-0 bottom-12 z-40 flex justify-center px-5"
      role="status"
    >
      <div
        className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-lg"
        style={{ background: 'var(--ink)', color: 'var(--paper)' }}
      >
        <span className="text-sm">{removed.member.name} 뺐어요</span>
        <button
          type="button"
          onClick={undoRemove}
          className="serif min-h-11 shrink-0 rounded-lg px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: 'var(--paper)', outlineColor: 'var(--paper)' }}
        >
          되돌리기
        </button>
      </div>
    </div>
  )
}
