import { useEffect, useRef, useState } from 'react'

import {
  CommonButton,
  CommonCard,
  CommonCheckLabel,
  CommonField,
  CommonFieldGroup,
  CommonPickCard,
  CommonTextInput,
} from '../Common'
import { InputHourField } from './InputHourField'
import { memberFormCopy } from '../../lib/copy'
import { MAX_MEMBERS, emptyDraft, type Draft } from '../../store/teamStore'

type Props = {
  onSubmit: (draft: Draft) => string | null
  disabled?: boolean
  /** 추가 성공을 알릴 때 쓴다. 지금 몇 명인지 같이 읽어준다 */
  count: number
}


/** 읽어준 뒤 문장을 비우는 시간 */
const ANNOUNCE_MS = 4000

export function InputMemberForm({ onSubmit, disabled, count }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  /**
   * 추가가 됐다는 걸 스크린리더에 알린다.
   * 실패는 role="alert" 로 읽히는데 성공은 신호가 포커스 이동뿐이었다.
   * 그러면 "이름, 편집 텍스트" 만 들려서 추가된 건지 실패해서 다시 치라는 건지 구분이 안 된다.
   *
   * 읽어준 뒤에는 비운다. 안 비우면 두 가지가 걸린다.
   * 문장이 직전과 똑같으면 React 가 텍스트 노드를 안 건드려서 aria-live 가 안 읽는다.
   * 지우고 같은 이름을 다시 넣는 흐름에서 두 번째가 무음이 된다.
   * 그리고 팀원을 지우면 인원수는 줄었는데 여기 낡은 숫자가 그대로 남는다.
   */
  const [added, setAdded] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!added) return
    const t = window.setTimeout(() => setAdded(''), ANNOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [added])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = draft.name.trim()
    const message = onSubmit(draft)
    setError(message)
    if (message) {
      setAdded('')
      return
    }

    const next = count + 1
    setAdded(
      next >= MAX_MEMBERS
        ? memberFormCopy.addedFull(name, next)
        : memberFormCopy.added(name, next),
    )

    // 진태양시는 팀 전체에 같은 선택인 경우가 대부분이라 직전 값을 들고 간다.
    // 동의 출처는 절대 유지하지 않는다. 06-privacy.md 가 팀원마다 다시 고르게 정해뒀고,
    // 자동으로 채워두면 그 확인이 형식만 남는다.
    setDraft({ ...emptyDraft(), useTrueSolarTime: draft.useTrueSolarTime })
    nameRef.current?.focus()
  }

  return (
    <CommonCard as="form" onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-base font-bold">{memberFormCopy.title}</h2>

      <CommonField label={memberFormCopy.nameLabel}>
        {(id) => (
          <CommonTextInput
            ref={nameRef}
            id={id}
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            maxLength={12}
            placeholder={memberFormCopy.namePlaceholder}
          />
        )}
      </CommonField>

      <CommonField label={memberFormCopy.birthDateLabel}>
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
                {memberFormCopy.solar}
              </CommonCheckLabel>
              <CommonCheckLabel
                type="radio"
                name="calendar"
                checked={draft.calendar === 'lunar'}
                onChange={() => set('calendar', 'lunar')}
              >
                {memberFormCopy.lunar}
              </CommonCheckLabel>
              {draft.calendar === 'lunar' && (
                <CommonCheckLabel
                  checked={draft.isLeapMonth}
                  onChange={(e) => set('isLeapMonth', e.target.checked)}
                >
                  {memberFormCopy.leapMonth}
                </CommonCheckLabel>
              )}
            </div>
          </>
        )}
      </CommonField>

      <InputHourField
        hour={draft.birthHour}
        minute={draft.birthMinute}
        known={draft.hourKnown}
        onChange={(hour, minute) => setDraft((d) => ({ ...d, birthHour: hour, birthMinute: minute }))}
      />

      {/*
        시간에 걸리는 선택 둘을 한 박스로 묶는다. 떨어뜨려 두면 진태양시가
        태어난 시간과 무관한 별개 설정처럼 읽힌다. 설명은 라벨 옆이 아니라
        아래 줄로 내린다. 옆에 붙이면 한 줄이 길어져 라벨이 안 보인다.
      */}
      <div
        className="flex flex-col gap-3 rounded-xl px-4 py-3.5"
        style={{ background: 'var(--paper-deep)', border: '1px solid var(--rule)' }}
      >
        <CommonCheckLabel
          className="items-start"
          checked={!draft.hourKnown}
          onChange={(e) => set('hourKnown', !e.target.checked)}
        >
          {memberFormCopy.hourUnknown}
        </CommonCheckLabel>
        <CommonCheckLabel
          className="items-start"
          checked={draft.useTrueSolarTime}
          onChange={(e) => set('useTrueSolarTime', e.target.checked)}
        >
          {memberFormCopy.trueSolarTime}
          <span
            className="mt-0.5 block text-xs leading-relaxed"
            style={{ color: 'var(--ink-soft)' }}
          >
            {memberFormCopy.trueSolarTimeNote}
          </span>
        </CommonCheckLabel>
      </div>

      <CommonFieldGroup label={memberFormCopy.sourceGroup}>
        <CommonPickCard
          name="consent"
          checked={draft.consentSource === 'self'}
          onChange={() => set('consentSource', 'self')}
          title={memberFormCopy.sourceSelfTitle}
          desc={memberFormCopy.sourceSelfDesc}
        />
        <CommonPickCard
          name="consent"
          checked={draft.consentSource === 'delegated'}
          onChange={() => set('consentSource', 'delegated')}
          title={memberFormCopy.sourceDelegatedTitle}
          desc={memberFormCopy.sourceDelegatedDesc}
        />
        {draft.consentSource === 'delegated' && (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {memberFormCopy.delegatedWarning}
          </p>
        )}
      </CommonFieldGroup>

      {error && (
        <p
          className="rounded-lg px-3 py-2 text-sm"
          style={{ background: 'var(--accent-wash)', color: 'var(--accent-deep)' }}
          role="alert"
        >
          {error}
        </p>
      )}

      {/*
        추가된 건 팀원 칩으로 이미 보인다. 눈으로 보는 사람에게는 중복이라
        화면에서 감추고 스크린리더만 읽게 둔다.
        리전은 내용보다 먼저 트리에 있어야 안정적으로 읽히니 항상 렌더한다.
      */}
      <p role="status" className="sr-only">
        {added}
      </p>

      {/* 주 동작은 하단 고정 바의 분석하기다. 폼 버튼은 한 단 내려 아웃라인으로 둔다 */}
      <CommonButton type="submit" variant="ghost" disabled={disabled}>
        {memberFormCopy.submit}
      </CommonButton>
    </CommonCard>
  )
}
