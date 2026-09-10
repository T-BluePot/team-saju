import { useState } from 'react'
import type { CSSProperties } from 'react'

import { CommonPrescription, CommonSection } from '../Common'
import { energyCards } from '../../lib/report/energy'
import type { EnergyCard } from '../../lib/report/energy'
import { BALANCED_ARCHETYPE_ID } from '../../lib/saju/team'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_COLOR, ELEMENT_COLOR_DEEP } from '../../lib/ui/elementStyle'
import { energyCardsCopy, resultCopy } from '../../lib/copy'

type Set = 'good' | 'full'

/**
 * 데려오면 좋은 기운, 지금은 안 되는 기운.
 *
 * 결과를 다 읽고 나면 "그래서 누굴 데려와야 되는데" 가 남는데 그 답이 한 줄뿐이었다.
 *
 * 넉 장을 좌우로 넘겨보게 뒀더니 어느 게 좋은 쪽이고 어느 게 넘치는 쪽인지가
 * 카드를 다 읽어야 나왔다. 두 묶음으로 갈라 한 번에 한 묶음만 보여준다.
 *
 * 실제로 입력한 팀원을 줄 세우지 않는다. 여기 나오는 건 아직 팀에 없는 가상의 기운이다.
 */
export function TeamEnergyCards({ report }: { report: TeamReport }) {
  const { dominant, lacking } = report.analysis.elements
  const [set, setSet] = useState<Set>('good')

  /*
   * 균형형은 채울 데도 덜 데도 없다. 억지로 네 장을 만들면 같은 말이 두 번 나온다.
   *
   * `dominant === lacking` 을 보면 안 된다. 균형 판정은 대부분 balance 점수에서 나오고
   * 그때도 dominant 와 lacking 은 서로 다르다. 그 조건만 막으면 균형형인데도 섹션이 그려져서,
   * 바로 위에서 "이미 다 있습니다" 라고 해놓고 아래에서 "제일 없는 게 금입니다" 가 된다.
   */
  if (report.archetype.id === BALANCED_ARCHETYPE_ID) return null

  const cards = energyCards(dominant, lacking)
  const shown = cards.filter((c) => (set === 'good' ? c.good : !c.good))

  const tabs: Array<[Set, string]> = [
    ['good', energyCardsCopy.tabGood],
    ['full', energyCardsCopy.tabFull],
  ]

  return (
    <CommonSection
      index={energyCardsCopy.index}
      title={energyCardsCopy.title}
      subtitle={energyCardsCopy.subtitle}
    >
      <div className="energy-seg" role="group" aria-label={energyCardsCopy.carousel}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={set === key}
            onClick={() => setSet(key)}
            className="press text-xs font-semibold"
            style={{ color: set === key ? 'var(--ink)' : 'var(--ink-soft)' }}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="my-4 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {set === 'good' ? energyCardsCopy.note : energyCardsCopy.noteFull}
      </p>

      <div className="energy-cards">
        {shown.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </CommonSection>
  )
}

function Card({ card }: { card: EnergyCard }) {
  return (
    <article
      className="flex flex-col rounded-xl pb-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
    >
      {/*
        일러스트가 들어갈 자리다. 오행별 그림이 아직 없어서 한자를 크게 놓는다.
        `public/illust` 의 여섯 장은 전부 결핍 오행을 그린 거라 여기 쓰면
        금 카드에 결재 서류 산더미가 들어간다
      */}
      <div
        className="energy-face"
        style={
          {
            '--energy-face': `color-mix(in srgb, ${ELEMENT_COLOR[card.element]} 9%, var(--surface))`,
          } as CSSProperties
        }
      >
        <span
          aria-hidden="true"
          className="serif text-4xl font-bold leading-none"
          style={{ color: ELEMENT_COLOR_DEEP[card.element] }}
        >
          {card.element}
        </span>
      </div>

      <div className="energy-plate">
        <p className="text-11" style={{ color: 'var(--ink-soft)' }}>
          {card.title}
        </p>
        <p className="serif mt-1 text-base font-bold leading-snug">{card.nickname}</p>
      </div>

      <div className="px-3.5 pt-4">
        <p className="text-xs font-medium leading-normal">{card.effect}</p>
        <p className="mt-3.5 text-11 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {card.line}
        </p>
        {card.fix && (
          <CommonPrescription mark={resultCopy.prescriptionMark}>{card.fix}</CommonPrescription>
        )}
      </div>
    </article>
  )
}
