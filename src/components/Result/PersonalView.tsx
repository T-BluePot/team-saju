import { useState } from 'react'

import { CommonCard, CommonChip } from '../Common'
import { SajuElementBars, SajuEmptyPillar, SajuPillarCard, SajuTraitBars } from '../Saju'
import { ELEMENT_LABEL, TEN_GODS } from '../../lib/saju/constants'
import type { PairChemistry, SajuChart } from '../../lib/saju/types'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

const STRENGTH_LABEL = {
  strong: { name: '신강', note: '주도적이고 추진력이 있어요. 대신 고집이 셀 수 있어요' },
  balanced: { name: '중화', note: '균형이 잡혀 있고 적응이 빨라요' },
  weak: { name: '신약', note: '협력형이에요. 환경에 민감하고 조율을 잘해요' },
} as const

export function PersonalView({
  charts,
  pairs,
}: {
  charts: SajuChart[]
  pairs: PairChemistry[]
}) {
  const [selected, setSelected] = useState(0)
  const chart = charts[selected]
  if (!chart) return null

  const { pillars, dayMaster, elements, strength, traits, tenGods, corrections } = chart
  const strengthInfo = STRENGTH_LABEL[strength.level]
  const myPairs = pairs.filter(
    (p) => p.aId === chart.member.id || p.bId === chart.member.id,
  )

  return (
    <div className="flex flex-col gap-5">
      <CommonCard flush className="flex flex-wrap gap-2 p-3">
        {charts.map((c, i) => (
          <button
            key={c.member.id}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className="press min-h-11 rounded-full px-4 text-sm font-medium"
            style={
              i === selected
                ? { background: 'var(--accent-deep)', color: '#fff' }
                : { background: 'var(--paper-deep)', border: '1px solid var(--rule)' }
            }
          >
            {c.member.name}
          </button>
        ))}
      </CommonCard>

      <CommonCard>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{chart.member.name}</h3>
          <CommonChip tone={chart.member.consent.source === 'delegated' ? 'warn' : 'neutral'} size="sm">
            {chart.member.consent.source === 'delegated' ? '대리 입력' : '본인 입력'}
          </CommonChip>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <SajuPillarCard pillar={pillars.year} />
          <SajuPillarCard pillar={pillars.month} />
          <SajuPillarCard pillar={pillars.day} isDayMaster />
          {pillars.hour ? <SajuPillarCard pillar={pillars.hour} /> : <SajuEmptyPillar />}
        </div>

        <p className="mt-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
          일간은{' '}
          <strong style={{ color: ELEMENT_COLOR[dayMaster.element] }}>
            {dayMaster.stem} {ELEMENT_LABEL[dayMaster.element]}
          </strong>
          . 사주에서 나 자신에 해당하는 글자예요
        </p>

        <div className="mt-5">
          <SajuElementBars percents={elements.percents} />
        </div>

        <div className="mt-5 rounded-xl p-4" style={{ background: 'var(--paper-deep)' }}>
          <p className="text-sm">
            <strong>{strengthInfo.name}</strong>
            <span className="ml-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
              지수 {strength.index} · 간이 판정
            </span>
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
            {strengthInfo.note}
          </p>
        </div>

        <h4 className="mt-6 text-sm font-bold">협업 성향</h4>
        <div className="mt-2.5">
          <SajuTraitBars traits={traits} />
        </div>

        <h4 className="mt-6 text-sm font-bold">십신</h4>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {TEN_GODS.filter((g) => tenGods[g] > 0).map((g) => (
            <CommonChip key={g}>
              {g} {tenGods[g]}
            </CommonChip>
          ))}
        </div>

        {myPairs.length > 0 && (
          <>
            <h4 className="mt-6 text-sm font-bold">다른 팀원과의 조합</h4>
            <ul className="mt-2.5 flex flex-col gap-2">
              {myPairs.map((p) => (
                <li
                  key={`${p.aId}-${p.bId}`}
                  className="rounded-lg px-3 py-2.5 text-sm"
                  style={{ background: 'var(--paper-deep)' }}
                >
                  <span className="font-medium">
                    {p.aId === chart.member.id ? p.bName : p.aName}
                  </span>
                  <span className="mx-2" style={{ color: 'var(--ink-soft)' }}>
                    {p.label}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                    {p.direction}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {corrections.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium">
              계산 근거 보기
            </summary>
            <ul className="mt-2.5 flex flex-col gap-2">
              {corrections.map((c) => (
                <li key={c.label} className="text-xs leading-relaxed">
                  <strong>{c.label}</strong>
                  <span className="ml-1.5" style={{ color: 'var(--ink-soft)' }}>
                    {c.detail}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </CommonCard>
    </div>
  )
}
