import type { TeamReport } from '../../lib/report/teamReport'
import { TeamAnalysis } from './TeamAnalysis'
import { TeamHeadline } from './TeamHeadline'
import { TeamIllustration } from './TeamIllustration'
import { TeamNextStep } from './TeamNextStep'
import { TeamReportDetail } from './TeamReportDetail'
import { TeamShareCard } from './TeamShareCard'

export function TeamReportView({ report }: { report: TeamReport }) {
  return (
    <div className="flex flex-col gap-10">
      <TeamHeadline report={report} />
      <TeamIllustration report={report} />
      <TeamAnalysis report={report} />
      <TeamReportDetail report={report} />
      <TeamShareCard report={report} />
      <TeamNextStep count={report.analysis.size} />
    </div>
  )
}
