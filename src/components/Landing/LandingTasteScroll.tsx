import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const [from, setFrom] = useState<{ x: number; y: number } | null>(null)

  /**
   * 판 높이를 제일 긴 장에 맞춰 붙잡는다.
   *
   * 유형 다섯 장은 그림과 이름과 들어오면 좋은 사람이 다 들어가서 505px 인데,
   * 마지막 `외 16가지 유형` 장은 글 두 줄뿐이라 352px 이다. 그대로 두면 마지막
   * 장에서만 봉이 150px 뛰어오른다. 넘기다 보면 판이 접혔다 펴지는 것처럼 보인다.
   *
   * 값을 박아두지 않고 재서 쓴다. 폭이 바뀌면 유형 장의 높이도 같이 바뀐다.
   */
  const box = useRef<HTMLDivElement>(null)
  const [hold, setHold] = useState(0)

  useLayoutEffect(() => {
    const paper = box.current?.querySelector('.scroll-paper')
    // 붙잡고 있는 장을 재면 제 키가 아니라 붙잡힌 키가 나온다
    if (!paper || i >= PICKED.length) return
    setHold((max) => Math.max(max, Math.round(paper.getBoundingClientRect().height)))
  }, [i])

  // 폭이 바뀌면 기준도 바뀐다. 다시 재게 비운다
  useEffect(() => {
    const onResize = () => setHold(0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const move = (step: number) => setI((n) => Math.min(Math.max(n + step, 0), COUNT - 1))

  const onTouchStart = (e: TouchEvent) =>
    setFrom({ x: e.touches[0].clientX, y: e.touches[0].clientY })

  /**
   * 가로로 움직인 게 세로보다 클 때만 넘긴다.
   *
   * 가로만 보면 세로로 스크롤하다 40px 옆으로 샜을 때 장이 같이 넘어간다.
   * 이 판은 본문 한가운데에 있어서 그 위로 지나가며 내리는 일이 잦다.
   */
  const onTouchEnd = (e: TouchEvent) => {
    if (from === null) return
    const dx = e.changedTouches[0].clientX - from.x
    const dy = e.changedTouches[0].clientY - from.y
    setFrom(null)
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
  }

  const archetype = PICKED[i]

  const nav = (
    <>
      <NavButton
        label={landingCopy.tastePrev}
        side="left"
        disabled={i === 0}
        onClick={() => move(-1)}
      />
      <NavButton
        label={landingCopy.tasteNext}
        side="right"
        disabled={i === COUNT - 1}
        onClick={() => move(1)}
      />
    </>
  )

  return (
    <div ref={box} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {archetype ? (
        <ArchetypeScroll
          archetype={archetype}
          needs={needsBlock(false, archetype)}
          overlay={nav}
        />
      ) : (
        <CommonScroll overlay={nav} hold={hold}>
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
}: {
  label: string
  side: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  return (
    /*
      누르는 자리는 동그라미 하나가 아니라 그 쪽 구역 전체다. 글자만 흐리게
      얹어뒀을 때는 넘길 수 있는 판인 줄 모르고 지나갔다. 모양과 손이 닿을 때
      번지는 결은 `index.css` 의 `.scroll-nav` 가 들고 있다.
    */
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`scroll-nav ${side} focus-visible:outline-2 focus-visible:outline-offset-2`}
      style={{ outlineColor: 'var(--accent)' }}
    >
      <span aria-hidden="true" className="scroll-nav-chip">
        {/*
          꺾쇠를 글자로 두지 않는다. `&#8249;` 는 명조체에 글리프가 없어서
          폴백 글꼴로 떨어지고, 그 글꼴마다 굵기와 가운데가 달라 모양이 깨진다.
          선으로 그리면 어디서나 같다.
        */}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d={side === 'left' ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}
