import { commonCopy } from '../../lib/copy'

const NOTICE = commonCopy.notice

/**
 * 입력, 결과 화면 하단에 항상 보이는 저장 고지.
 * 공유 뷰와는 별개로 앱 전역 하단에 고정된다.
 */
export function AppNotice() {
  return (
    <div
      className="fixed bottom-0 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-4 py-2 text-center text-11"
      style={{
        background: 'color-mix(in srgb, var(--paper) 94%, transparent)',
        borderTop: '1px solid var(--rule)',
        color: 'var(--ink-soft)',
      }}
    >
      {NOTICE}
    </div>
  )
}
