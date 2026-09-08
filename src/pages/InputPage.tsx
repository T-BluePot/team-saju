import { CommonButton, CommonField, CommonTextInput } from '../components/Common'
import { InputMemberForm, InputMemberList, InputUndoToast } from '../components/Input'
import { inputCopy } from '../lib/copy'
import { MAX_MEMBERS, useTeamStore } from '../store/teamStore'

export function InputPage() {
  const members = useTeamStore((s) => s.members)
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const setTeamName = useTeamStore((s) => s.setTeamName)
  const addMember = useTeamStore((s) => s.addMember)
  const removeMember = useTeamStore((s) => s.removeMember)
  const goResult = useTeamStore((s) => s.goResult)

  return (
    <div className="flex flex-col gap-6">
      <CommonField label={inputCopy.teamNameLabel} hint={inputCopy.teamNameHint}>
        {(id) => (
          <CommonTextInput
            id={id}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            maxLength={20}
            placeholder={inputCopy.teamNamePlaceholder}
          />
        )}
      </CommonField>

      <InputMemberList charts={charts} onRemove={removeMember} />
      <InputUndoToast />

      <InputMemberForm
        onSubmit={addMember}
        disabled={members.length >= MAX_MEMBERS}
        count={members.length}
      />

      {/*
        버튼 라벨로 사정을 설명하지 않는다. 라벨이 상태마다 바뀌면 누르는 것이
        뭔지가 흔들린다. 못 누르는 이유는 버튼 바로 위에서 말한다.
      */}
      <div className="sticky bottom-12 flex flex-col gap-2">
        {members.length < 1 && (
          <p className="text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
            {inputCopy.submitHint}
          </p>
        )}
        <CommonButton
          type="button"
          variant="primary"
          serif
          onClick={goResult}
          disabled={members.length < 1}
        >
          {inputCopy.submit}
        </CommonButton>
      </div>
    </div>
  )
}
