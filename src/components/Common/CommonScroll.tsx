import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** 펼치는 데 걸리는 시간 */
const UNROLL_MS = 900

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 족자.
 *
 * 유형을 걸어 보여주는 판이다. 랜딩에서 한 장씩 넘겨보고, 결과에서는 펼쳐진다.
 * 둘이 같은 판을 쓴다. 판을 두 벌로 만들면 모서리와 금선이 곧 갈린다.
 *
 * `unroll` 을 주면 위 봉에서 아래로 걷히며 열린다. 아래 봉이 걷히는 끝단을
 * 따라 내려온다. 저감 모션에서는 펼치지 않고 바로 다 열린 상태로 둔다.
 */
export function CommonScroll({
  children,
  unroll = false,
  overlay,
}: {
  children: ReactNode
  /** 열리는 동작을 보여준다. 결과 화면이 쓴다 */
  unroll?: boolean
  /** 판 위에 얹는 것. 캐러셀 화살표가 여기 온다 */
  overlay?: ReactNode
}) {
  // 저감 모션이면 첫 그림부터 다 펼친 상태다. 열고 나서 되돌리지 않는다
  const [p, setP] = useState(() => (unroll && !reduced() ? 0 : 1))
  const [wave, setWave] = useState(0)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!unroll || reduced()) return

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / UNROLL_MS, 1)
      // 처음에 빨리 풀리고 끝에서 잦아든다
      const eased = 1 - Math.pow(1 - t, 3)
      setP(eased)
      // 흔들림은 열리는 동안만 있고 끝에서 0 으로 죽는다
      setWave(Math.sin(t * Math.PI * 3) * (1 - t))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [unroll])

  const paper = (
    <div className="scroll-silk">
      <div className="scroll-paper">
        <span aria-hidden="true" className="scroll-frame" />
        {overlay}
        {children}
      </div>
    </div>
  )

  return (
    <div className="scroll">
      <span aria-hidden="true" className="scroll-rod" />
      {unroll ? (
        <div
          className="scroll-stage"
          style={{ '--p': p, '--wave': wave } as React.CSSProperties}
        >
          <div className="scroll-curtain">{paper}</div>
          <span
            aria-hidden="true"
            className="scroll-ripple"
            style={{ '--rp': p, '--ro': p < 1 ? 0.5 : 0 } as React.CSSProperties}
          />
          <span aria-hidden="true" className="scroll-rod bottom" />
        </div>
      ) : (
        <>
          {paper}
          <span aria-hidden="true" className="scroll-rod" />
        </>
      )}
    </div>
  )
}
