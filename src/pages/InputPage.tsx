import { useEffect, useState } from 'react'

import { CommonButton, CommonField, CommonTextInput } from '../components/Common'
import { InputMemberForm, InputMemberList, InputUndoToast } from '../components/Input'
import { AppBottomBar } from '../components/Layout'
import { inputCopy } from '../lib/copy'

/** 읽어준 뒤 문장을 비우는 시간 */
const ANNOUNCE_MS = 4000
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

  /**
   * 추가나 수정이 됐다는 걸 스크린리더에 알린다.
   *
   * **폼 안에 두면 안 된다.** 고쳐서 저장하는 순간 `editingId` 가 풀리면서 폼이
   * `key` 로 다시 서는데, 그러면 방금 세운 안내가 그려지기도 전에 같이 사라진다.
   * 추가할 때는 읽히고 수정할 때만 무음이었다. 살아남는 자리에 둔다.
   */
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    if (!announce) return
    const t = window.setTimeout(() => setAnnounce(''), ANNOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [announce])

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
      {/*
        덮개는 마우스만 막는다. Tab 은 그대로 들어와서 고치는 중에 팀 이름을
        바꿔버릴 수 있었다. 덮개 밑은 초점도 못 받게 `inert` 를 같이 건다.
      */}
      <CommonField
        label={inputCopy.teamNameLabel}
        description={inputCopy.teamNameHint}
        inert={editing !== null}
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

      <InputMemberList
        charts={charts}
        onRemove={removeMember}
        editingId={editingId}
        onEdit={startEdit}
      />
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
        onAnnounce={setAnnounce}
      />

      {/*
        리전은 내용보다 먼저 접근성 트리에 있어야 안정적으로 읽힌다.
        리전과 내용을 같이 붙이면 일부 스크린리더가 놓친다.
      */}
      <p role="status" className="sr-only">
        {announce}
      </p>

      {/*
        버튼 라벨로 사정을 설명하지 않는다. 라벨이 상태마다 바뀌면 누르는 것이
        뭔지가 흔들린다. 못 누르는 이유는 버튼 바로 위에서 말한다.
      */}
      <AppBottomBar
        hint={members.length < 1 ? inputCopy.submitHint : undefined}
        inert={editing !== null}
      >
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
