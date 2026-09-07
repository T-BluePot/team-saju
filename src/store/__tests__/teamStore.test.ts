import { beforeEach, describe, expect, it } from 'vitest'

import { MAX_MEMBERS, emptyDraft, useTeamStore, type Draft } from '../teamStore'

function draft(name: string, birthDate: string): Draft {
  return { ...emptyDraft(), name, birthDate, consentSource: 'self' }
}

const names = () => useTeamStore.getState().members.map((m) => m.name)

function add(name: string, birthDate = '1990-06-15') {
  const error = useTeamStore.getState().addMember(draft(name, birthDate))
  expect(error).toBeNull()
}

describe('teamStore 삭제와 되돌리기', () => {
  beforeEach(() => {
    useTeamStore.getState().reset()
    useTeamStore.getState().setConsent(true)
  })

  it('members 와 charts 가 같은 순서로 쌓인다', () => {
    add('가')
    add('나', '1988-06-20')
    add('다', '1995-07-01')
    const { members, charts } = useTeamStore.getState()
    expect(members.map((m) => m.id)).toEqual(charts.map((c) => c.member.id))
  })

  it('가운데를 지우고 되돌리면 원래 자리로 돌아온다', () => {
    add('가')
    add('나', '1988-06-20')
    add('다', '1995-07-01')
    const 나 = useTeamStore.getState().members[1]

    useTeamStore.getState().removeMember(나.id)
    expect(names()).toEqual(['가', '다'])
    expect(useTeamStore.getState().removed?.index).toBe(1)

    useTeamStore.getState().undoRemove()
    expect(names()).toEqual(['가', '나', '다'])

    // charts 도 같이 돌아와야 한다. 하나만 되돌리면 화면이 어긋난다
    const { members, charts } = useTeamStore.getState()
    expect(members.map((m) => m.id)).toEqual(charts.map((c) => c.member.id))
    expect(useTeamStore.getState().removed).toBeNull()
  })

  it('맨 끝을 지우고 되돌려도 자리가 유지된다', () => {
    add('가')
    add('나', '1988-06-20')
    const 나 = useTeamStore.getState().members[1]

    useTeamStore.getState().removeMember(나.id)
    useTeamStore.getState().undoRemove()
    expect(names()).toEqual(['가', '나'])
  })

  it('연달아 지우면 마지막 하나만 되돌린다', () => {
    add('가')
    add('나', '1988-06-20')
    const [가, 나] = useTeamStore.getState().members

    useTeamStore.getState().removeMember(가.id)
    useTeamStore.getState().removeMember(나.id)
    expect(names()).toEqual([])

    useTeamStore.getState().undoRemove()
    // 1단계 되돌리기다. 가는 안 돌아온다
    expect(names()).toEqual(['나'])
    expect(useTeamStore.getState().removed).toBeNull()
  })

  it('새로 넣으면 되돌리기가 무효가 된다', () => {
    add('가')
    const 가 = useTeamStore.getState().members[0]
    useTeamStore.getState().removeMember(가.id)
    expect(useTeamStore.getState().removed).not.toBeNull()

    add('나', '1988-06-20')
    expect(useTeamStore.getState().removed).toBeNull()

    // 되돌리기를 눌러도 아무 일이 없어야 한다
    useTeamStore.getState().undoRemove()
    expect(names()).toEqual(['나'])
  })

  it('되돌리기로 상한을 넘길 수 없다', () => {
    for (let i = 0; i < MAX_MEMBERS; i++) add(`팀원${i}`)
    expect(names()).toHaveLength(MAX_MEMBERS)

    const first = useTeamStore.getState().members[0]
    useTeamStore.getState().removeMember(first.id)
    add('새사람', '1988-06-20')
    // 새로 넣었으니 removed 가 비었고, 되돌려도 8명을 안 넘는다
    useTeamStore.getState().undoRemove()
    expect(names()).toHaveLength(MAX_MEMBERS)
  })

  it('화면을 뜨면 되돌리기 창이 닫힌다', () => {
    add('가')
    add('나', '1988-06-20')
    const 가 = useTeamStore.getState().members[0]

    useTeamStore.getState().removeMember(가.id)
    useTeamStore.getState().goResult()
    // 결과를 다 본 뒤 돌아왔을 때 잊은 삭제를 다시 알리면 안 된다
    expect(useTeamStore.getState().removed).toBeNull()
  })

  it('없는 id 를 지우면 아무 일도 안 일어난다', () => {
    add('가')
    useTeamStore.getState().removeMember('없는-id')
    expect(names()).toEqual(['가'])
    expect(useTeamStore.getState().removed).toBeNull()
  })
})

/**
 * 이 PR 이전에는 App.tsx 가 전역 모달로 입력 화면을 가로막았다.
 * 그 안전망을 걷고 entryView 한 곳으로 옮겼으니, 렌더 조건이 하던 일을
 * 여기가 대신한다. 누가 reset 을 set({ view: 'input' }) 으로 되돌려도
 * 화면 테스트가 없어서 아무도 못 잡는다.
 */
describe('동의 없이 입력 화면에 서지 않는다', () => {
  beforeEach(() => {
    useTeamStore.getState().reset()
    useTeamStore.getState().setConsent(false)
  })

  it.each(['goInput', 'goBack', 'reset'] as const)('%s 는 랜딩으로 보낸다', (fn) => {
    useTeamStore.getState()[fn]()
    expect(useTeamStore.getState().view).toBe('landing')
  })

  it.each(['goInput', 'goBack', 'reset'] as const)(
    '동의했으면 %s 가 입력으로 보낸다',
    (fn) => {
      useTeamStore.getState().setConsent(true)
      useTeamStore.getState()[fn]()
      expect(useTeamStore.getState().view).toBe('input')
    },
  )

  it('예시를 보다가 내 팀으로 넘어가려 하면 랜딩으로 돌아온다', () => {
    // 예시는 동의 없이 보는 화면이라 여기가 유일하게 새던 자리였다.
    // 배너의 "내 팀으로 해보기" 가 reset 을 부른다
    useTeamStore.getState().showExample()
    expect(useTeamStore.getState().view).toBe('result')
    expect(useTeamStore.getState().isExample).toBe(true)

    useTeamStore.getState().reset()
    expect(useTeamStore.getState().view).toBe('landing')
    expect(useTeamStore.getState().members).toHaveLength(0)
  })

  it('예시를 보는 동안에도 동의는 꺼진 채다', () => {
    useTeamStore.getState().showExample()
    expect(useTeamStore.getState().consented).toBe(false)
  })
})
