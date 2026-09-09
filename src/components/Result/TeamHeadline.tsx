import { ArchetypeScroll } from './ArchetypeScroll'
import { SOLO_LEAD, SOLO_NOTE, isSolo, needsBlock } from '../../lib/report/solo'
import type { TeamReport } from '../../lib/report/teamReport'
import { ILLUST_SOURCE, ILLUST_SOURCE_URL } from '../../lib/ui/elementStyle'
import { illustrationCopy } from '../../lib/copy'

export function TeamHeadline({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report
  // 혼자 넣어봐도 막지 않는다. 뭐가 비었는지, 누굴 붙이면 되는지가 보인다
  const solo = isSolo(analysis)

  return (
    <header>
      {/*
        유형이 이 화면의 결론이다. 첫 화면에서 넘겨보던 판이 여기서 자기 팀 것으로
        걸린다. 누굴 데려오면 되는지도 같이 걸어둔다. 결론 바로 옆에 있어야 읽는다
      */}
      <ArchetypeScroll
        unroll
        archetype={archetype}
        needs={needsBlock(solo, archetype)}
        lead={solo ? SOLO_LEAD : undefined}
      />

      <p className="mt-3 text-center text-11" style={{ color: 'var(--ink-soft)' }}>
        {illustrationCopy.caption}{' '}
        <a
          href={ILLUST_SOURCE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          {ILLUST_SOURCE}
        </a>
      </p>

      {solo && (
        <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {SOLO_NOTE}
        </p>
      )}
    </header>
  )
}
