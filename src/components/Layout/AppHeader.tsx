import { useTeamStore } from '../../store/teamStore'

export function AppHeader() {
  const goLanding = useTeamStore((s) => s.goLanding)
  const view = useTeamStore((s) => s.view)

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-sm"
      style={{
        background: 'color-mix(in srgb, var(--paper) 88%, transparent)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="seal size-6 text-[11px]">占</span>
          <span className="serif text-base font-extrabold tracking-tight">팀사주</span>
        </div>
        {(view === 'result' || view === 'loading') && (
          <button
            type="button"
            onClick={goLanding}
            className="min-h-11 rounded-lg px-3.5 text-sm"
            style={{ border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
          >
            처음부터
          </button>
        )}
      </div>
    </header>
  )
}
