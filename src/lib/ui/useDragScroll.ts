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
     * 끌기를 놓는다. 놓는 순간 스냅이 살아나면서 제일 가까운 장으로 붙는다.
     *
     * `keepMoved` 가 끈 거리를 남길지 정한다. 손을 뗀 경우에는 곧바로 `click` 이
     * 따라오니까 남겨야 한다. 그 값으로 "넘기려던 것"과 "그냥 누른 것"을 가른다.
     *
     * 줄 밖으로 나가서 끝난 경우에는 비운다. 남겨두면 그 뒤에 `pointerdown` 없이
     * 오는 첫 클릭이 끌기로 오인돼서 삭제된다. 키보드로 칩에 포커스를 주고
     * Enter 를 누르는 게 그 경우다. 사람이 안 바뀐다.
     */
    const release = (e: PointerEvent, keepMoved: boolean) => {
      if (id === null || e.pointerId !== id) return
      id = null
      if (!keepMoved) moved = 0
      el.style.scrollSnapType = snap
      el.style.userSelect = ''
    }

    const up = (e: PointerEvent) => release(e, true)

    /**
     * 줄을 벗어나면 그 자리에서 놓는다.
     *
     * 포인터를 붙잡아두지 않아서 줄을 벗어나면 `pointermove` 가 끊긴다. 그 상태로
     * 바깥에서 손을 떼면 `pointerup` 이 이 줄에 안 와서, 스냅이 꺼진 채로 끌던
     * 상태가 다음에 누를 때까지 물려 있었다.
     */
    const away = (e: PointerEvent) => release(e, false)

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
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', away)
    // 자식 사이를 지날 때는 안 뜨는 이벤트다. 줄 밖으로 나갈 때만 뜬다
    el.addEventListener('pointerleave', away)
    el.addEventListener('click', click, true)

    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', away)
      el.removeEventListener('pointerleave', away)
      el.removeEventListener('click', click, true)
      el.style.scrollSnapType = snap
      el.style.userSelect = ''
    }
  }, [])

  return ref
}
