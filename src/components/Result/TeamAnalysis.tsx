import { useState } from 'react'

import { CommonBlock, CommonSection } from '../Common'
import { SajuElementBars, SajuElementRadar, SajuTraitBars } from '../Saju'
import { readTraits } from '../../lib/report/traits'
import { useCountUp, useReveal } from '../../lib/ui/useReveal'
import type { TeamReport } from '../../lib/report/teamReport'
import type { Element } from '../../lib/saju/types'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR, FLAG_LABEL } from '../../lib/ui/elementStyle'
import { analysisCopy } from '../../lib/copy'
import { and, subject } from '../../lib/text/josa'

/**
 * 축 이름 뒤에 붙는 이/가.
 *
 * 이름은 굵게 나가고 조사는 안 굵어서 `<b>` 밖에 둬야 한다. `subject()` 가
 * 붙여준 조사만 떼어 쓴다. 지금 다섯 축은 전부 받침이 있지만 축이 늘면 갈린다.
 */
function josaOf(axes: string[]): string {
  const joined = and(axes)
  return subject(joined).slice(joined.length)
}

export function TeamAnalysis({ report }: { report: TeamReport }) {
  const { analysis, dominant, lacking } = report
  const reading = readTraits(analysis.traits)
  const solo = analysis.size === 1
  const { ref: balanceRef, shown: balanceShown } = useReveal<HTMLDivElement>()
  const balanceValue = useCountUp(analysis.balance, balanceShown)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <CommonSection
      index={analysisCopy.index}
      title={analysisCopy.title}
      subtitle={solo ? analysisCopy.subtitleSolo : analysisCopy.subtitleTeam}
    >
      <CommonBlock label={analysisCopy.elementsBlock} first>
        <div className="flex flex-col items-center gap-7 sm:flex-row">
          <SajuElementRadar percents={analysis.elements.percents} size={230} />
          <div className="w-full flex-1">
            <SajuElementBars percents={analysis.elements.percents} flags={analysis.flags} />
          </div>
        </div>

        {/*
          점수는 오른쪽 끝에 두고 설명은 물음표 뒤로 보낸다. 라벨 옆에 설명이
          늘 붙어 있으면 한 줄이 길어져 정작 숫자가 안 보인다.
        */}
        <div ref={balanceRef} className="relative mt-5 flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            {analysisCopy.balanceLabel}
          </span>
          <span className="serif ml-auto text-base" style={{ color: 'var(--accent-deep)' }}>
            <span className="text-2xl tabular-nums">{balanceValue}</span>
            {analysisCopy.balanceUnit}
          </span>
          <button
            type="button"
            onClick={() => setHelpOpen((v) => !v)}
            aria-expanded={helpOpen}
            aria-label={analysisCopy.balanceHelp}
            className="press grid size-5 shrink-0 place-items-center rounded-full text-11 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              border: '1px solid var(--rule)',
              color: 'var(--ink-soft)',
              outlineColor: 'var(--accent)',
            }}
          >
            <span aria-hidden="true">?</span>
          </button>
          {helpOpen && (
            <p
              role="status"
              className="absolute bottom-full right-0 z-20 mb-2 w-52 rounded-xl px-3 py-2 text-xs leading-relaxed"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              {analysisCopy.balanceHelp}
            </p>
          )}
        </div>
      </CommonBlock>

      <CommonBlock label={analysisCopy.noticeBlock}>
        <Notice
          element={dominant.element}
          state={FLAG_LABEL[analysis.flags[dominant.element]]}
          percent={dominant.percent}
          note={dominant.meaning}
          first
        />
        <Notice
          element={lacking.element}
          state={FLAG_LABEL[analysis.flags[lacking.element]]}
          percent={lacking.percent}
          note={lacking.effect}
        />
      </CommonBlock>

      <CommonBlock
        label={solo ? analysisCopy.traitsHeadingSolo : analysisCopy.traitsHeadingTeam}
        description={solo ? analysisCopy.traitsNoteSolo : analysisCopy.traitsNoteTeam}
      >
        <div className="mb-8">
          {/* 고르게 나온 팀은 짚을 축이 없다. 억지로 두 개를 굵게 하면 배열 순서가 새어 나온다 */}
          <SajuTraitBars
            traits={analysis.traits}
            highlight={reading.even ? undefined : [...reading.topAxes, ...reading.bottomAxes]}
          />
        </div>

        {reading.even ? (
          <p className="text-sm leading-relaxed">{analysisCopy.even}</p>
        ) : (
          <div className="flex flex-col gap-6">
            <Reading
              mark={analysisCopy.thickMark}
              markColor="var(--strong-deep)"
              axes={reading.topAxes}
              percent={analysis.traits[reading.topAxes[0]]}
              suffix={analysisCopy.thickSuffix}
              body={reading.strength}
            />
            <Reading
              mark={analysisCopy.thinMark}
              markColor="var(--weak-deep)"
              axes={reading.bottomAxes}
              percent={analysis.traits[reading.bottomAxes[0]]}
              suffix={analysisCopy.thinSuffix}
              body={reading.gap}
              fix={reading.fix}
            />
          </div>
        )}
      </CommonBlock>
    </CommonSection>
  )
}

/** 눈에 띄는 오행 한 줄. 한자와 상태와 비율을 한 줄에 두고 설명을 아래 붙인다 */
function Notice({
  element,
  state,
  percent,
  note,
  first = false,
}: {
  element: Element
  state: string
  percent: number
  note: string
  first?: boolean
}) {
  return (
    <div
      className={first ? 'pb-2' : 'pt-2'}
      style={first ? undefined : { borderTop: '1px dashed var(--rule-faint)' }}
    >
      <p className="mb-3 flex items-center gap-2">
        <span
          className="serif text-base font-bold leading-none"
          style={{ color: ELEMENT_COLOR[element] }}
        >
          <span aria-hidden="true">{element}</span>
          <span className="sr-only">{ELEMENT_LABEL[element]}</span>
        </span>
        <span className="serif text-base font-bold leading-tight">{state}</span>
        <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>
          {percent}%
        </span>
      </p>
      <p className="text-sm leading-relaxed">{note}</p>
    </div>
  )
}

/** 축 해설 한 덩어리. 머리줄에 배지와 축 이름과 비율, 아래에 문장 */
function Reading({
  mark,
  markColor,
  axes,
  percent,
  suffix,
  body,
  fix,
}: {
  mark: string
  markColor: string
  axes: string[]
  percent: number
  suffix: string
  body: string
  fix?: string
}) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2">
        <span className="serif text-base font-bold leading-none" style={{ color: markColor }}>
          {mark}
        </span>
        <span className="serif text-base font-bold">{and(axes)}</span>
        <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>
          {percent}%
        </span>
      </p>
      <p className="text-sm leading-relaxed">
        <b>{and(axes)}</b>
        {josaOf(axes)} {suffix} {body}
      </p>
      {fix && (
        <div className="mt-3 flex items-start gap-2.5">
          <span
            className="serif mt-px grid size-5 shrink-0 place-items-center rounded-full text-10 font-bold leading-none"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            {analysisCopy.prescriptionMark}
          </span>
          <p className="text-11 leading-relaxed" style={{ color: 'var(--ink-faint)' }}>
            {fix}
          </p>
        </div>
      )}
    </div>
  )
}
