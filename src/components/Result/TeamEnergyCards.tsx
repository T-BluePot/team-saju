import { CommonSection } from '../Common'
import { energyCards } from '../../lib/report/energy'
import { BALANCED_ARCHETYPE_ID } from '../../lib/saju/team'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'
import { energyCardsCopy } from '../../lib/copy'

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

  /*
   * 균형형은 채울 데도 덜 데도 없다. 억지로 네 장을 만들면 같은 말이 두 번 나온다.
   *
   * `dominant === lacking` 을 보면 안 된다. 균형 판정은 대부분 balance 점수에서 나오고
   * 그때도 dominant 와 lacking 은 서로 다르다. 그 조건만 막으면 균형형인데도 섹션이 그려져서,
   * 바로 위에서 "이미 다 있습니다" 라고 해놓고 아래에서 "제일 없는 게 금입니다" 가 된다.
   */
  if (report.archetype.id === BALANCED_ARCHETYPE_ID) return null

  const cards = energyCards(dominant, lacking)

  return (
    <CommonSection
      index={energyCardsCopy.index}
      title={energyCardsCopy.title}
      subtitle={energyCardsCopy.subtitle}
    >
      <div
        // scroll-pl 이 없으면 스냅이 첫 카드를 스크롤포트 시작에 붙여서 왼쪽 여백을 먹는다
        className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-3 overflow-x-auto px-6 pb-2 sm:-mx-7 sm:scroll-pl-7 sm:px-7"
        tabIndex={0}
        role="group"
        aria-label={energyCardsCopy.carousel}
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
        {energyCardsCopy.note}
      </p>
    </CommonSection>
  )
}
