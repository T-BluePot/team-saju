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
            {/*
              이름과 한자를 한 덩어리로 묶어 밑선을 맞춘다. 명조와 고딕은 같은
              크기여도 밑선이 다르게 앉아서, 카드에 `items-center` 로 두면 한자가
              반 칸쯤 떠 보인다. 지우기 단추는 밑선이 아니라 가운데를 맞춰야 하니
              바깥 줄은 `items-center` 로 두고 여기만 따로 묶는다.
            */}
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-medium">{c.member.name}</span>
              {/*
                일간의 오행이다. 오행 분포의 최다가 아니다.
                그 사람을 한 글자로 말하는 건 일간이라, 분포로 뽑으면 사주에서
                `辛 금` 인 사람 칩에 `火` 가 붙는다.

                한자만 두면 스크린리더가 못 읽는다. 한글 이름을 같이 단다.
                명식표가 쓰는 방식과 같다.
              */}
              <span
                className="serif text-sm font-bold leading-none"
                style={{ color: ELEMENT_COLOR_DEEP[c.dayMaster.element] }}
              >
                <span aria-hidden="true">{c.dayMaster.element}</span>
                <span className="sr-only">{ELEMENT_LABEL[c.dayMaster.element]}</span>
              </span>
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
