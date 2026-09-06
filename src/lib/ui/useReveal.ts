import { useEffect, useRef, useState } from 'react'

/** 관찰자가 안 불릴 때 그냥 켜버리는 시간 */
const FALLBACK_MS = 1200

/** 모션을 꺼둔 사람에게는 애니메이션 없이 최종 상태로 바로 준다 */
export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * 화면에 들어올 때 한 번만 켜진다.
 *
 * 결과 화면이 길어서 아래쪽 차트는 스크롤해야 보인다. 처음부터 재생하면
 * 도착했을 때 이미 끝나 있다. 들어오는 순간 시작해야 채워지는 게 보인다.
 *
 * 한 번 켜지면 관찰을 끊는다. 스크롤을 오르내릴 때마다 다시 차오르면 성가시다.
 *
 * 폴백 타이머를 같이 둔다. 관찰자가 어떤 이유로든 안 불리면 차트가 0 인 채로 영원히 남는다.
 * 애니메이션을 못 보는 건 참을 수 있어도 결과가 안 보이는 건 안 된다.
 */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null)
  // 관찰할 방법이 없거나 모션을 껐으면 처음부터 켜둔다
  const [shown, setShown] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver !== 'function',
  )

  useEffect(() => {
    if (shown) return
    const el = ref.current
    if (!el) return

    const fallback = window.setTimeout(() => setShown(true), FALLBACK_MS)

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [shown])

  return { ref, shown }
}

/**
 * 0에서 목표값까지 세어 올린다.
 *
 * requestAnimationFrame 으로 돈다. setInterval 은 프레임과 안 맞아서 숫자가 튄다.
 *
 * 여기도 받침을 둔다. rAF 는 문서가 숨겨지면 멈추는데, 그 사이 화면에 0 이 남아 있으면
 * 균형 점수가 0점인 것처럼 보인다. 애니메이션보다 맞는 숫자가 먼저다.
 */
export function useCountUp(target: number, run: boolean, ms = 900): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))

  useEffect(() => {
    if (!run) return

    // 모션을 껐으면 길이를 0으로 둔다. 첫 프레임에 목표값으로 끝난다
    const duration = prefersReducedMotion() ? 0 : ms
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1)
      // 감속 곡선. 끝에서 부드럽게 멈춘다
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const fallback = window.setTimeout(() => setValue(target), duration + 400)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fallback)
    }
  }, [target, run, ms])

  return value
}
