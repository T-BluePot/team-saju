import { useMemo, useState } from 'react'

import {
  PersonalView,
  ResultExampleNotice,
  ResultShareSheet,
  TeamReportView,
} from '../components/Result'
import { AppBottomBar } from '../components/Layout'
import { CommonButton } from '../components/Common'
import { buildTeamReport } from '../lib/report/teamReport'
import { isSolo } from '../lib/report/solo'
import { MAX_MEMBERS, useTeamStore } from '../store/teamStore'
import { headlineCopy, nextStepCopy, resultCopy } from '../lib/copy'

export function ResultPage() {
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const reset = useTeamStore((s) => s.reset)
  const isExample = useTeamStore((s) => s.isExample)
  // 예시에서 편집으로 나가면 표본이 사용자 팀이 되어버린다. 그 갈림은 스토어가 든다
  const onEdit = useTeamStore((s) => s.goEdit)
  // 해시에 personal 이 있으면 개인 탭으로 연다. 캡쳐할 때 클릭을 안 거쳐도 되고,
  // 나중에 링크로 특정 탭을 열 때도 이 자리를 쓴다
  const [tab, setTab] = useState<'team' | 'personal'>(() =>
    window.location.hash.includes('personal') ? 'personal' : 'team',
  )

  const report = useMemo(() => buildTeamReport(charts, teamName), [charts, teamName])

  if (charts.length === 0) return null

  const solo = isSolo(report.analysis)

  const tabs: Array<['team' | 'personal', string]> = [
    ['team', resultCopy.tabTeam],
    ['personal', resultCopy.tabPersonal],
  ]

  return (
    // 넘치는 기운이 그 팀의 성격이라 주도 오행으로 화면 색을 정한다
    <div className="flex flex-col gap-7" data-element={report.analysis.elements.dominant}>
      {/*
        탭 줄. 머리글 바로 아래에 붙어 선다. 결과가 길어서 아래까지 내려가면
        다른 탭이 있다는 걸 잊는다. 좌우로 흘려 화면 폭을 다 쓰고 밑줄 하나로 받는다
      */}
      <div
        className="sticky z-10 -mx-5 -mt-8 flex gap-6 px-5 pt-2"
        style={{
          top: 'var(--header-h)',
          background: 'var(--paper)',
          // 머리글 괘선이 61px 위에 이미 있다. 같은 굵기로 두면 두 줄이 겹쳐 보인다
          borderBottom: '1px solid var(--rule-faint)',
        }}
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            // 눌린 상태로만 알린다. role="tab" 은 tablist 와 tabpanel, 화살표 키
            // 이동까지 같이 서야 뜻이 생긴다. 롤만 얹으면 아무것도 안 얹은 것보다
            // 덜 알려준다. 바로 아래 팀원 전환 버튼도 aria-pressed 다
            aria-pressed={tab === key}
            className="press serif -mb-px py-3.5 text-base font-bold"
            style={{
              color: tab === key ? 'var(--ink)' : 'var(--ink-soft)',
              borderBottom: `2px solid ${tab === key ? 'var(--accent)' : 'transparent'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {isExample && <ResultExampleNotice onStart={reset} />}

      {/*
        팀 이름과 인원, 그리고 팀원 수정. 탭과 한 줄에 두면 탭이 둘인지
        셋인지가 안 갈린다. 개인 명식 쪽은 팀원 고르는 줄이 대신 선다
      */}
      {tab === 'team' && (
        <div className="flex items-center justify-between gap-4">
          <h2 className="serif flex min-w-0 items-center gap-2 text-xl font-bold tracking-tight">
            <span className="truncate">{report.analysis.teamName}</span>
            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-11 font-semibold tabular-nums"
              style={{ background: 'var(--paper-deep)', color: 'var(--ink-soft)' }}
            >
              {solo ? headlineCopy.solo : headlineCopy.size(report.analysis.size)}
            </span>
          </h2>
          <button
            type="button"
            onClick={onEdit}
            className="press min-h-9 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-sm"
            style={{ border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
          >
            {resultCopy.editMembers}
          </button>
        </div>
      )}

      {tab === 'team' ? (
        <TeamReportView report={report} />
      ) : (
        <PersonalView charts={charts} pairs={report.analysis.pairs} />
      )}

      {/*
        주 동작은 랜딩 · 입력과 같은 바에 앉힌다. 결과만 흐름 안에 두면 주 버튼이
        화면마다 다른 자리에 앉아서 어디를 눌러야 하는지를 매번 다시 배워야 한다.
        `팀원 수정` 은 위 머리줄에 이미 있어서 여기 또 두지 않는다.
      */}
      <AppBottomBar
        hint={
          charts.length >= MAX_MEMBERS
            ? nextStepCopy.full(MAX_MEMBERS)
            : nextStepCopy.more
        }
      >
        {/*
          시안의 두 칸 짜임. 공유가 주 동작이라 오른쪽 강조색이고 다시 시작은 옆에 선다.
          예시 리포트일 때는 공유를 안 그린다. 남의 표본 결과를 팀 채널에 던질 이유가 없다
        */}
        <div className="flex gap-2.5">
          <CommonButton type="button" variant="ghost" className="flex-1" onClick={reset}>
            {nextStepCopy.restart}
          </CommonButton>
          {!isExample && <ResultShareSheet report={report} />}
        </div>
      </AppBottomBar>
    </div>
  )
}
