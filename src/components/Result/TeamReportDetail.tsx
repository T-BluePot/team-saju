import { CommonChip, CommonRule, CommonSection, CommonSubHeading } from '../Common'
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
  const solo = analysis.size === 1
  const hasPairs = analysis.pairs.length > 0

  // 균형형 문구는 "이미 다 있습니다" 라서 혼자일 때 "같이 하면 좋은 사람" 아래
  // 붙으면 앞뒤가 안 맞는다. 여럿이 모여서 고르다는 뜻으로 쓴 문장이다
  const soloBalanced = solo && archetype.id === 'balanced'

  const needs = (
    <>
      <CommonSubHeading>
        {soloBalanced
          ? '지금은 이렇습니다'
          : solo
            ? '같이 하면 좋은 사람'
            : '이 팀에 들어오면 좋은 사람'}
      </CommonSubHeading>
      <p className="serif mt-3 text-lg leading-relaxed">
        {soloBalanced
          ? '다섯 기운이 고르게 나왔습니다. 누가 와도 크게 안 흔들릴 텐데, 뒤집으면 아직 어느 쪽으로도 안 기울어 있다는 뜻입니다'
          : archetype.needsPerson}
      </p>
    </>
  )

  return (
    <CommonSection
      index="二"
      title="상세 보고서"
      subtitle={solo ? '빈자리와 처방' : '강점과 빈자리, 그리고 처방'}
    >
      {solo && (
        <>
          {needs}
          <CommonRule />
        </>
      )}

      <CommonSubHeading>{solo ? '지금 기운의 강점' : '이 팀의 강점'}</CommonSubHeading>
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

      {!solo && (
        <>
          <CommonRule />
          {needs}
        </>
      )}

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
