import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import {
  CommonBlock,
  CommonChip,
  CommonEntryList,
  CommonSection,
} from '../Common'
import { SajuElementBars, SajuPillarTable, SajuTraitBars } from '../Saju'
import { ELEMENT_LABEL, STRENGTH_THRESHOLD, TEN_GODS } from '../../lib/saju/constants'
import type { PairChemistry, SajuChart, Strength } from '../../lib/saju/types'
import { personalCopy, strengthCopy } from '../../lib/copy'
import { pairCopy } from '../../lib/report/pairs'
import { readTraits } from '../../lib/report/traits'
import { ELEMENT_COLOR_DEEP } from '../../lib/ui/elementStyle'

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
  const myPairs = pairs.filter((p) => p.aId === chart.member.id || p.bId === chart.member.id)
  const reading = readTraits(traits)

  return (
    <div className="flex flex-col gap-10">
      {/*
        팀원 전환. 넘치면 밀어서 본다. 줄바꿈으로 흘리면 사람 수에 따라
        아래 섹션이 시작하는 높이가 달라진다. 스크롤바는 `.scroll-x` 가
        얇게라도 남겨둔다. 감추면 마우스로 뒤쪽 칩에 닿을 데가 없어진다
      */}
      <div className="scroll-x -mx-5 flex gap-2 overflow-x-auto px-5">
        {charts.map((c, i) => (
          <button
            key={c.member.id}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className="press flex-none whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium"
            style={
              i === selected
                ? { background: 'var(--ink)', color: 'var(--paper)' }
                : {
                    background: 'var(--paper-deep)',
                    border: '1px solid var(--rule)',
                    color: 'var(--ink)',
                  }
            }
          >
            {c.member.name}
          </button>
        ))}
      </div>

      <CommonSection
        index={personalCopy.chartIndex}
        title={personalCopy.chartTitle}
        subtitle={personalCopy.chartSubtitle}
      >
        <CommonBlock
          label={chart.member.name}
          first
          aside={
            <CommonChip
              size="sm"
              tone={chart.member.consent.source === 'delegated' ? 'warn' : 'neutral'}
            >
              {chart.member.consent.source === 'delegated'
                ? personalCopy.sourceDelegated
                : personalCopy.sourceSelf}
            </CommonChip>
          }
        >
          {/*
            표만 블록 들여쓰기와 카드 여백 밖으로 밀어낸다. 320px 에서 기둥 넷을
            다 보여주려면 24px 이 아쉽다. 이 표는 읽는 폭이 곧 정보량이라
            여백 줄을 지키는 것보다 넷이 다 보이는 게 먼저다
          */}
          <div className="chart-bleed">
            <SajuPillarTable pillars={pillars} />
          </div>

          {/*
            표를 읽는 법. 표에 딸린 각주라 선 없이 바로 붙인다. 표와 한 덩어리다.
            십이운성에 프레이밍이 없으면 회색과 강조색이 좋고 나쁨처럼 읽힌다.
            팀원 전환 탭이 있어서 남의 명식도 같은 화면에 보인다. 평가로 쓰이면 안 된다
          */}
          <p className="mt-3 text-11 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {personalCopy.pillarNote}
          </p>

          {/*
            여기서 덩어리가 바뀐다. 위는 표와 표 읽는 법이고 아래는 이 명식에서
            읽어낸 내용이다. 이 블록 안에서 선을 긋는 자리는 여기 하나다
          */}
          <div
            className="mt-5 flex flex-col gap-2.5 pt-5"
            style={{ borderTop: '1px solid var(--rule-faint)' }}
          >
            <Note label={personalCopy.dayMasterPrefix}>
              <strong
                className="serif font-bold"
                style={{ color: ELEMENT_COLOR_DEEP[dayMaster.element] }}
              >
                {dayMaster.stem} {ELEMENT_LABEL[dayMaster.element]}
              </strong>
              {personalCopy.dayMasterSuffix}
            </Note>

            {/*
              공망. 빈 칸이라는 뜻이지 나쁜 게 아니다.
              운을 점치는 데 쓰지 않는다. 그냥 이 사주에서 안 채워진 자리다
            */}
            {voidBranches.length > 0 && (
              <Note label={personalCopy.voidPrefix}>
                <strong className="serif font-bold">{voidBranches.join(' ')}</strong>
                {personalCopy.voidSuffix}
              </Note>
            )}
          </div>
        </CommonBlock>

        <CommonBlock label={personalCopy.elementsBlock}>
          <SajuElementBars percents={elements.percents} />
        </CommonBlock>
      </CommonSection>

      <CommonSection
        index={personalCopy.traitsIndex}
        title={personalCopy.traitsTitle}
        subtitle={personalCopy.traitsSubtitle}
      >
        <CommonBlock label={personalCopy.strengthBlock} first>
          <StrengthGauge strength={strength} />
        </CommonBlock>

        <CommonBlock label={personalCopy.tenGodsHeading}>
          <div className="flex flex-wrap gap-1.5">
            {TEN_GODS.filter((g) => tenGods[g] > 0).map((g) => (
              <CommonChip key={g}>
                {g} <strong style={{ color: 'var(--ink)' }}>{tenGods[g]}</strong>
              </CommonChip>
            ))}
          </div>
        </CommonBlock>

        <CommonBlock label={personalCopy.traitsHeading}>
          {/*
            팀 결과와 같은 규칙으로 짚는다. 높은 축은 파랑, 낮은 축은 빨강,
            나머지는 물러난다. 여기만 다섯 줄이 다 강조색이라 어느 쪽이 두껍고
            어느 쪽이 얇은지가 안 보였다.

            고르게 나온 사람은 짚을 축이 없다. 억지로 둘을 굵게 하면
            `TRAIT_AXES` 배열 순서가 그대로 새어 나온다
          */}
          <SajuTraitBars
            traits={traits}
            strong={reading.even ? undefined : reading.topAxes}
            weak={reading.even ? undefined : reading.bottomAxes}
          />
        </CommonBlock>

        {myPairs.length > 0 && (
          <CommonBlock label={personalCopy.pairsHeading}>
            <CommonEntryList divided>
              {myPairs.map((p) => {
                const copy = pairCopy(p)
                return (
                  <div key={`${p.aId}-${p.bId}`}>
                    <p className="mb-2 flex items-center gap-2">
                      <b className="text-sm font-bold">
                        {p.aId === chart.member.id ? p.bName : p.aName}
                      </b>
                      <CommonChip tone="soft" size="sm">
                        {copy.label}
                      </CommonChip>
                    </p>
                    <p className="text-sm leading-relaxed">{copy.direction}</p>
                  </div>
                )
              })}
            </CommonEntryList>
          </CommonBlock>
        )}

        {corrections.length > 0 && (
          <div className="py-5" style={{ borderTop: '1px solid var(--rule)' }}>
            {/* 근거는 궁금한 사람만 연다. 늘 펼쳐두면 명식보다 보정 얘기가 길어진다 */}
            <details>
              <summary className="summary-plain serif text-sm font-extrabold tracking-tight">
                {personalCopy.corrections}
                <Chevron />
              </summary>
              <ul className="mt-3 flex flex-col gap-2 pl-3">
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
          </div>
        )}
      </CommonSection>
    </div>
  )
}

