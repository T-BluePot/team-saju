import { useState } from 'react'
import type { CSSProperties } from 'react'

import { CommonSection, CommonSegmented } from '../Common'
import { energyCards } from '../../lib/report/energy'
import type { EnergyCard } from '../../lib/report/energy'
import { BALANCED_ARCHETYPE_ID } from '../../lib/saju/team'
import type { TeamReport } from '../../lib/report/teamReport'
import { ELEMENT_COLOR, ELEMENT_COLOR_DEEP, illustForEnergy } from '../../lib/ui/elementStyle'
import { energyCardsCopy, resultCopy } from '../../lib/copy'

type EnergySet = 'good' | 'full'

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
  const [set, setSet] = useState<EnergySet>('good')

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

  const tabs: Array<[EnergySet, string]> = [
    ['good', energyCardsCopy.tabGood],
    ['full', energyCardsCopy.tabFull],
  ]

  return (
    <CommonSection
      index={energyCardsCopy.index}
      title={energyCardsCopy.title}
      subtitle={energyCardsCopy.subtitle}
    >
      <CommonSegmented
        label={energyCardsCopy.carousel}
        value={set}
        options={tabs}
        onChange={setSet}
      />

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
  const illust = illustForEnergy(card.element, card.strength)

  return (
    <article
      className="flex flex-col rounded-xl pb-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
    >
      <div
        className="energy-face"
        style={
          {
            '--energy-face': `color-mix(in srgb, ${ELEMENT_COLOR[card.element]} 9%, var(--surface))`,
            '--energy-seal': ELEMENT_COLOR_DEEP[card.element],
          } as CSSProperties
        }
      >
        {/* 오행 도장. 그림만 있으면 어느 기운 얘기인지가 제목을 읽어야 나온다 */}
        <span aria-hidden="true" className="serif energy-seal">
          {card.element}
        </span>
        <img src={illust.src} alt={illust.alt} loading="lazy" />
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

        {/*
          겹치는 기운 쪽에만 붙는 단서. 다른 자리의 處 딱지와 달리 면을 안 깐다.
          "그래도 데려오려면" 이라는 말이라 본문보다 낮게 깔려야 하는데,
          상자를 두르면 본문보다 눈에 먼저 든다
        */}
        {card.fix && (
          <p className="energy-rx text-10" style={{ color: 'var(--ink-soft)' }}>
            <span aria-hidden="true" className="dot serif">
              {resultCopy.prescriptionMark}
            </span>
            <span>{card.fix}</span>
          </p>
        )}
      </div>
    </article>
  )
}
