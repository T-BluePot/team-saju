import { CommonCard } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'
import { ILLUST_SOURCE, ILLUST_SOURCE_URL, illustFor } from '../../lib/ui/elementStyle'

export function TeamIllustration({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report
  const illust = illustFor(archetype.id, analysis.elements.dominant)

  return (
    <figure className="flex flex-col items-center gap-3">
      <CommonCard flush className="flex w-full items-center justify-center px-6 py-8">
        <img
          src={illust.src}
          alt={`${archetype.name} 이미지`}
          className="animate-ink h-44 w-auto object-contain sm:h-56"
          loading="lazy"
        />
      </CommonCard>
      <figcaption className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
        일러스트{' '}
        <a
          href={ILLUST_SOURCE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          {ILLUST_SOURCE}
        </a>
      </figcaption>
    </figure>
  )
}
