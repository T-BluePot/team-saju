import {
  CommonChip,
  CommonPrescription,
  CommonRule,
  CommonSection,
  CommonSubHeading,
} from '../Common'
import { TeamModifiers } from './TeamModifiers'
import { isSolo, needsBlock } from '../../lib/report/solo'
import type { TeamReport } from '../../lib/report/teamReport'
import { detailCopy, resultCopy } from '../../lib/copy'

export function TeamReportDetail({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report

  /**
   * 혼자 넣어본 경우.
   *
   * 막지 않는다. 뭐가 비었는지, 어떤 사람을 붙이면 되는지 알 수 있어서 그게 쓸모다.
   * 대신 화면이 팀인 척하면 안 된다. 조합 집계는 빼고, 누굴 데려오면 좋은지를
   * 맨 앞으로 올린다. 혼자 볼 때는 그게 제일 궁금한 얘기다.
   */
  const solo = isSolo(analysis)
  // 2명 이상이면 조합이 반드시 하나는 나온다. 판정이 둘이면 나중에 갈라진다
  const hasPairs = !solo && analysis.pairs.length > 0
  const needs = needsBlock(solo, archetype)

  const needsSection = (
    <>
      <CommonSubHeading>{needs.heading}</CommonSubHeading>
      <p className="serif mt-3 text-lg leading-relaxed">{needs.body}</p>
    </>
  )

  return (
    <CommonSection
      index={detailCopy.index}
      title={detailCopy.title}
      subtitle={solo ? detailCopy.subtitleSolo : detailCopy.subtitleTeam}
    >
      {solo && (
        <>
          {needsSection}
          <CommonRule />
        </>
      )}

      <CommonSubHeading>
        {solo ? detailCopy.strengthsSolo : detailCopy.strengthsTeam}
      </CommonSubHeading>
      <ul className="mt-3 flex flex-col gap-2.5">
        {archetype.strengths.map((s) => (
          <li key={s} className="flex gap-3 text-sm leading-relaxed">
            <span style={{ color: 'var(--accent-deep)' }}>·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>

      <CommonRule />

      <CommonSubHeading>{detailCopy.blindSpots}</CommonSubHeading>
      <ul className="mt-3 flex flex-col gap-5">
        {archetype.blindSpots.map((b, i) => (
          <li key={b}>
            <p className="text-sm leading-relaxed">{b}</p>
            <CommonPrescription mark={resultCopy.prescriptionMark}>
              {archetype.prescriptions[i]}
            </CommonPrescription>
          </li>
        ))}
      </ul>

      {!solo && (
        <>
          <CommonRule />
          {needsSection}
        </>
      )}

      <TeamModifiers report={report} />

      {/* 조합이 없으면 아예 안 그린다. 0쌍 0쌍 0쌍은 알려주는 게 없다 */}
      {hasPairs && (
        <>
          <CommonRule />
          <CommonSubHeading>{detailCopy.pairsHeading}</CommonSubHeading>
          <div className="mt-3 flex flex-wrap gap-2">
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
          <p className="mt-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
            {detailCopy.pairsNote}
          </p>
        </>
      )}
    </CommonSection>
  )
}
