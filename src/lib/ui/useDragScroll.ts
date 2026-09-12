import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from './useReveal'

/** 이만큼 끌었으면 넘기려던 것으로 본다. 그 아래는 그냥 누른 것 */
const DRAG_PX = 6

/**
 * 밀어서 넘기고, 눌러서 넘긴다.
 *
 * 손가락은 브라우저가 알아서 밀어준다. 마우스에는 그런 게 없어서, 스크롤바를
 * 감춰두면 좌우로 넘겨보는 줄에 닿을 방법이 사라진다. 창을 좁게 쓰는 데스크탑에서
 * 기운 카드 둘째 장이 그렇게 사라졌다. 막대를 꺼내는 대신 끌 수 있게 한다.
 *
 * 마우스만 받는다. 손가락까지 가로채면 브라우저가 해주는 관성과 스냅을 잃는다.
 *
 * 끄는 동안에는 스냅을 끈다. `scroll-snap-type: x mandatory` 가 켜진 채로
 * `scrollLeft` 를 직접 밀면 매 프레임 제자리로 당겨져서 덜덜 떨린다.
 *
 * 옆에 반쯤 걸린 장을 누르면 그 장을 제자리로 데려온다. 옆 끝이 보이는 건
 * 더 있다는 표시인데, 보이는 걸 눌렀을 때 아무 일도 안 나면 그게 표시인 줄 모른다.
 * 끌기까지 안 해도 되니 손가락이든 마우스든 한 번 누르면 넘어간다.
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

    /**
     * 목표 자리까지 부드럽게 굴린다.
     *
     * 굴리는 동안 스냅을 끈다. `x mandatory` 가 켜진 채로 프로그램이 스크롤하면
     * 브라우저가 도중에 제일 가까운 장으로 다시 당겨서, 한 칸 넘어가는 게
     * 한 번 눌러서는 안 되고 두 번 눌러야 됐다.
     *
     * 되돌리는 건 시간으로만 받는다. `scrollend` 로도 받아봤는데 굴리기 시작한
     * 첫 프레임에 떠버려서, 스냅이 곧바로 살아나 제자리로 되당겼다.
     * 목표가 어차피 스냅 자리라 다 굴린 뒤에 켜도 안 움직인다.
     */
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

    /**
     * 끌기를 놓는다. 손을 뗐을 때와 **줄 밖으로 나갔을 때** 둘 다 여기로 온다.
     *
     * 포인터를 붙잡아두지 않아서 줄을 벗어나면 `pointermove` 가 끊긴다. 그 상태로
     * 바깥에서 손을 떼면 `pointerup` 이 이 줄에 안 와서, 스냅이 꺼진 채로 끌던
     * 상태가 그대로 물려 있었다. 다음에 누를 때까지 스냅이 안 살아난다.
     *
     * 놓는 순간 스냅이 살아나면서 제일 가까운 장으로 붙는다.
     */
    const end = (e: PointerEvent) => {
      if (id === null || e.pointerId !== id) return
      id = null
      el.style.scrollSnapType = snap
      el.style.userSelect = ''
    }

    /** 이 줄의 직계 자식 중 누른 자리를 품은 것 */
    const slideOf = (target: EventTarget | null) => {
      let node = target instanceof Element ? target : null
      while (node && node.parentElement !== el) node = node.parentElement
      return node
    }

    /**
     * 끌지 않고 눌렀으면 누른 장을 제자리로 데려온다.
     *
     * 끌고 나서 손을 뗀 자리에 버튼이 있으면 그 버튼이 눌린다. 팀원 칩 줄에서
     * 넘기려다 사람이 바뀌는 게 그 경우다. 그래서 끈 뒤의 `click` 은 막는다.
     */
    const click = (e: MouseEvent) => {
      if (moved >= DRAG_PX) {
        e.preventDefault()
        e.stopPropagation()
        moved = 0
        return
      }

      // 나란히 서 있으면 데려올 게 없다
      if (el.scrollWidth <= el.clientWidth + 1) return

      const slide = slideOf(e.target)
      if (!slide) return

      const pad = parseFloat(getComputedStyle(el).paddingInlineStart) || 0
      const shift = slide.getBoundingClientRect().left - el.getBoundingClientRect().left - pad
      // 이미 제자리다. 여기서 또 굴리면 눌렀을 때 미세하게 떠는 것처럼 보인다
      if (Math.abs(shift) < 2) return

      el.scrollTo({
        left: el.scrollLeft + shift,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    // 자식 사이를 지날 때는 안 뜨는 이벤트다. 줄 밖으로 나갈 때만 뜬다
    el.addEventListener('pointerleave', end)
    el.addEventListener('click', click, true)

    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      el.removeEventListener('pointerleave', end)
      el.removeEventListener('click', click, true)
      el.style.scrollSnapType = snap
      el.style.userSelect = ''
    }
  }, [])

  return ref
}
