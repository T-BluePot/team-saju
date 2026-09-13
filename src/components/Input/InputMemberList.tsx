import { CommonCard, CommonChip } from '../Common'
import { memberListCopy } from '../../lib/copy'
import type { SajuChart } from '../../lib/saju/types'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR_DEEP } from '../../lib/ui/elementStyle'

type Props = {
  charts: SajuChart[]
  onRemove: (id: string) => void
  /** 지금 고쳐 쓰는 사람 */
  editingId: string | null
  onEdit: (id: string) => void
}

/** 입력 화면에서 지금까지 넣은 팀원을 칩으로 보여준다 */
export function InputMemberList({ charts, onRemove, editingId, onEdit }: Props) {
  if (charts.length === 0) return null

  return (
    <div>
      <p className="serif mb-2.5 text-sm font-bold">
        {memberListCopy.count(charts.length)}
      </p>
      <ul className="flex flex-wrap gap-2">
        {charts.map((c) => {
          const editing = editingId === c.member.id
          /*
            고르는 중에는 고른 것만 남기고 나머지를 물러나게 한다. 폼에 올라온 게
            누구인지가 칩 줄에서 바로 보여야, 고치는 중인 걸 잊고 새로 넣지 않는다.

            `style` 로 `borderColor` 를 같이 넘기면 안 된다. 고르는 중이 아닐 때
            undefined 가 들어가면서 카드가 깔아둔 `1px solid var(--rule)` 의 색만
            지워지고 `currentColor`, 곧 먹색으로 떨어진다. 칩마다 검은 테가 둘린다.
          */
          return (
            <CommonCard
              key={c.member.id}
              as="li"
              flush
              radius="rounded-full"
              className="flex items-center gap-2 p-1 transition-opacity"
              style={{ opacity: editingId !== null && !editing ? 0.35 : 1 }}
            >
              {/*
                이름을 누르면 그 사람이 폼으로 올라온다. 고칠 대상을 고르는 자리가
                곧 목록이라 칩에 단다. 폼 안에 목록을 또 두면 같은 사람이 두 군데 선다.
              */}
              <button
                type="button"
                onClick={() => onEdit(c.member.id)}
                aria-pressed={editing}
                className="press rounded-full py-1 pl-2.5 pr-1 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: 'var(--accent)' }}
              >
                {/*
                  이름과 한자를 한 덩어리로 묶어 밑선을 맞춘다. 명조와 고딕은 같은
                  크기여도 밑선이 다르게 앉아서 `items-center` 로 두면 한자가 반 칸쯤
                  떠 보인다. 지우기 단추는 가운데를 맞춰야 하니 바깥 줄은 그대로 둔다.

                  한자는 일간의 오행이다. 오행 분포의 최다가 아니다. 그 사람을 한
                  글자로 말하는 건 일간이라, 분포로 뽑으면 명식에서 `辛 금` 인 사람
                  칩에 `火` 가 붙는다. 한자만 두면 안 읽히니 한글 이름을 같이 단다.
                */}
                <span className="flex items-baseline gap-1.5">
                  <span className="text-sm font-medium">{c.member.name}</span>
                  <span
                    className="serif text-sm font-bold leading-none"
                    style={{ color: ELEMENT_COLOR_DEEP[c.dayMaster.element] }}
                  >
                    <span aria-hidden="true">{c.dayMaster.element}</span>
                    <span className="sr-only">{ELEMENT_LABEL[c.dayMaster.element]}</span>
                  </span>
                </span>
              </button>
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
          )
        })}
      </ul>
    </div>
  )
}
