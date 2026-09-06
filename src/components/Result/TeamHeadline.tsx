import type { TeamReport } from '../../lib/report/teamReport'

export function TeamHeadline({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report
  // 혼자 넣어봐도 막지 않는다. 뭐가 비었는지, 누굴 붙이면 되는지가 보인다
  const solo = analysis.size === 1
  return (
    <header className="relative pt-2">
      <span
        className="seal animate-seal absolute right-0 top-0 size-11 text-base"
        aria-hidden="true"
      >
        占
      </span>

      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {analysis.teamName} · {solo ? '아직 혼자' : `${analysis.size}명`}
      </p>

      <h2 className="serif animate-ink mt-3 text-[2rem] font-extrabold leading-[1.15] sm:text-[2.6rem]">
        {archetype.name}
      </h2>

      <p className="serif mt-3 text-base sm:text-lg" style={{ color: 'var(--ink-soft)' }}>
        {archetype.tagline}
      </p>

      {solo && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          한 명 기준으로 본 결과입니다. 사람을 넣을수록 기운이 섞여서 유형이 달라집니다
        </p>
      )}

      <hr className="rule-double mt-6" />
    </header>
  )
}
