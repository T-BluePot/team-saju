import { useState } from 'react'

import { CommonCard, CommonChip } from '../Common'
import { SajuElementBars, SajuEmptyPillar, SajuPillarCard, SajuTraitBars } from '../Saju'
import { ELEMENT_LABEL, TEN_GODS } from '../../lib/saju/constants'
import type { PairChemistry, SajuChart } from '../../lib/saju/types'
import { personalCopy, strengthCopy } from '../../lib/copy'
import { pairCopy } from '../../lib/report/pairs'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

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

  const { pillars, dayMaster, elements, strength, traits, tenGods, voidBranches, corrections } =
    chart
  const strengthInfo = strengthCopy[strength.level]
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
                ? { background: 'var(--accent-deep)', color: 'var(--on-accent)' }
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
            {chart.member.consent.source === 'delegated'
              ? personalCopy.sourceDelegated
              : personalCopy.sourceSelf}
          </CommonChip>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <SajuPillarCard pillar={pillars.year} />
          <SajuPillarCard pillar={pillars.month} />
          <SajuPillarCard pillar={pillars.day} isDayMaster />
          {pillars.hour ? <SajuPillarCard pillar={pillars.hour} /> : <SajuEmptyPillar />}
        </div>

        {/*
          십이운성에 프레이밍이 없으면 회색과 강조색이 좋고 나쁨처럼 읽힌다.
          팀원 전환 탭이 있어서 남의 명식도 같은 화면에 보인다. 평가로 쓰이면 안 된다
        */}
        <p className="mt-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
          {personalCopy.pillarNote}
        </p>

        <p className="mt-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
          {personalCopy.dayMasterPrefix}{' '}
          <strong style={{ color: ELEMENT_COLOR[dayMaster.element] }}>
            {dayMaster.stem} {ELEMENT_LABEL[dayMaster.element]}
          </strong>
          {personalCopy.dayMasterSuffix}
        </p>

        {/*
          공망. 빈 칸이라는 뜻이지 나쁜 게 아니다.
          운을 점치는 데 쓰지 않는다. 그냥 이 사주에서 안 채워진 자리다
        */}
        {voidBranches.length > 0 && (
          <p className="mt-1.5 text-sm" style={{ color: 'var(--ink-soft)' }}>
            {personalCopy.voidPrefix}{' '}
            <strong style={{ color: 'var(--ink)' }}>{voidBranches.join(' ')}</strong>
            {personalCopy.voidSuffix}
          </p>
        )}

        <div className="mt-5">
          <SajuElementBars percents={elements.percents} />
        </div>

        <div className="mt-5 rounded-xl p-4" style={{ background: 'var(--paper-deep)' }}>
          <p className="text-sm">
            <strong>{strengthInfo.name}</strong>
            <span className="ml-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
              {personalCopy.strengthIndex(strength.index)}
            </span>
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
            {strengthInfo.note}
          </p>
        </div>

        <h4 className="mt-6 text-sm font-bold">{personalCopy.traitsHeading}</h4>
        <div className="mt-2.5">
          <SajuTraitBars traits={traits} />
        </div>

        <h4 className="mt-6 text-sm font-bold">{personalCopy.tenGodsHeading}</h4>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {TEN_GODS.filter((g) => tenGods[g] > 0).map((g) => (
            <CommonChip key={g}>
              {g} {tenGods[g]}
            </CommonChip>
          ))}
        </div>

        {myPairs.length > 0 && (
          <>
            <h4 className="mt-6 text-sm font-bold">{personalCopy.pairsHeading}</h4>
            <ul className="mt-2.5 flex flex-col gap-2">
              {myPairs.map((p) => {
                const copy = pairCopy(p)
                return (
                  <li
                    key={`${p.aId}-${p.bId}`}
                    className="rounded-lg px-3 py-2.5 text-sm"
                    style={{ background: 'var(--paper-deep)' }}
                  >
                    <span className="font-medium">
                      {p.aId === chart.member.id ? p.bName : p.aName}
                    </span>
                    <span className="mx-2" style={{ color: 'var(--ink-soft)' }}>
                      {copy.label}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                      {copy.direction}
                    </span>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {corrections.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium">
              {personalCopy.corrections}
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
