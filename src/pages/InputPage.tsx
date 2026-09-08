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

      <CommonButton
        type="button"
        variant="primary"
        serif
        onClick={goResult}
        disabled={members.length < 1}
        className="sticky bottom-12"
      >
        {members.length < 1 ? inputCopy.submitEmpty : inputCopy.submit(members.length)}
      </CommonButton>
    </div>
  )
}
