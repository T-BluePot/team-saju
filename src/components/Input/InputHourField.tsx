import { useState } from 'react'

import { CommonFieldGroup, CommonNumberPick, CommonSegmented, CommonSelect } from '../Common'
import { memberFormCopy } from '../../lib/copy'
import { HOUR_BRANCHES, hourBranchAt } from '../../lib/saju/constants'

const HOURS = Array.from({ length: 24 }, (_, h) => h)
/** 목록에 띄울 분. 여기 없는 값도 써넣을 수 있다 */
const MINUTES = [0, 10, 20, 30, 40, 50]

type Mode = 'branch' | 'clock'

const MODES: Array<[Mode, string]> = [
  ['branch', memberFormCopy.hourModeBranch],
  ['clock', memberFormCopy.hourModeClock],
]

function optionText(index: number): string {
  const b = HOUR_BRANCHES[index]
  return memberFormCopy.hourBranchOption(
    b.name,
    memberFormCopy.hourRange(
      memberFormCopy.clockAt(b.from[0], b.from[1]),
      memberFormCopy.clockAt(b.to[0], b.to[1]),
    ),
  )
}

/**
 * 태어난 시간.
 *
 * 두 가지로 받는다. 기본은 십이지시고, 시각을 아는 사람은 직접 넣는다.
 * 어느 쪽으로 넣든 저장하는 건 시와 분 하나뿐이다. 계산은 그것만 본다.
 *
 * 지시를 고르면 그 칸 **한가운데**의 시각이 들어간다. 경계값을 넣으면
 * 진태양시 보정을 껐을 때 옆 칸으로 넘어간다. 표의 `at` 이 그 값이다.
 */
export function InputHourField({
  hour,
  minute,
  known,
  onChange,
}: {
  hour: number
  minute: number
  known: boolean
  onChange: (hour: number, minute: number) => void
}) {
  const [mode, setMode] = useState<Mode>('branch')

  // 고른 칸은 들고 있지 않고 시각에서 되찾는다. 두 벌로 들면 어긋난다
  const picked = HOUR_BRANCHES.indexOf(hourBranchAt(hour, minute) ?? HOUR_BRANCHES[0])

  return (
    <CommonFieldGroup label={memberFormCopy.hourGroup}>
      {!known && (
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          {memberFormCopy.hourUnknownNote}
        </p>
      )}

      {known && (
        <div className="flex flex-col gap-3">
          <CommonSegmented
            label={memberFormCopy.hourModeGroup}
            value={mode}
            options={MODES}
            onChange={setMode}
          />

          {mode === 'branch' ? (
            <>
              <label className="sr-only" htmlFor="hour-branch">
                {memberFormCopy.hourBranchLabel}
              </label>
              <CommonSelect
                id="hour-branch"
                value={picked}
                onChange={(e) => {
                  const b = HOUR_BRANCHES[Number(e.target.value)]
                  onChange(b.at[0], b.at[1])
                }}
              >
                {HOUR_BRANCHES.map((b, n) => (
                  <option key={b.name} value={n}>
                    {optionText(n)}
                  </option>
                ))}
              </CommonSelect>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {memberFormCopy.hourBranchMidnightNote}
              </p>
            </>
          ) : (
            /*
              시와 분이 같은 물건이라 같은 칸을 쓴다. 둘 다 목록에서 고르거나
              그냥 써넣는다. 한쪽만 고르기로 두면 나란히 선 두 칸이 다르게 돈다.
            */
            <div className="flex items-center gap-3">
              <CommonNumberPick
                label={memberFormCopy.hourLabel}
                suffix={memberFormCopy.hourLabel}
                value={hour}
                min={0}
                max={23}
                options={HOURS}
                onChange={(next) => onChange(next, minute)}
              />
              <CommonNumberPick
                label={memberFormCopy.minuteLabel}
                suffix={memberFormCopy.minuteLabel}
                value={minute}
                min={0}
                max={59}
                options={MINUTES}
                onChange={(next) => onChange(hour, next)}
              />
            </div>
          )}
        </div>
      )}
    </CommonFieldGroup>
  )
}
