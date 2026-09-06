import { CommonSection } from '../Common'
import { energyCards } from '../../lib/report/energy'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'

/**
 * 데려오면 좋은 기운, 지금은 안 되는 기운.
 *
 * 결과를 다 읽고 나면 "그래서 누굴 데려와야 되는데" 가 남는데 그 답이 한 줄뿐이었다.
 * 좌우로 넘겨보게 네 장을 둔다.
 *
 * 실제로 입력한 팀원을 줄 세우지 않는다. 여기 나오는 건 아직 팀에 없는 가상의 기운이다.
 */
export function TeamEnergyCards({ report }: { report: TeamReport }) {
  const { dominant, lacking } = report.analysis.elements

  // 균형형은 채울 데도 덜 데도 없다. 억지로 네 장을 만들면 같은 말이 두 번 나온다
  if (dominant === lacking) return null

  const cards = energyCards(dominant, lacking)

  return (
    <CommonSection index="三" title="누굴 데려오면 되나" subtitle="아직 팀에 없는 기운입니다">
      <div
        className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 sm:-mx-7 sm:px-7"
        tabIndex={0}
        role="group"
        aria-label="데려오면 좋은 기운과 지금은 안 되는 기운"
      >
        {cards.map((card) => (
          <article
            key={card.id}
            className="flex w-[15.5rem] shrink-0 snap-start flex-col gap-3 rounded-2xl p-5"
            style={{
              background: card.good ? 'var(--accent-wash)' : 'var(--paper-deep)',
              border: '1px solid var(--rule)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: ELEMENT_COLOR[card.element] }}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold">{card.title}</span>
            </div>

            <p className="serif text-lg font-bold leading-snug">{card.nickname}</p>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {card.line}
            </p>

            <p className="text-sm leading-relaxed">{card.effect}</p>

            {card.fix && (
              <p
                className="mt-auto border-l-2 pl-3 text-sm leading-relaxed"
                style={{ borderColor: 'var(--accent)', color: 'var(--ink-soft)' }}
              >
                {card.fix}
              </p>
            )}
          </article>
        ))}
      </div>

      <p className="mt-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
        지금 팀원을 두고 하는 얘기가 아닙니다. 아직 없는 기운을 말합니다
      </p>
    </CommonSection>
  )
}
