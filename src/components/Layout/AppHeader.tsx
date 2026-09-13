import { commonCopy } from '../../lib/copy'
import { useTeamStore } from '../../store/teamStore'

export function AppHeader() {
  const goLanding = useTeamStore((s) => s.goLanding)
  const goEdit = useTeamStore((s) => s.goEdit)
  const view = useTeamStore((s) => s.view)
  const editingId = useTeamStore((s) => s.editingId)

  /**
   * 결과와 로딩에서는 오른쪽 버튼 대신 왼쪽에 뒤로가기를 둔다.
   * 되돌아가는 동작은 화면 왼쪽 위에 있을 거라고 기대하는 자리다.
   */
  const showBack = view === 'result' || view === 'loading'

  return (
    /*
      팀원을 고쳐 쓰는 동안에는 여기도 덮인다.

      덮개를 머리글보다 아래에 깔아서(그래야 칩이 머리글을 뚫지 않는다) 머리글만
      덮이지 않고 남는다. 제 안에 같은 색을 한 겹 얹고 누르는 것도 막는다.
      `inert` 가 아니라 `pointer-events` 인 건, 이 자리에 초점이 서 있던 사람을
      갑자기 트리 밖으로 밀어내지 않으려는 것이다.
    */
    <header
      className="sticky top-0 z-30 backdrop-blur-sm"
      style={{
        background: 'color-mix(in srgb, var(--paper) 88%, transparent)',
        borderBottom: '1px solid var(--rule)',
        pointerEvents: editingId ? 'none' : undefined,
      }}
    >
      {editingId && <span aria-hidden="true" className="editscrim-top" />}
      <div
        className="grid w-full items-center gap-2 px-5 py-3"
        style={{
          // 뒤로가기가 있는 화면에서만 브랜드를 가운데로 보낸다
          gridTemplateColumns: showBack ? '1fr auto 1fr' : 'auto',
          // 결과 화면의 탭 줄이 이 높이에 맞춰 붙어 선다
          minHeight: 'var(--header-h)',
        }}
      >
        {showBack && (
          // 화살표는 뒤로 가는 표시다. 한때 여기가 전체 초기화였는데, 생김새와
          // 하는 일이 어긋나면 누른 사람이 잃는 쪽으로 어긋난다. 지우는 동작은
          // `새 팀으로 시작하기` 가 이름을 달고 맡는다.
          // `팀원 수정` 과 같은 동작이라 같은 것을 부른다. 예시일 때 비우고 나가는
          // 갈림이 그 안에 있다. 여기서 goBack 을 직접 부르면 그 갈림을 뛰어넘는다
          <button
            type="button"
            onClick={goEdit}
            aria-label={commonCopy.back}
            className="press -ml-2 grid size-9 place-items-center rounded-lg justify-self-start text-xl"
            style={{ color: 'var(--ink)' }}
          >
            <span aria-hidden="true">←</span>
          </button>
        )}

        {/*
          로고를 누르면 첫 화면으로 간다. 어느 서비스에서나 그 자리를 그렇게 쓴다.
          접근 가능한 이름은 안에 든 브랜드명과 태그라인이 그대로 만든다.
        */}
        <button
          type="button"
          onClick={goLanding}
          className={[
            'press flex items-center gap-2 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2',
            showBack ? 'justify-self-center' : 'justify-self-start',
          ].join(' ')}
          style={{ outlineColor: 'var(--accent)' }}
        >
          <span aria-hidden="true" className="seal size-6 text-11">
            占
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="serif text-base font-extrabold tracking-tight">
              {commonCopy.brand}
            </span>
            <span className="text-10" style={{ color: 'var(--ink-soft)' }}>
              {commonCopy.tagline}
            </span>
          </span>
        </button>

        {/* 브랜드를 가운데 두려면 오른쪽에도 같은 폭의 빈 칸이 있어야 한다 */}
        {showBack && <span />}
      </div>
    </header>
  )
}
