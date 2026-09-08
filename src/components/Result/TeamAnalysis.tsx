import { CommonSection, CommonWell } from '../Common'
import { SajuElementBars, SajuElementRadar, SajuTraitBars } from '../Saju'
import { readTraits } from '../../lib/report/traits'
import { useCountUp, useReveal } from '../../lib/ui/useReveal'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'
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

  return (
    <CommonSection
      index={analysisCopy.index}
      title={analysisCopy.title}
      subtitle={solo ? analysisCopy.subtitleSolo : analysisCopy.subtitleTeam}
    >
      <div className="flex flex-col items-center gap-7 sm:flex-row">
        <SajuElementRadar percents={analysis.elements.percents} size={230} />
        <div className="w-full flex-1">
          <SajuElementBars percents={analysis.elements.percents} flags={analysis.flags} />
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Stat
          title={analysisCopy.excess}
          value={`${dominant.element} ${ELEMENT_LABEL[dominant.element]} ${dominant.percent}%`}
          note={dominant.meaning}
          color={ELEMENT_COLOR[dominant.element]}
        />
        <Stat
          title={analysisCopy.lacking}
          value={`${lacking.element} ${ELEMENT_LABEL[lacking.element]} ${lacking.percent}%`}
          note={lacking.effect}
          color={ELEMENT_COLOR[lacking.element]}
        />
      </div>

      <div
        ref={balanceRef}
        className="mt-3 flex items-baseline gap-3 rounded-xl px-4 py-3"
        style={{ background: 'var(--paper-deep)' }}
      >
        <span
          className="serif text-2xl font-bold tabular-nums"
          style={{ color: 'var(--accent-deep)' }}
        >
          {balanceValue}
        </span>
        <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          {analysisCopy.balanceNote}
        </span>
      </div>

      <h4 className="serif mt-8 text-base font-bold">
        {solo ? analysisCopy.traitsHeadingSolo : analysisCopy.traitsHeadingTeam}
      </h4>
      <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
        {solo ? analysisCopy.traitsNoteSolo : analysisCopy.traitsNoteTeam}
      </p>
      <div className="mt-3.5">
        {/* 고르게 나온 팀은 짚을 축이 없다. 억지로 두 개를 굵게 하면 배열 순서가 새어 나온다 */}
        <SajuTraitBars
          traits={analysis.traits}
          highlight={
            reading.even ? undefined : [...reading.topAxes, ...reading.bottomAxes]
          }
        />
      </div>

      {reading.even ? (
        <p className="mt-4 text-sm leading-relaxed">
          {analysisCopy.even}
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm leading-relaxed">
            <b>{and(reading.topAxes)}</b>
            {josaOf(reading.topAxes)}
            {analysisCopy.thickSuffix} {reading.strength}
          </p>
          <div>
            <p className="text-sm leading-relaxed">
              <b>{and(reading.bottomAxes)}</b>
              {josaOf(reading.bottomAxes)}
              {analysisCopy.thinSuffix} {reading.gap}
            </p>
            <p
              className="mt-1.5 border-l-2 pl-3 text-sm leading-relaxed"
              style={{ borderColor: 'var(--accent)', color: 'var(--ink-soft)' }}
            >
              {reading.fix}
            </p>
          </div>
        </div>
      )}
    </CommonSection>
  )
}

function Stat({
  title,
  value,
  note,
  color,
}: {
  title: string
  value: string
  note: string
  color: string
}) {
  return (
    <CommonWell>
      <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
        {title}
      </p>
      <p className="serif mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
        {note}
      </p>
    </CommonWell>
  )
}
