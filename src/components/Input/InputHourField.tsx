import { useState } from 'react'

import { CommonFieldGroup, CommonSegmented, CommonSelect, CommonTextInput } from '../Common'
import { memberFormCopy } from '../../lib/copy'
import { BRANCH_ANIMAL, HOUR_BRANCHES, hourBranchAt } from '../../lib/saju/constants'

const HOURS = Array.from({ length: 24 }, (_, h) => h)

type Mode = 'branch' | 'clock'

const MODES: Array<[Mode, string]> = [
  ['branch', memberFormCopy.hourModeBranch],
  ['clock', memberFormCopy.hourModeClock],
]

function optionText(index: number): string {
  const b = HOUR_BRANCHES[index]
  return memberFormCopy.hourBranchOption(
    memberFormCopy.hourBranchName(b.name, b.sect),
    memberFormCopy.hourRange(
      memberFormCopy.clockAt(b.from[0], b.from[1]),
      memberFormCopy.clockAt(b.to[0], b.to[1]),
    ),
    BRANCH_ANIMAL[b.branch],
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
                  <option key={`${b.branch}${b.sect ?? ''}`} value={n}>
                    {optionText(n)}
                  </option>
                ))}
              </CommonSelect>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {memberFormCopy.hourBranchMidnightNote}
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="hour">
                {memberFormCopy.hourLabel}
              </label>
              <CommonSelect
                id="hour"
                value={hour}
                onChange={(e) => onChange(Number(e.target.value), minute)}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {memberFormCopy.hourOption(String(h).padStart(2, '0'))}
                  </option>
                ))}
              </CommonSelect>

              {/*
                분은 고르는 게 아니라 넣는다. 10분 단위 목록으로는 7분에
                태어난 사람이 제 시각을 못 넣는다.
              */}
              <label className="sr-only" htmlFor="minute">
                {memberFormCopy.minuteLabel}
              </label>
              <div className="flex items-center gap-1.5">
                <CommonTextInput
                  id="minute"
                  type="number"
                  min={0}
                  max={59}
                  inputMode="numeric"
                  className="w-20 text-center"
                  value={minute}
                  onChange={(e) => {
                    // 빈 칸은 0 으로 본다. NaN 이 들어가면 계산이 통째로 깨진다
                    const next = Number(e.target.value)
                    if (Number.isNaN(next)) return
                    onChange(hour, Math.min(Math.max(Math.trunc(next), 0), 59))
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                  {memberFormCopy.minuteLabel}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </CommonFieldGroup>
  )
}
