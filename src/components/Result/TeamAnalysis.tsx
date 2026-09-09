import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { CommonBlock, CommonSection } from '../Common'
import { SajuElementBars, SajuElementRadar, SajuTraitBars } from '../Saju'
import { readTraits } from '../../lib/report/traits'
import { useCountUp, useReveal } from '../../lib/ui/useReveal'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR, FLAG_LABEL } from '../../lib/ui/elementStyle'
import { analysisCopy } from '../../lib/copy'
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
        <EntryList>
          <Entry
            mark={dominant.element}
            markLabel={ELEMENT_LABEL[dominant.element]}
            markColor={ELEMENT_COLOR[dominant.element]}
            title={FLAG_LABEL[analysis.flags[dominant.element]]}
            value={`${dominant.percent}%`}
          >
            {dominant.meaning}
          </Entry>
          <Entry
            mark={lacking.element}
            markLabel={ELEMENT_LABEL[lacking.element]}
            markColor={ELEMENT_COLOR[lacking.element]}
            title={FLAG_LABEL[analysis.flags[lacking.element]]}
            value={`${lacking.percent}%`}
          >
            {lacking.effect}
          </Entry>
        </EntryList>
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
          <EntryList>
            <Entry
              mark={analysisCopy.thickMark}
              markColor="var(--strong-deep)"
              title={and(reading.topAxes)}
              value={`${analysis.traits[reading.topAxes[0]]}%`}
            >
              <b>{and(reading.topAxes)}</b>
              {josaOf(reading.topAxes)} {analysisCopy.thickSuffix} {reading.strength}
            </Entry>
            <Entry
              mark={analysisCopy.thinMark}
              markColor="var(--weak-deep)"
              title={and(reading.bottomAxes)}
              value={`${analysis.traits[reading.bottomAxes[0]]}%`}
              fix={reading.fix}
            >
              <b>{and(reading.bottomAxes)}</b>
              {josaOf(reading.bottomAxes)} {analysisCopy.thinSuffix} {reading.gap}
            </Entry>
          </EntryList>
        )}
      </CommonBlock>
    </CommonSection>
  )
}

/**
 * 항목이 쌓이는 자리.
 *
 * 간격은 여기서만 정한다. 항목이 저마다 첫째냐 아니냐로 위아래 패딩을 다르게
 * 가지면 같은 카드 안에서 줄 간격이 자리마다 달라진다.
 */
function EntryList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>
}

/**
 * 머리줄 하나에 본문 하나.
 *
 * 오행이든 성향 축이든 생김새가 같다. `火 넘침 45%` 와 `厚 추진 38%` 는
 * 왼쪽에 한 글자 표식, 가운데 이름, 오른쪽 끝에 비율로 똑같이 읽힌다.
 * 둘을 따로 만들면 패딩이 갈라진다.
 */
function Entry({
  mark,
  markLabel,
  markColor,
  title,
  value,
  fix,
  children,
}: {
  /** 한 글자 표식. 오행 한자거나 厚 薄 이다 */
  mark: string
  /** 표식을 읽어줄 말. 오행일 때만 있다 */
  markLabel?: string
  markColor: string
  title: string
  value: string
  /** 처방. 붙는 자리에만 온다 */
  fix?: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2">
        <span
          className="serif text-base font-bold leading-none"
          style={{ color: markColor }}
        >
          <span aria-hidden={markLabel ? 'true' : undefined}>{mark}</span>
          {markLabel && <span className="sr-only">{markLabel}</span>}
        </span>
        <span className="serif text-base font-bold leading-tight">{title}</span>
        <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>
          {value}
        </span>
      </p>
      <p className="text-sm leading-relaxed">{children}</p>
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
