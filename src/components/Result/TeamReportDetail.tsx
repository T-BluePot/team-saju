import { CommonBlock, CommonChip, CommonEntry, CommonEntryList, CommonSection } from '../Common'
import { TeamModifiers } from './TeamModifiers'
import { isSolo } from '../../lib/report/solo'
import type { TeamReport } from '../../lib/report/teamReport'
import { detailCopy, resultCopy } from '../../lib/copy'

export function TeamReportDetail({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report

  /**
   * 혼자 넣어본 경우.
   *
   * 막지 않는다. 뭐가 비었는지, 어떤 사람을 붙이면 되는지 알 수 있어서 그게 쓸모다.
   * 대신 화면이 팀인 척하면 안 된다. 조합 집계는 뺀다.
   */
  const solo = isSolo(analysis)
  // 2명 이상이면 조합이 반드시 하나는 나온다. 판정이 둘이면 나중에 갈라진다
  const hasPairs = !solo && analysis.pairs.length > 0

  return (
    <CommonSection
      index={detailCopy.index}
      title={detailCopy.title}
      subtitle={solo ? detailCopy.subtitleSolo : detailCopy.subtitleTeam}
    >
      <CommonBlock label={solo ? detailCopy.strengthsSolo : detailCopy.strengthsTeam} first>
        <ul className="flex flex-col gap-2.5">
          {archetype.strengths.map((s) => (
            <li key={s} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden="true" style={{ color: 'var(--accent-deep)' }}>
                ·
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </CommonBlock>

      <CommonBlock label={detailCopy.blindSpots}>
        <CommonEntryList divided>
          {archetype.blindSpots.map((b, i) => (
            <CommonEntry
              key={b}
              fix={archetype.prescriptions[i]}
              fixMark={resultCopy.prescriptionMark}
            >
              {b}
            </CommonEntry>
          ))}
        </CommonEntryList>
      </CommonBlock>

      <TeamModifiers report={report} />

      {/* 조합이 없으면 아예 안 그린다. 0쌍 0쌍 0쌍은 알려주는 게 없다 */}
      {hasPairs && (
        <CommonBlock label={detailCopy.pairsHeading}>
          <div className="flex flex-wrap gap-2">
            <CommonChip>
              {detailCopy.pairGenerating} <strong>{analysis.pairCounts.generating}</strong>
              {detailCopy.pairUnit}
            </CommonChip>
            <CommonChip>
              {detailCopy.pairSame} <strong>{analysis.pairCounts.same}</strong>
              {detailCopy.pairUnit}
            </CommonChip>
            <CommonChip>
              {detailCopy.pairTension} <strong>{analysis.pairCounts.tension}</strong>
              {detailCopy.pairUnit}
            </CommonChip>
          </div>
          <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {detailCopy.pairsNote}
          </p>
        </CommonBlock>
      )}
    </CommonSection>
  )
}
