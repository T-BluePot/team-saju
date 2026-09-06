import { ELEMENT_LABEL, STEM_ELEMENT } from '../lib/saju/constants'
import type { Pillar } from '../lib/saju/types'
import { ELEMENT_COLOR } from '../lib/ui/elementStyle'

const KIND_LABEL: Record<Pillar['kind'], string> = {
  year: '연주',
  month: '월주',
  day: '일주',
  hour: '시주',
}

export function PillarCard({ pillar, isDayMaster }: { pillar: Pillar; isDayMaster?: boolean }) {
  const stemEl = STEM_ELEMENT[pillar.stem]

  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl px-2 py-3"
      style={{
        background: 'var(--surface)',
        border: isDayMaster ? '2px solid var(--cinnabar)' : '1px solid var(--rule)',
      }}
    >
      <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
        {KIND_LABEL[pillar.kind]}
      </span>
      <span className="text-2xl font-bold leading-tight" style={{ color: ELEMENT_COLOR[stemEl] }}>
        {pillar.stem}
      </span>
      <span className="text-2xl font-bold leading-tight">{pillar.branch}</span>
      <span className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
        {pillar.stemGod ?? `일간 ${ELEMENT_LABEL[stemEl]}`}
      </span>
    </div>
  )
}

export function EmptyPillar() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3"
      style={{ background: 'var(--paper-deep)', border: '1px dashed var(--rule)' }}
    >
      <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
        시주
      </span>
      <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        시간
        <br />
        미상
      </span>
    </div>
  )
}
