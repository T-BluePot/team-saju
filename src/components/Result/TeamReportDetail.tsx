import { CommonChip, CommonRule, CommonSection, CommonSubHeading } from '../Common'
import { TeamModifiers } from './TeamModifiers'
import { isSolo, needsBlock } from '../../lib/report/solo'
import type { TeamReport } from '../../lib/report/teamReport'

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
      index="二"
      title="상세 보고서"
      subtitle={
        solo ? '이 기운이 팀이 되면 어떻게 되나' : '강점과 빈자리, 그리고 처방'
      }
    >
      {solo && (
        <>
          {needsSection}
          <CommonRule />
        </>
      )}

      <CommonSubHeading>
        {solo ? '이 기운이 만드는 강점' : '이 팀의 강점'}
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
                style={{ color: 'var(--accent-deep)' }}
              >
                處方
              </span>
              {archetype.prescriptions[i]}
            </p>
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
          <CommonSubHeading>조합 집계</CommonSubHeading>
          <div className="mt-3 flex flex-wrap gap-2">
            <CommonChip>
              상생 <strong>{analysis.pairCounts.generating}</strong>쌍
            </CommonChip>
            <CommonChip>
              비슷한 결 <strong>{analysis.pairCounts.same}</strong>쌍
            </CommonChip>
            <CommonChip>
              긴장감 있는 조합 <strong>{analysis.pairCounts.tension}</strong>쌍
            </CommonChip>
          </div>
          <p className="mt-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
            누가 누구인지는 공유 이미지에 안 들어갑니다. 개인 탭에서만 보여요
          </p>
        </>
      )}
    </CommonSection>
  )
}
