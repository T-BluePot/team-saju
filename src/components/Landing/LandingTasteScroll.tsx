import { useState } from 'react'
import type { TouchEvent } from 'react'
import { CommonScroll } from '../Common'
// 유형 족자는 결과 화면 것이다. 첫 화면은 그걸 그대로 걸어서 넘겨보게만 한다
import { ArchetypeScroll } from '../Result'
import { landingCopy } from '../../lib/copy'
import { ARCHETYPES } from '../../lib/report/archetypes'
import { LANDING_TASTE } from '../../lib/report/sample'
import { needsBlock } from '../../lib/report/solo'

/** 손가락으로 넘겼다고 볼 최소 거리 */
const SWIPE_PX = 40

const PICKED = LANDING_TASTE.map((name) => {
  const found = ARCHETYPES.find((a) => a.name === name)
  // 이름이 표에 있는지는 sample.test.ts 가 지킨다
  if (!found) throw new Error(name)
  return found
})

const REST = ARCHETYPES.length - PICKED.length
/** 마지막 한 장은 그림 없이 남은 유형 수만 센다 */
const COUNT = PICKED.length + 1

/**
 * 첫 화면의 유형 족자.
 *
 * 이게 이 제품에서 제일 재미있는 부분인데, 이름만 알약으로 늘어놨을 때는
 * 그냥 목록으로 읽혔다. 한 장씩 걸어두면 한 유형을 끝까지 읽게 된다.
 */
export function LandingTasteScroll() {
  const [i, setI] = useState(0)
  const [from, setFrom] = useState<number | null>(null)

  const move = (step: number) => setI((n) => Math.min(Math.max(n + step, 0), COUNT - 1))

  const onTouchStart = (e: TouchEvent) => setFrom(e.touches[0].clientX)
  const onTouchEnd = (e: TouchEvent) => {
    if (from === null) return
    const dx = e.changedTouches[0].clientX - from
    setFrom(null)
    if (Math.abs(dx) >= SWIPE_PX) move(dx < 0 ? 1 : -1)
  }

  const archetype = PICKED[i]

  const nav = (
    <>
      <NavButton
        label={landingCopy.tastePrev}
        side="left"
        disabled={i === 0}
        onClick={() => move(-1)}
      >
        &#8249;
      </NavButton>
      <NavButton
        label={landingCopy.tasteNext}
        side="right"
        disabled={i === COUNT - 1}
        onClick={() => move(1)}
      >
        &#8250;
      </NavButton>
    </>
  )

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {archetype ? (
        <ArchetypeScroll
          archetype={archetype}
          needs={needsBlock(false, archetype)}
          overlay={nav}
        />
      ) : (
        <CommonScroll overlay={nav}>
          <div className="flex flex-1 flex-col justify-center gap-3">
            <p className="serif text-2xl font-extrabold" style={{ color: 'var(--ink-soft)' }}>
              {landingCopy.tasteMore(REST)}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {landingCopy.tasteMoreNote}
            </p>
          </div>
        </CommonScroll>
      )}

      {/* 몇 번째 장인지만 알려주는 자리. 읽어줄 내용은 판 안에 다 있다 */}
      <div aria-hidden="true" className="flex justify-center gap-1.5 pt-4">
        {Array.from({ length: COUNT }, (_, n) => (
          <span
            key={n}
            className="h-1 rounded-full transition-[width,background-color] duration-200"
            style={{
              width: n === i ? '16px' : '5px',
              background: n === i ? 'var(--ink-soft)' : 'var(--rule)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function NavButton({
  label,
  side,
  disabled,
  onClick,
  children,
}: {
  label: string
  side: 'left' | 'right'
  disabled: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`press absolute top-1/2 z-10 h-13 w-7 -translate-y-1/2 text-2xl leading-none transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 ${
        side === 'left' ? 'left-0' : 'right-0'
      } ${disabled ? 'opacity-15' : 'opacity-40 hover:opacity-80'}`}
      style={{ color: 'var(--ink)', outlineColor: 'var(--accent)' }}
    >
      {children}
    </button>
  )
}
