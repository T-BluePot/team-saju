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
  /**
   * 짚어줄 축. 제일 두꺼운 쪽과 얇은 쪽을 강조할 때 넘긴다.
   * 안 넘기면 전부 강조색이다. 짚을 축이 없다는 것과 전부 흐리게 하라는 건 다르다.
   */
  highlight?: TraitAxis[]
}) {
  return (
    <ul className="flex flex-col gap-2">
      {TRAIT_AXES.map((axis) => {
        const dim = highlight != null && !highlight.includes(axis)
        const weight = highlight != null && !dim ? 'font-bold' : ''
        return (
          <li key={axis} className="flex items-center gap-3">
            <span className={`w-9 shrink-0 text-sm ${weight}`}>{axis}</span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full"
              style={{ background: 'var(--rule)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${traits[axis]}%`,
                  background: dim ? 'var(--ink-soft)' : 'var(--accent)',
                }}
              />
            </div>
            <span
              className={`w-9 shrink-0 text-right text-sm tabular-nums ${weight}`}
            >
              {traits[axis]}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}
