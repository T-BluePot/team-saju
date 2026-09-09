import { TRAIT_AXES } from '../../lib/saju/constants'
import { useReveal } from '../../lib/ui/useReveal'
import type { TraitAxes, TraitAxis } from '../../lib/saju/types'

/**
 * 협업 성향 5축 막대.
 * 개인 명식과 팀 집계가 같은 모양을 쓴다. 둘을 나란히 놓고 비교하게 된다.
 */
export function SajuTraitBars({
  traits,
  strong,
  weak,
}: {
  traits: TraitAxes
  /**
   * 두꺼운 축과 얇은 축.
   *
   * 둘 다 안 넘기면 전부 강조색이다. 짚을 축이 없다는 것과 전부 흐리게
   * 하라는 건 다르다. 넘기면 두꺼운 쪽과 얇은 쪽이 서로 다른 색이 된다.
   * 같은 색으로 칠하면 어느 쪽이 넘치고 어느 쪽이 모자란지가 안 갈린다.
   */
  strong?: TraitAxis[]
  weak?: TraitAxis[]
}) {
  const { ref, shown } = useReveal<HTMLUListElement>()
  const marked = strong != null || weak != null

  return (
    <ul ref={ref} className="flex flex-col gap-2">
      {TRAIT_AXES.map((axis, i) => {
        const isStrong = strong?.includes(axis) ?? false
        const isWeak = weak?.includes(axis) ?? false
        const dim = marked && !isStrong && !isWeak
        const color = isStrong
          ? 'var(--strong-deep)'
          : isWeak
            ? 'var(--weak-deep)'
            : dim
              ? 'var(--ink-soft)'
              : 'var(--accent)'
        const textColor = isStrong || isWeak ? color : undefined

        return (
          <li key={axis} className="flex items-center gap-3">
            <span
              className={`w-9 shrink-0 text-sm ${isStrong || isWeak ? 'font-bold' : ''}`}
              style={{ color: textColor }}
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
                  width: shown ? `${traits[axis]}%` : 0,
                  background: color,
                  transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${i * 70}ms`,
                }}
              />
            </div>
            <span
              className={`w-9 shrink-0 text-right text-xs tabular-nums ${
                isStrong || isWeak ? 'font-bold' : ''
              }`}
              style={{ color: textColor }}
            >
              {traits[axis]}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}
