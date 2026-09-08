import { CommonCard, CommonChip } from '../Common'
import { memberListCopy } from '../../lib/copy'
import type { SajuChart } from '../../lib/saju/types'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

type Props = {
  charts: SajuChart[]
  onRemove: (id: string) => void
}

/** 입력 화면에서 지금까지 넣은 팀원을 칩으로 보여준다 */
export function InputMemberList({ charts, onRemove }: Props) {
  if (charts.length === 0) return null

  return (
    <div>
      <p className="serif mb-2.5 text-sm font-bold">
        {memberListCopy.count(charts.length)}
      </p>
      <ul className="flex flex-wrap gap-2">
        {charts.map((c) => (
          <CommonCard
            key={c.member.id}
            as="li"
            flush
            radius="rounded-full"
            className="flex items-center gap-2 py-1 pl-3.5 pr-1"
          >
            <span className="text-sm font-medium">{c.member.name}</span>
            <span
              className="serif text-sm font-bold"
              style={{ color: ELEMENT_COLOR[c.elements.dominant] }}
            >
              {c.elements.dominant}
            </span>
            {c.member.consent.source === 'delegated' && (
              <CommonChip tone="accent" size="sm">
                {memberListCopy.delegated}
              </CommonChip>
            )}
            <button
              type="button"
              onClick={() => onRemove(c.member.id)}
              aria-label={memberListCopy.remove(c.member.name)}
              className="press flex size-8 items-center justify-center rounded-full text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: 'var(--paper-deep)',
                color: 'var(--ink-soft)',
                outlineColor: 'var(--accent)',
              }}
            >
              ×
            </button>
          </CommonCard>
        ))}
      </ul>
    </div>
  )
}
