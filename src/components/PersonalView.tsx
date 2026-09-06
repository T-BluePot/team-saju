import { useState } from 'react'

import { ELEMENT_LABEL, TEN_GODS, TRAIT_AXES } from '../lib/saju/constants'
import type { PairChemistry, SajuChart } from '../lib/saju/types'
import { ElementBars } from './ElementBars'
import { ELEMENT_COLOR } from '../lib/ui/elementStyle'
import { EmptyPillar, PillarCard } from './PillarCard'

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
      <div
        className="flex flex-wrap gap-2 rounded-2xl p-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
      >
        {charts.map((c, i) => (
          <button
            key={c.member.id}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className="rounded-full px-3.5 py-1.5 text-sm font-medium"
            style={
              i === selected
                ? { background: 'var(--cinnabar)', color: '#fff' }
                : { background: 'var(--paper-deep)', border: '1px solid var(--rule)' }
            }
          >
            {c.member.name}
          </button>
        ))}
      </div>

      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{chart.member.name}</h3>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={
              chart.member.consent.source === 'delegated'
                ? { background: '#fdf1d0', color: '#8a6a12' }
                : { background: 'var(--paper-deep)', color: 'var(--ink-soft)' }
            }
          >
            {chart.member.consent.source === 'delegated' ? '대리 입력' : '본인 입력'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <PillarCard pillar={pillars.year} />
          <PillarCard pillar={pillars.month} />
          <PillarCard pillar={pillars.day} isDayMaster />
          {pillars.hour ? <PillarCard pillar={pillars.hour} /> : <EmptyPillar />}
        </div>

        <p className="mt-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
          일간은{' '}
          <strong style={{ color: ELEMENT_COLOR[dayMaster.element] }}>
            {dayMaster.stem} {ELEMENT_LABEL[dayMaster.element]}
          </strong>
          . 사주에서 나 자신에 해당하는 글자예요
        </p>

        <div className="mt-5">
          <ElementBars percents={elements.percents} />
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
        <ul className="mt-2.5 flex flex-col gap-2">
          {TRAIT_AXES.map((axis) => (
            <li key={axis} className="flex items-center gap-3">
              <span className="w-9 shrink-0 text-sm">{axis}</span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full"
                style={{ background: 'var(--rule)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${traits[axis]}%`, background: 'var(--cinnabar)' }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-sm tabular-nums">
                {traits[axis]}%
              </span>
            </li>
          ))}
        </ul>

        <h4 className="mt-6 text-sm font-bold">십신</h4>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {TEN_GODS.filter((g) => tenGods[g] > 0).map((g) => (
            <span
              key={g}
              className="rounded-full px-2.5 py-1 text-xs"
              style={{ background: 'var(--paper-deep)', border: '1px solid var(--rule)' }}
            >
              {g} {tenGods[g]}
            </span>
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
      </section>
    </div>
  )
}
