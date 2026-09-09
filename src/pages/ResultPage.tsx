import { useMemo, useState } from 'react'

import {
  PersonalView,
  ResultExampleNotice,
  TeamNextStep,
  TeamReportView,
} from '../components/Result'
import { buildTeamReport } from '../lib/report/teamReport'
import { isSolo } from '../lib/report/solo'
import { useTeamStore } from '../store/teamStore'
import { headlineCopy, resultCopy } from '../lib/copy'

export function ResultPage() {
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const goBack = useTeamStore((s) => s.goBack)
  const reset = useTeamStore((s) => s.reset)
  const isExample = useTeamStore((s) => s.isExample)
  // 예시에서 편집으로 나가면 표본이 사용자 팀이 되어버린다. 예시일 때는 비우고 시작한다
  const onEdit = isExample ? reset : goBack
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
          borderBottom: '1px solid var(--rule)',
        }}
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-selected={tab === key}
            role="tab"
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

      <TeamNextStep count={charts.length} onEdit={onEdit} onRestart={reset} />
    </div>
  )
}
