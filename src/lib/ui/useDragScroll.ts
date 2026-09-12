import { useEffect, useRef } from 'react'

/** 이만큼 끌었으면 넘기려던 것으로 본다. 그 아래는 그냥 누른 것 */
const DRAG_PX = 6

/**
 * 마우스로도 밀어서 넘긴다.
 *
 * 손가락은 브라우저가 알아서 밀어준다. 마우스에는 그런 게 없어서, 스크롤바를
 * 감춰두면 좌우로 넘겨보는 줄에 닿을 방법이 사라진다. 창을 좁게 쓰는 데스크탑에서
 * 기운 카드 둘째 장이 그렇게 사라졌다. 막대를 꺼내는 대신 끌 수 있게 한다.
 *
 * 마우스만 받는다. 손가락까지 가로채면 브라우저가 해주는 관성과 스냅을 잃는다.
 *
 * 끄는 동안에는 스냅을 끈다. `scroll-snap-type: x mandatory` 가 켜진 채로
 * `scrollLeft` 를 직접 밀면 매 프레임 제자리로 당겨져서 덜덜 떨린다.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let id: number | null = null
    let startX = 0
    let startLeft = 0
    let moved = 0
    const snap = el.style.scrollSnapType

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      id = e.pointerId
      startX = e.clientX
      startLeft = el.scrollLeft
      moved = 0
      el.style.scrollSnapType = 'none'
      el.style.userSelect = 'none'
      // 글자와 그림이 끌려나가는 걸 막는다
      e.preventDefault()
    }

    const move = (e: PointerEvent) => {
      if (id === null || e.pointerId !== id) return
      const dx = e.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      el.scrollLeft = startLeft - dx
    }

    const end = (e: PointerEvent) => {
      if (id === null || e.pointerId !== id) return
      id = null
      el.style.scrollSnapType = snap
      el.style.userSelect = ''
      // 놓는 순간 스냅이 살아나면서 제일 가까운 장으로 붙는다
    }

    /**
     * 끌고 나서 손을 뗀 자리에 버튼이 있으면 그 버튼이 눌린다.
     * 팀원 칩 줄에서 넘기려다 사람이 바뀌는 게 그 경우다.
     */
    const click = (e: MouseEvent) => {
      if (moved < DRAG_PX) return
      e.preventDefault()
      e.stopPropagation()
      moved = 0
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    el.addEventListener('click', click, true)

    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      el.removeEventListener('click', click, true)
      el.style.scrollSnapType = snap
      el.style.userSelect = ''
    }
  }, [])

  return ref
}
