import type { TeamReport } from '../../lib/report/teamReport'
import { TeamAnalysis } from './TeamAnalysis'
import { TeamEnergyCards } from './TeamEnergyCards'
import { TeamHeadline } from './TeamHeadline'
import { TeamReportDetail } from './TeamReportDetail'
import { TeamShareCard } from './TeamShareCard'

export function TeamReportView({ report }: { report: TeamReport }) {
  return (
    <div className="flex flex-col gap-10">
      <TeamHeadline report={report} />
      <TeamAnalysis report={report} />
      <TeamReportDetail report={report} />
      <TeamEnergyCards report={report} />
      <TeamShareCard report={report} />
    </div>
  )
}
