import { CommonCard, CommonChip } from '../Common'
import { memberListCopy } from '../../lib/copy'
import type { SajuChart } from '../../lib/saju/types'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR_DEEP } from '../../lib/ui/elementStyle'

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
            {/*
              일간의 오행이다. 오행 분포의 최다가 아니다.
              그 사람을 한 글자로 말하는 건 일간이라, 분포로 뽑으면 사주에서
              `辛 금` 인 사람 칩에 `火` 가 붙는다.

              한자만 두면 스크린리더가 못 읽는다. 한글 이름을 같이 단다.
              명식표가 쓰는 방식과 같다.
            */}
            <span
              className="serif text-sm font-bold"
              style={{ color: ELEMENT_COLOR_DEEP[c.dayMaster.element] }}
            >
              <span aria-hidden="true">{c.dayMaster.element}</span>
              <span className="sr-only">{ELEMENT_LABEL[c.dayMaster.element]}</span>
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
