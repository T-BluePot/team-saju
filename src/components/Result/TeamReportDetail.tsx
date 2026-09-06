import { CommonChip, CommonRule, CommonSection, CommonSubHeading } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'

export function TeamReportDetail({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report

  return (
    <CommonSection index="二" title="상세 보고서" subtitle="강점과 빈자리, 그리고 처방">
      <CommonSubHeading>이 팀의 강점</CommonSubHeading>
      <ul className="mt-3 flex flex-col gap-2.5">
        {archetype.strengths.map((s) => (
          <li key={s} className="flex gap-3 text-sm leading-relaxed">
            <span style={{ color: 'var(--accent)' }}>·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>

      <CommonRule />

      <CommonSubHeading>놓치기 쉬운 것</CommonSubHeading>
      <ul className="mt-3 flex flex-col gap-5">
        {archetype.blindSpots.map((b, i) => (
          <li key={b}>
            <p className="text-sm leading-relaxed">{b}</p>
            <p
              className="mt-2 border-l-2 py-1 pl-3 text-sm leading-relaxed"
              style={{ borderColor: 'var(--accent)' }}
            >
              <span
                className="serif mr-1.5 text-xs font-bold"
                style={{ color: 'var(--accent)' }}
              >
                處方
              </span>
              {archetype.prescriptions[i]}
            </p>
          </li>
        ))}
      </ul>

      <CommonRule />

      <CommonSubHeading>이 팀에 들어오면 좋은 사람</CommonSubHeading>
      <p className="serif mt-3 text-lg leading-relaxed">{archetype.needsPerson}</p>

      <CommonRule />

      <CommonSubHeading>조합 집계</CommonSubHeading>
      <div className="mt-3 flex flex-wrap gap-2">
        <CommonChip>상생 <strong>{analysis.pairCounts.generating}</strong>쌍</CommonChip>
        <CommonChip>비슷한 결 <strong>{analysis.pairCounts.same}</strong>쌍</CommonChip>
        <CommonChip>긴장감 있는 조합 <strong>{analysis.pairCounts.tension}</strong>쌍</CommonChip>
      </div>
      <p className="mt-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
        누가 누구인지는 공유 이미지에 안 들어갑니다. 개인 탭에서만 보여요
      </p>
    </CommonSection>
  )
}
