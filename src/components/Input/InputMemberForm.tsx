import { useRef, useState } from 'react'

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
  /**
   * 고쳐 쓸 사람의 초안. 없으면 새로 넣는 폼이다.
   *
   * 부르는 쪽이 `key` 로도 쓴다. 고를 사람을 바꾸면 폼이 통째로 다시 서서
   * `InputHourField` 가 들고 있는 지시/직접 입력 같은 안쪽 상태도 같이 선다.
   */
  editing: { id: string; draft: Draft } | null
  onCancelEdit: () => void
  /** 수정 중에 덮개 위로 올릴 때 쓴다 */
  className?: string
  /**
   * 추가나 수정이 됐다는 걸 알린다.
   *
   * 읽어주는 자리는 이 폼 밖이다. 고쳐서 저장하면 폼이 `key` 로 다시 서는데,
   * 여기 들고 있으면 그려지기도 전에 같이 사라진다.
   */
  onAnnounce: (text: string) => void
}


export function InputMemberForm({
  onSubmit,
  disabled,
  count,
  editing,
  onCancelEdit,
  className,
  onAnnounce,
}: Props) {
  const [draft, setDraft] = useState<Draft>(() => editing?.draft ?? emptyDraft())
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = draft.name.trim()
    const message = onSubmit(draft)
    setError(message)
    if (message) {
      return
    }

    if (editing) {
      // 고친 뒤에는 폼을 비우지 않는다. 스토어가 고치기를 접으면서 새 폼으로 선다
      onAnnounce(memberFormCopy.edited(name))
      return
    }

    const next = count + 1
    onAnnounce(
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
    <CommonCard
      as="form"
      onSubmit={handleSubmit}
      className={['flex flex-col gap-6', className].filter(Boolean).join(' ')}
    >
      <h2 className="text-base font-bold">
        {editing ? memberFormCopy.titleEdit : memberFormCopy.title}
      </h2>

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
        saved={editing !== null}
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

      {/* 주 동작은 하단 고정 바의 분석하기다. 폼 버튼은 한 단 내려 아웃라인으로 둔다 */}
      <CommonButton type="submit" variant="ghost" disabled={!editing && disabled}>
        {editing ? memberFormCopy.save : memberFormCopy.submit}
      </CommonButton>
      {editing && (
        <CommonButton type="button" variant="quiet" onClick={onCancelEdit}>
          {memberFormCopy.cancelEdit}
        </CommonButton>
      )}
    </CommonCard>
  )
}
