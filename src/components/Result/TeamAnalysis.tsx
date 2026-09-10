import { useEffect, useRef, useState } from 'react'

import { CommonBlock, CommonEntry, CommonEntryList, CommonSection } from '../Common'
import { SajuElementBars, SajuElementRadar, SajuTraitBars } from '../Saju'
import { readTraits } from '../../lib/report/traits'
import { useCountUp, useReveal } from '../../lib/ui/useReveal'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR_DEEP, FLAG_LABEL } from '../../lib/ui/elementStyle'
import { analysisCopy, resultCopy } from '../../lib/copy'
import { and, subject } from '../../lib/text/josa'

/** 팝오버가 저절로 닫히기까지 */
const HELP_MS = 3200

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

        <div ref={balanceRef} className="mt-5">
          <BalanceScore value={balanceValue} />
        </div>
      </CommonBlock>

      <CommonBlock label={analysisCopy.noticeBlock}>
        <CommonEntryList divided>
          <CommonEntry
            mark={dominant.element}
            markLabel={ELEMENT_LABEL[dominant.element]}
            markColor={ELEMENT_COLOR_DEEP[dominant.element]}
            title={FLAG_LABEL[analysis.flags[dominant.element]]}
            value={`${dominant.percent}%`}
          >
            {dominant.meaning}
          </CommonEntry>
          <CommonEntry
            mark={lacking.element}
            markLabel={ELEMENT_LABEL[lacking.element]}
            markColor={ELEMENT_COLOR_DEEP[lacking.element]}
            title={FLAG_LABEL[analysis.flags[lacking.element]]}
            value={`${lacking.percent}%`}
          >
            {lacking.effect}
          </CommonEntry>
        </CommonEntryList>
      </CommonBlock>

      <CommonBlock
        label={solo ? analysisCopy.traitsHeadingSolo : analysisCopy.traitsHeadingTeam}
        description={solo ? analysisCopy.traitsNoteSolo : analysisCopy.traitsNoteTeam}
      >
        <div className="mb-8">
          {/* 고르게 나온 팀은 짚을 축이 없다. 억지로 두 개를 굵게 하면 배열 순서가 새어 나온다 */}
          <SajuTraitBars
            traits={analysis.traits}
            strong={reading.even ? undefined : reading.topAxes}
            weak={reading.even ? undefined : reading.bottomAxes}
          />
        </div>

        {reading.even ? (
          <p className="text-sm leading-relaxed">{analysisCopy.even}</p>
        ) : (
          <CommonEntryList>
            <CommonEntry
              mark={analysisCopy.thickMark}
              markColor="var(--strong-deep)"
              title={and(reading.topAxes)}
              value={`${analysis.traits[reading.topAxes[0]]}%`}
              valueColor="var(--strong-deep)"
            >
              <b>{and(reading.topAxes)}</b>
              {josaOf(reading.topAxes)} {analysisCopy.thickSuffix} {reading.strength}
            </CommonEntry>
            <CommonEntry
              mark={analysisCopy.thinMark}
              markColor="var(--weak-deep)"
              title={and(reading.bottomAxes)}
              value={`${analysis.traits[reading.bottomAxes[0]]}%`}
              valueColor="var(--weak-deep)"
              fix={reading.fix}
              fixMark={resultCopy.prescriptionMark}
            >
              <b>{and(reading.bottomAxes)}</b>
              {josaOf(reading.bottomAxes)} {analysisCopy.thinSuffix} {reading.gap}
            </CommonEntry>
          </CommonEntryList>
        )}
      </CommonBlock>
    </CommonSection>
  )
}

/**
 * 균형 점수와 도움말.
 *
 * 도움말은 눌러서 열고 저절로 닫힌다. 닫으려고 다시 눌러야 하면 열어본
 * 사람이 한 번 더 일해야 한다. 한 문장 읽고 사라지면 되는 자리다.
 */
function BalanceScore({ value }: { value: number }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    timer.current = window.setTimeout(() => setOpen(false), HELP_MS)
    return () => window.clearTimeout(timer.current)
  }, [open])

  return (
    <div className="relative flex items-center gap-3">
      <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {analysisCopy.balanceLabel}
      </span>
      <span className="serif ml-auto text-base font-bold" style={{ color: 'var(--accent-deep)' }}>
        <span className="text-2xl tabular-nums">{value}</span>
        {analysisCopy.balanceUnit}
      </span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={analysisCopy.balanceHelp}
        className="press grid size-3.5 shrink-0 self-start place-items-center rounded-full text-10 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          border: '1px solid var(--rule)',
          color: 'var(--ink-soft)',
          outlineColor: 'var(--accent)',
        }}
      >
        <span aria-hidden="true">?</span>
      </button>
      <p
        role="status"
        aria-hidden={!open}
        className="pointer-events-none absolute bottom-full right-0 mb-2 w-52 rounded-xl px-3 py-2 text-xs leading-relaxed transition-opacity duration-200"
        style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          opacity: open ? 1 : 0,
        }}
      >
        {analysisCopy.balanceHelp}
      </p>
    </div>
  )
}
