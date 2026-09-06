import { useRef, useState } from 'react'

import {
  CommonButton,
  CommonCard,
  CommonCheckLabel,
  CommonField,
  CommonFieldGroup,
  CommonSelect,
  CommonTextInput,
} from '../Common'
import { emptyDraft, type Draft } from '../../store/teamStore'

type Props = {
  onSubmit: (draft: Draft) => string | null
  disabled?: boolean
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function InputMemberForm({ onSubmit, disabled }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = onSubmit(draft)
    setError(message)
    if (message) return

    // 진태양시는 팀 전체에 같은 선택인 경우가 대부분이라 직전 값을 들고 간다.
    // 동의 출처는 절대 유지하지 않는다. 06-privacy.md 가 팀원마다 다시 고르게 정해뒀고,
    // 자동으로 채워두면 그 확인이 형식만 남는다.
    setDraft({ ...emptyDraft(), useTrueSolarTime: draft.useTrueSolarTime })
    nameRef.current?.focus()
  }

  return (
    <CommonCard as="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-base font-bold">팀원 추가</h2>

      <CommonField label="이름">
        {(id) => (
          <CommonTextInput
            ref={nameRef}
            id={id}
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            maxLength={12}
            placeholder="별칭도 괜찮아요"
          />
        )}
      </CommonField>

      <CommonField label="생년월일">
        {(id) => (
          <>
            <CommonTextInput
              id={id}
              type="date"
              value={draft.birthDate}
              min="1900-01-01"
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => set('birthDate', e.target.value)}
            />
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              <CommonCheckLabel
                type="radio"
                name="calendar"
                checked={draft.calendar === 'solar'}
                onChange={() => set('calendar', 'solar')}
              >
                양력
              </CommonCheckLabel>
              <CommonCheckLabel
                type="radio"
                name="calendar"
                checked={draft.calendar === 'lunar'}
                onChange={() => set('calendar', 'lunar')}
              >
                음력
              </CommonCheckLabel>
              {draft.calendar === 'lunar' && (
                <CommonCheckLabel
                  checked={draft.isLeapMonth}
                  onChange={(e) => set('isLeapMonth', e.target.checked)}
                >
                  윤달
                </CommonCheckLabel>
              )}
            </div>
          </>
        )}
      </CommonField>

      <CommonFieldGroup legend="태어난 시간">
        <CommonCheckLabel
          checked={!draft.hourKnown}
          onChange={(e) => set('hourKnown', !e.target.checked)}
        >
          시간을 몰라요
        </CommonCheckLabel>
        {draft.hourKnown && (
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="hour">
              시
            </label>
            <CommonSelect
              id="hour"
              value={draft.birthHour}
              onChange={(e) => set('birthHour', Number(e.target.value))}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}시
                </option>
              ))}
            </CommonSelect>
            <label className="sr-only" htmlFor="minute">
              분
            </label>
            <CommonSelect
              id="minute"
              value={draft.birthMinute}
              onChange={(e) => set('birthMinute', Number(e.target.value))}
            >
              {[0, 10, 20, 30, 40, 50].map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, '0')}분
                </option>
              ))}
            </CommonSelect>
          </div>
        )}
        {!draft.hourKnown && (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            시주를 빼고 세 기둥만 봅니다
          </p>
        )}
      </CommonFieldGroup>

      <CommonCheckLabel
        checked={draft.useTrueSolarTime}
        onChange={(e) => set('useTrueSolarTime', e.target.checked)}
      >
        진태양시 보정
        <span className="ml-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          시계가 태양보다 30분 빨라서 빼줍니다. 대부분 켜두면 됩니다
        </span>
      </CommonCheckLabel>

      <CommonFieldGroup legend="누구 정보인가요" boxed>
        <CommonCheckLabel
          type="radio"
          name="consent"
          checked={draft.consentSource === 'self'}
          onChange={() => set('consentSource', 'self')}
        >
          본인 정보입니다
        </CommonCheckLabel>
        <CommonCheckLabel
          type="radio"
          name="consent"
          checked={draft.consentSource === 'delegated'}
          onChange={() => set('consentSource', 'delegated')}
        >
          본인에게 동의를 받고 대신 입력합니다
        </CommonCheckLabel>
        {draft.consentSource === 'delegated' && (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            팀원에게 생년월일시를 넣는다고 알리고 동의를 받으셨나요. 동의 없이 타인의
            개인정보를 입력하면 곤란해질 수 있습니다
          </p>
        )}
      </CommonFieldGroup>

      {error && (
        <p
          className="rounded-lg px-3 py-2 text-sm"
          style={{ background: 'var(--accent-wash)', color: 'var(--cinnabar-deep)' }}
          role="alert"
        >
          {error}
        </p>
      )}

      <CommonButton type="submit" variant="primary" disabled={disabled}>
        팀원 추가
      </CommonButton>
    </CommonCard>
  )
}
