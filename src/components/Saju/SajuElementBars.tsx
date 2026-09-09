import { ELEMENTS, ELEMENT_LABEL, ELEMENT_TEAM_MEANING } from '../../lib/saju/constants'
import { useReveal } from '../../lib/ui/useReveal'
import type { ElementScores } from '../../lib/saju/types'
import { ELEMENT_COLOR, FLAG_LABEL } from '../../lib/ui/elementStyle'

type Props = {
  percents: ElementScores
  flags?: Record<string, keyof typeof FLAG_LABEL>
  showMeaning?: boolean
}

export function SajuElementBars({ percents, flags, showMeaning = false }: Props) {
  const { ref, shown } = useReveal<HTMLUListElement>()

  return (
    <ul ref={ref} className="flex flex-col gap-2.5">
      {ELEMENTS.map((el, i) => {
        const flag = flags?.[el] ?? 'normal'
        const marked = flag !== 'normal'
        return (
          <li
            key={el}
            className="flex items-center gap-3 rounded-lg px-2 py-1"
            style={
              // 칩을 붙이는 대신 행 전체를 그 오행 색으로 옅게 깐다.
              // 칩은 줄 끝에 하나 더 붙는 요소라 다섯 줄이 다 시끄러워진다
              marked
                ? { background: `color-mix(in srgb, ${ELEMENT_COLOR[el]} 11%, var(--surface))` }
                : undefined
            }
          >
            <span
              className="w-6 shrink-0 text-sm font-semibold"
              style={{ color: ELEMENT_COLOR[el] }}
            >
              <span aria-hidden="true">{el}</span>
              {/* 한자만 두면 화면은 깔끔한데 읽어주는 쪽이 잃는다 */}
              <span className="sr-only">{ELEMENT_LABEL[el]}</span>
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
            <span
              className={[
                'w-9 shrink-0 text-right text-xs tabular-nums',
                marked ? 'font-bold' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={marked ? { color: 'var(--ink)' } : undefined}
            >
              {percents[el]}%
            </span>
            {/* 색만으로 상태를 말하면 색을 못 보는 쪽에는 아무것도 안 남는다 */}
            {marked && <span className="sr-only">{FLAG_LABEL[flag]}</span>}
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
