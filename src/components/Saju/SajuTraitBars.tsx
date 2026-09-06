import { TRAIT_AXES } from '../../lib/saju/constants'
import type { TraitAxes, TraitAxis } from '../../lib/saju/types'

/**
 * 협업 성향 5축 막대.
 * 개인 명식과 팀 집계가 같은 모양을 쓴다. 둘을 나란히 놓고 비교하게 된다.
 */
export function SajuTraitBars({
  traits,
  highlight,
}: {
  traits: TraitAxes
  /** 굵게 표시할 축. 제일 높은 축과 제일 낮은 축을 짚어줄 때 */
  highlight?: TraitAxis[]
}) {
  return (
    <ul className="flex flex-col gap-2">
      {TRAIT_AXES.map((axis) => {
        const on = highlight?.includes(axis)
        return (
          <li key={axis} className="flex items-center gap-3">
            <span
              className="w-9 shrink-0 text-sm"
              style={on ? { fontWeight: 700 } : undefined}
            >
              {axis}
            </span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full"
              style={{ background: 'var(--rule)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${traits[axis]}%`,
                  background: on ? 'var(--accent)' : 'var(--ink-soft)',
                }}
              />
            </div>
            <span
              className="w-9 shrink-0 text-right text-sm tabular-nums"
              style={on ? { fontWeight: 700 } : undefined}
            >
              {traits[axis]}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}
