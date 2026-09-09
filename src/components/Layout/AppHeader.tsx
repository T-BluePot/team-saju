import { commonCopy } from '../../lib/copy'
import { useTeamStore } from '../../store/teamStore'

export function AppHeader() {
  const goLanding = useTeamStore((s) => s.goLanding)
  const view = useTeamStore((s) => s.view)

  /**
   * 결과와 로딩에서는 오른쪽 버튼 대신 왼쪽에 뒤로가기를 둔다.
   * 되돌아가는 동작은 화면 왼쪽 위에 있을 거라고 기대하는 자리다.
   */
  const showBack = view === 'result' || view === 'loading'

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-sm"
      style={{
        background: 'color-mix(in srgb, var(--paper) 88%, transparent)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div
        className="mx-auto grid w-full max-w-2xl items-center gap-2 px-5 py-3"
        // 뒤로가기가 있는 화면에서만 브랜드를 가운데로 보낸다
        style={{ gridTemplateColumns: showBack ? '1fr auto 1fr' : 'auto' }}
      >
        {showBack && (
          <button
            type="button"
            onClick={goLanding}
            aria-label={commonCopy.restart}
            className="press -ml-2 grid size-9 place-items-center rounded-lg justify-self-start text-xl"
            style={{ color: 'var(--ink)' }}
          >
            <span aria-hidden="true">←</span>
          </button>
        )}

        <div
          className={[
            'flex items-center gap-2',
            showBack ? 'justify-self-center' : 'justify-self-start',
          ].join(' ')}
        >
          <span className="seal size-6 text-11">占</span>
          <span className="flex flex-col items-start leading-tight">
            <span className="serif text-base font-extrabold tracking-tight">
              {commonCopy.brand}
            </span>
            <span className="text-10" style={{ color: 'var(--ink-soft)' }}>
              {commonCopy.tagline}
            </span>
          </span>
        </div>

        {/* 브랜드를 가운데 두려면 오른쪽에도 같은 폭의 빈 칸이 있어야 한다 */}
        {showBack && <span />}
      </div>
    </header>
  )
}