/**
 * 명식에서 읽어낸 한 줄.
 *
 * `일간은` `공망은` 을 왼쪽에 세우고 값과 설명을 오른쪽에 붙인다. 한 문단으로
 * 흘리면 무슨 얘기인지가 문장을 읽어야 나오는데, 여기는 훑어보는 자리다.
 * 문장은 그대로 두고 자리만 갈랐다.
 */
function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="w-11 shrink-0 pt-0.5 text-xs" style={{ color: 'var(--ink-soft)' }}>
        {label}
      </span>
      <p className="min-w-0 flex-1 text-sm leading-relaxed">{children}</p>
    </div>
  )
}

/**
 * 일간 강약.
 *
 * 지수만 숫자로 내밀면 62가 어느 쪽인지 모른다. 가운데를 중화 구간으로 칠하고
 * 핀을 세워서 어디쯤인지 보이게 한다. 경계값은 계산 쪽이 정한 걸 그대로 쓴다.
 */
function StrengthGauge({ strength }: { strength: Strength }) {
  const info = strengthCopy[strength.level]

  return (
    <div>
      <p className="mb-3 flex items-baseline gap-2">
        <span
          className="serif text-2xl font-bold tabular-nums"
          style={{ color: 'var(--accent-deep)' }}
        >
          {strength.index}
        </span>
        <span className="serif text-base font-bold">{info.name}</span>
        <span className="ml-auto text-11" style={{ color: 'var(--ink-soft)' }}>
          {personalCopy.strengthKind}
        </span>
      </p>

      <div
        className="gauge"
        style={
          {
            '--gauge-low': `${STRENGTH_THRESHOLD.weak}%`,
            '--gauge-high': `${100 - STRENGTH_THRESHOLD.strong}%`,
            '--gauge-at': `${strength.index}%`,
          } as CSSProperties
        }
      >
        <span aria-hidden="true" className="gauge-mid" />
        <span aria-hidden="true" className="gauge-pin" />
      </div>

      {/* 눈금 이름. 지수와 판정은 바로 위에서 이미 말로 읽어준다 */}
      <p
        aria-hidden="true"
        className="mt-2 flex justify-between text-11"
        style={{ color: 'var(--ink-soft)' }}
      >
        <span>
          {strengthCopy.weak.name} {STRENGTH_THRESHOLD.weak}
        </span>
        <span>{strengthCopy.balanced.name}</span>
        <span>
          {STRENGTH_THRESHOLD.strong} {strengthCopy.strong.name}
        </span>
      </p>

      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {info.note}
      </p>
    </div>
  )
}

function Chevron() {
  return (
    <svg
      className="chevron"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--ink-soft)' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
