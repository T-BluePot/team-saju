import { SOLO_LEAD, SOLO_NOTE, isSolo } from '../../lib/report/solo'
import type { TeamReport } from '../../lib/report/teamReport'
import { headlineCopy } from '../../lib/copy'

export function TeamHeadline({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report
  // 혼자 넣어봐도 막지 않는다. 뭐가 비었는지, 누굴 붙이면 되는지가 보인다
  const solo = isSolo(analysis)
  return (
    <header className="relative pt-2">
      <span
        className="seal animate-seal absolute right-0 top-0 size-11 text-base"
        aria-hidden="true"
      >
        {headlineCopy.seal}
      </span>

      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {analysis.teamName} · {solo ? headlineCopy.solo : headlineCopy.size(analysis.size)}
      </p>

      {solo && (
        <p className="serif mt-3 text-sm" style={{ color: 'var(--accent-deep)' }}>
          {SOLO_LEAD}
        </p>
      )}

      <h2
        className={`serif animate-ink text-[2rem] font-extrabold leading-[1.15] sm:text-[2.6rem] ${solo ? 'mt-1' : 'mt-3'}`}
      >
        {archetype.name}
      </h2>

      <p className="serif mt-3 text-base sm:text-lg" style={{ color: 'var(--ink-soft)' }}>
        {archetype.tagline}
      </p>

      {solo && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {SOLO_NOTE}
        </p>
      )}

      <hr className="rule-double mt-6" />
    </header>
  )
}
