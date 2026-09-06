import { CommonButton, CommonField, CommonTextInput } from '../components/Common'
import { InputMemberForm, InputMemberList, InputUndoToast } from '../components/Input'
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
      <CommonField label="팀 이름" hint="공유 이미지에 들어갑니다. 편한 이름으로 적어주세요">
        {(id) => (
          <CommonTextInput
            id={id}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            maxLength={20}
            placeholder="우리 팀"
          />
        )}
      </CommonField>

      <InputMemberList charts={charts} onRemove={removeMember} />
      <InputUndoToast />

      <InputMemberForm
        onSubmit={addMember}
        disabled={members.length >= MAX_MEMBERS}
        count={members.length}
        max={MAX_MEMBERS}
      />

      <CommonButton
        type="button"
        variant="primary"
        serif
        onClick={goResult}
        disabled={members.length < 1}
        className="sticky bottom-12"
      >
        {members.length < 1 ? '팀원을 1명 이상 넣어주세요' : `${members.length}명 분석하기`}
      </CommonButton>
    </div>
  )
}
