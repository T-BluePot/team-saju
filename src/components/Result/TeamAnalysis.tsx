import { CommonSection, CommonWell } from '../Common'
import { SajuElementBars, SajuElementRadar, SajuTraitBars } from '../Saju'
import { readTraits } from '../../lib/report/traits'
import { useCountUp, useReveal } from '../../lib/ui/useReveal'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

export function TeamAnalysis({ report }: { report: TeamReport }) {
  const { analysis, dominant, lacking } = report
  const reading = readTraits(analysis.traits)
  const solo = analysis.size === 1
  const { ref: balanceRef, shown: balanceShown } = useReveal<HTMLDivElement>()
  const balanceValue = useCountUp(analysis.balance, balanceShown)

  return (
    <CommonSection
      index="一"
      title="분석"
      subtitle={solo ? '기운을 재봤습니다' : '팀 전체의 기운을 재봤습니다'}
    >
      <div className="flex flex-col items-center gap-7 sm:flex-row">
        <SajuElementRadar percents={analysis.elements.percents} size={230} />
        <div className="w-full flex-1">
          <SajuElementBars percents={analysis.elements.percents} flags={analysis.flags} />
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Stat
          title="넘치는 기운"
          value={`${dominant.element} ${ELEMENT_LABEL[dominant.element]} ${dominant.percent}%`}
          note={dominant.meaning}
          color={ELEMENT_COLOR[dominant.element]}
        />
        <Stat
          title="비어 있는 곳"
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
          style={{ color: 'var(--accent)' }}
        >
          {balanceValue}
        </span>
        <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          균형 점수. 100이면 다섯 기운이 완전히 고른 상태입니다
        </span>
      </div>

      <h4 className="serif mt-8 text-base font-bold">
        {solo ? '일하는 방식' : '이 팀이 일하는 방식'}
      </h4>
      <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
        {solo
          ? '십신을 다섯 가지로 나눠봤습니다'
          : '팀원들의 십신을 합쳐서 다섯 가지로 나눠봤습니다'}
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
          다섯이 고르게 나왔습니다. 어느 쪽으로 일해도 되는 팀인데, 뒤집으면 이 팀만의
          방식이 없다는 뜻이기도 합니다. 분기마다 한쪽을 정해 일부러 기울여보세요
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm leading-relaxed">
            <b>{reading.topAxes.join('과 ')}</b>이 제일 두껍습니다. {reading.strength}
          </p>
          <div>
            <p className="text-sm leading-relaxed">
              <b>{reading.bottomAxes.join('과 ')}</b>이 제일 얇습니다. {reading.gap}
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
