import type { TeamReport } from '../../lib/report/teamReport'

export function TeamHeadline({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report
  return (
    <header className="relative pt-2">
      <span
        className="seal animate-seal absolute right-0 top-0 size-11 text-base"
        aria-hidden="true"
      >
        占
      </span>

      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {analysis.teamName} · {analysis.size}명
      </p>

      <h2 className="serif animate-ink mt-3 text-[2rem] font-extrabold leading-[1.15] sm:text-[2.6rem]">
        {archetype.name}
      </h2>

      <p className="serif mt-3 text-base sm:text-lg" style={{ color: 'var(--ink-soft)' }}>
        {archetype.tagline}
      </p>

      <hr className="rule-double mt-6" />
    </header>
  )
}
