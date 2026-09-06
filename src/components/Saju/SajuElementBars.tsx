import { ELEMENTS, ELEMENT_LABEL, ELEMENT_TEAM_MEANING } from '../../lib/saju/constants'
import { useReveal } from '../../lib/ui/useReveal'
import type { ElementFlag, ElementScores } from '../../lib/saju/types'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

const FLAG_LABEL: Record<ElementFlag, string> = {
  excess: '넘침',
  lacking: '부족',
  empty: '비어 있음',
  normal: '',
}

type Props = {
  percents: ElementScores
  flags?: Record<string, ElementFlag>
  showMeaning?: boolean
}

export function SajuElementBars({ percents, flags, showMeaning = false }: Props) {
  const { ref, shown } = useReveal<HTMLUListElement>()

  return (
    <ul ref={ref} className="flex flex-col gap-2.5">
      {ELEMENTS.map((el, i) => {
        const flag = flags?.[el] ?? 'normal'
        return (
          <li key={el} className="flex items-center gap-3">
            <span
              className="w-11 shrink-0 text-sm font-semibold"
              style={{ color: ELEMENT_COLOR[el] }}
            >
              {el} {ELEMENT_LABEL[el]}
            </span>
            <div
              className="h-2.5 flex-1 overflow-hidden rounded-full"
              style={{ background: 'var(--rule)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  // 원소마다 조금씩 늦게 출발시켜서 하나씩 차오르게 한다
                  width: shown ? `${Math.min(percents[el] * 2, 100)}%` : 0,
                  background: ELEMENT_COLOR[el],
                  transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${i * 70}ms`,
                }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-sm tabular-nums">
              {percents[el]}%
            </span>
            {flag !== 'normal' && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{
                  background: 'var(--accent-wash)',
                  color: 'var(--accent-deep)',
                }}
              >
                {FLAG_LABEL[flag]}
              </span>
            )}
            {showMeaning && (
              <span className="hidden shrink-0 text-xs sm:block" style={{ color: 'var(--ink-soft)' }}>
                {ELEMENT_TEAM_MEANING[el]}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
