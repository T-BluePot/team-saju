import { useMemo, useState } from 'react'

import { PersonalView, TeamReportView } from '../components/Result'
import { buildTeamReport } from '../lib/report/teamReport'
import { useTeamStore } from '../store/teamStore'

export function ResultPage() {
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const goBack = useTeamStore((s) => s.goBack)
  const [tab, setTab] = useState<'team' | 'personal'>('team')

  const report = useMemo(() => buildTeamReport(charts, teamName), [charts, teamName])

  if (charts.length === 0) return null

  const tabs: Array<['team' | 'personal', string]> = [
    ['team', '팀 리포트'],
    ['personal', '개인 명식'],
  ]

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-5">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className="serif pb-1.5 text-base font-bold"
              style={{
                color: tab === key ? 'var(--ink)' : 'var(--ink-soft)',
                borderBottom:
                  tab === key ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={goBack}
          className="rounded-lg px-3 py-1.5 text-sm"
          style={{ border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
        >
          팀원 수정
        </button>
      </div>

      {tab === 'team' ? (
        <TeamReportView report={report} />
      ) : (
        <PersonalView charts={charts} pairs={report.analysis.pairs} />
      )}
    </div>
  )
}
