import type { ReactNode } from 'react'

/**
 * 화면 하단에 붙는 주 동작 바.
 *
 * 랜딩과 입력과 결과가 같은 것을 쓴다. 셋이 제각각이면 주 버튼이 화면마다
 * 다른 자리에 앉아서 어디를 눌러야 하는지를 매번 다시 배워야 한다.
 *
 * `AppNotice` 가 바닥 36px 을 이미 차지하고 있어서 그 위에 앉힌다. 바와 고지
 * 사이의 틈은 같은 종이로 덮는다. 안 덮으면 그 틈으로 본문이 지나간다.
 * 랜딩에서 `bottom-12` 로 띄웠다가 같은 문제를 겪은 자리다.
 */
export function AppBottomBar({
  children,
  hint,
}: {
  children: ReactNode
  /** 버튼 위에 뜨는 안내 한 줄. 왜 못 누르는지 같은 사정을 여기서 말한다 */
  hint?: string
}) {
  return (
    <div
      className="sticky bottom-9 z-10 -mx-5 mt-8 px-5 pb-3 pt-3.5"
      style={{ background: 'var(--paper)', borderTop: '1px solid var(--rule)' }}
    >
      {hint && (
        <p className="mb-2.5 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      )}
      <div className="flex flex-col gap-2.5">{children}</div>
      {/* 바 아래 고지까지의 틈. 같은 종이로 덮어야 본문이 안 지나간다 */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-full h-9"
        style={{ background: 'var(--paper)' }}
      />
    </div>
  )
}
