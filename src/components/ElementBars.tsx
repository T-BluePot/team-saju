import { ELEMENTS, ELEMENT_LABEL, ELEMENT_TEAM_MEANING } from '../lib/saju/constants'
import type { ElementFlag, ElementScores } from '../lib/saju/types'
import { ELEMENT_COLOR } from '../lib/ui/elementStyle'

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

export function ElementBars({ percents, flags, showMeaning = false }: Props) {
  return (
    <ul className="flex flex-col gap-2.5">
      {ELEMENTS.map((el) => {
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
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${Math.min(percents[el] * 2, 100)}%`,
                  background: ELEMENT_COLOR[el],
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
                  background: 'var(--cinnabar-wash)',
                  color: 'var(--cinnabar)',
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
