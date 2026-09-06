import { useState } from 'react'

import { emptyDraft, type Draft } from '../store/teamStore'

type Props = {
  onSubmit: (draft: Draft) => string | null
  disabled?: boolean
}

const fieldStyle = {
  background: 'var(--paper-deep)',
  border: '1px solid var(--rule)',
  color: 'var(--ink)',
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function MemberForm({ onSubmit, disabled }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = onSubmit(draft)
    setError(message)
    if (!message) setDraft(emptyDraft())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
    >
      <h2 className="text-base font-bold">팀원 추가</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          이름
        </label>
        <input
          id="name"
          value={draft.name}
          onChange={(e) => set('name', e.target.value)}
          maxLength={12}
          placeholder="별칭도 괜찮아요"
          className="rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={fieldStyle}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="birthDate" className="text-sm font-medium">
          생년월일
        </label>
        <input
          id="birthDate"
          type="date"
          value={draft.birthDate}
          min="1900-01-01"
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => set('birthDate', e.target.value)}
          className="rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={fieldStyle}
        />
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
          <RadioPill
            name="calendar"
            checked={draft.calendar === 'solar'}
            onChange={() => set('calendar', 'solar')}
            label="양력"
          />
          <RadioPill
            name="calendar"
            checked={draft.calendar === 'lunar'}
            onChange={() => set('calendar', 'lunar')}
            label="음력"
          />
          {draft.calendar === 'lunar' && (
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={draft.isLeapMonth}
                onChange={(e) => set('isLeapMonth', e.target.checked)}
              />
              <span>윤달</span>
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">태어난 시간</span>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={!draft.hourKnown}
            onChange={(e) => set('hourKnown', !e.target.checked)}
          />
          <span>시간을 몰라요</span>
        </label>
        {draft.hourKnown && (
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="hour">
              시
            </label>
            <select
              id="hour"
              value={draft.birthHour}
              onChange={(e) => set('birthHour', Number(e.target.value))}
              className="rounded-lg px-3 py-2.5 text-sm"
              style={fieldStyle}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}시
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="minute">
              분
            </label>
            <select
              id="minute"
              value={draft.birthMinute}
              onChange={(e) => set('birthMinute', Number(e.target.value))}
              className="rounded-lg px-3 py-2.5 text-sm"
              style={fieldStyle}
            >
              {[0, 10, 20, 30, 40, 50].map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}분
                </option>
              ))}
            </select>
          </div>
        )}
        {!draft.hourKnown && (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            시주를 빼고 세 기둥만 봅니다
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">성별</span>
        <div className="flex gap-3 text-sm">
          <RadioPill
            name="gender"
            checked={draft.gender === 'male'}
            onChange={() => set('gender', 'male')}
            label="남"
          />
          <RadioPill
            name="gender"
            checked={draft.gender === 'female'}
            onChange={() => set('gender', 'female')}
            label="여"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.useTrueSolarTime}
          onChange={(e) => set('useTrueSolarTime', e.target.checked)}
          className="mt-0.5"
        />
        <span>
          진태양시 보정
          <span className="ml-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
            시계가 태양보다 30분 빨라서 빼줍니다. 대부분 켜두면 됩니다
          </span>
        </span>
      </label>

      <fieldset
        className="flex flex-col gap-2 rounded-xl p-3"
        style={{ background: 'var(--paper-deep)', border: '1px solid var(--rule)' }}
      >
        <legend className="px-1 text-sm font-medium">누구 정보인가요</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            name="consent"
            checked={draft.consentSource === 'self'}
            onChange={() => set('consentSource', 'self')}
          />
          <span>본인 정보입니다</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            name="consent"
            checked={draft.consentSource === 'delegated'}
            onChange={() => set('consentSource', 'delegated')}
          />
          <span>본인에게 동의를 받고 대신 입력합니다</span>
        </label>
        {draft.consentSource === 'delegated' && (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            팀원에게 생년월일시를 넣는다고 알리고 동의를 받으셨나요. 동의 없이 타인의
            개인정보를 입력하면 곤란해질 수 있습니다
          </p>
        )}
      </fieldset>

      {error && (
        <p
          className="rounded-lg px-3 py-2 text-sm"
          style={{ background: 'var(--cinnabar-wash)', color: 'var(--cinnabar)' }}
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        style={{ background: 'var(--cinnabar)' }}
      >
        팀원 추가
      </button>
    </form>
  )
}

function RadioPill({
  name,
  checked,
  onChange,
  label,
}: {
  name: string
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5">
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}
