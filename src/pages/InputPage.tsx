import { useEffect } from 'react'

import { CommonButton, CommonField, CommonTextInput } from '../components/Common'
import { InputMemberForm, InputMemberList, InputUndoToast } from '../components/Input'
import { AppBottomBar } from '../components/Layout'
import { inputCopy } from '../lib/copy'
import { MAX_MEMBERS, inputToDraft, useTeamStore } from '../store/teamStore'

export function InputPage() {
  const members = useTeamStore((s) => s.members)
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const setTeamName = useTeamStore((s) => s.setTeamName)
  const addMember = useTeamStore((s) => s.addMember)
  const removeMember = useTeamStore((s) => s.removeMember)
  const goResult = useTeamStore((s) => s.goResult)
  const editingId = useTeamStore((s) => s.editingId)
  const startEdit = useTeamStore((s) => s.startEdit)
  const cancelEdit = useTeamStore((s) => s.cancelEdit)
  const updateMember = useTeamStore((s) => s.updateMember)

  const target = members.find((m) => m.id === editingId)
  const editing = target ? { id: target.id, draft: inputToDraft(target) } : null

  // 덮개를 눌러 나갈 수 있으면 Esc 로도 나갈 수 있어야 한다
  useEffect(() => {
    if (!editingId) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelEdit()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [editingId, cancelEdit])

  return (
    <div className="flex flex-col gap-6">
      <CommonField
        label={inputCopy.teamNameLabel}
        description={inputCopy.teamNameHint}
      >
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

      {/*
        고치는 동안 나머지를 덮는다. 칩 줄과 폼만 덮개 위로 올린다. 고치는 중에
        팀 이름을 바꾸거나 다른 사람을 새로 넣으면 폼에 올라온 게 누구 것인지가
        흐려진다. 덮개를 누르면 고치기가 풀린다. 시안의 `.editscrim` / `.raised` 다.
      */}
      {editing && <div className="editscrim" aria-hidden="true" onPointerDown={cancelEdit} />}

      <div className={editing ? 'raised' : undefined}>
        <InputMemberList
          charts={charts}
          onRemove={removeMember}
          editingId={editingId}
          onEdit={startEdit}
        />
      </div>
      <InputUndoToast />

      {/*
        `key` 로 폼을 다시 세운다. 고를 사람을 바꿀 때마다 안쪽 상태까지 새로 서야
        한다. 안 그러면 앞 사람에게 열어둔 직접 입력이 다음 사람에게 남는다.
      */}
      <InputMemberForm
        key={editing?.id ?? 'new'}
        className={editing ? 'raised' : undefined}
        onSubmit={editing ? updateMember : addMember}
        disabled={members.length >= MAX_MEMBERS}
        count={members.length}
        editing={editing}
        onCancelEdit={cancelEdit}
      />

      {/*
        버튼 라벨로 사정을 설명하지 않는다. 라벨이 상태마다 바뀌면 누르는 것이
        뭔지가 흔들린다. 못 누르는 이유는 버튼 바로 위에서 말한다.
      */}
      <AppBottomBar hint={members.length < 1 ? inputCopy.submitHint : undefined}>
        <CommonButton
          type="button"
          variant="primary"
          serif
          onClick={goResult}
          disabled={members.length < 1}
        >
          {inputCopy.submit}
        </CommonButton>
      </AppBottomBar>
    </div>
  )
}
