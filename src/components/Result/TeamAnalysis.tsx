import { CommonSection, CommonWell } from '../Common'
import { SajuElementBars, SajuElementRadar } from '../Saju'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

export function TeamAnalysis({ report }: { report: TeamReport }) {
  const { analysis, dominant, lacking } = report

  return (
    <CommonSection index="一" title="분석" subtitle="팀 전체의 기운을 재봤습니다">
      <div className="flex flex-col items-center gap-7 sm:flex-row">
        <SajuElementRadar percents={analysis.elements.percents} size={230} />
        <div className="w-full flex-1">
          <SajuElementBars percents={analysis.elements.percents} flags={analysis.flags} />
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Stat
          title="넘치는 기운"
          value={`${dominant.element} ${ELEMENT_LABEL[dominant.element]} ${dominant.percent}%`}
          note={dominant.meaning}
          color={ELEMENT_COLOR[dominant.element]}
        />
        <Stat
          title="비어 있는 곳"
          value={`${lacking.element} ${ELEMENT_LABEL[lacking.element]} ${lacking.percent}%`}
          note={lacking.effect}
          color={ELEMENT_COLOR[lacking.element]}
        />
      </div>

      <div
        className="mt-3 flex items-baseline gap-3 rounded-xl px-4 py-3"
        style={{ background: 'var(--paper-deep)' }}
      >
        <span className="serif text-2xl font-bold" style={{ color: 'var(--accent)' }}>
          {analysis.balance}
        </span>
        <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          균형 점수. 100이면 다섯 기운이 완전히 고른 상태입니다
        </span>
      </div>
    </CommonSection>
  )
}

function Stat({
  title,
  value,
  note,
  color,
}: {
  title: string
  value: string
  note: string
  color: string
}) {
  return (
    <CommonWell>
      <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
        {title}
      </p>
      <p className="serif mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
        {note}
      </p>
    </CommonWell>
  )
}
