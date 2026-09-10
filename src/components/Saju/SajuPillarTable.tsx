import type { CSSProperties, ReactNode } from 'react'

import {
  BRANCH_ELEMENT,
  BRANCH_KO,
  ELEMENT_LABEL,
  STEM_ELEMENT,
  STEM_KO,
  STRONG_STAGES,
} from '../../lib/saju/constants'
import type { Element, Pillar, SajuChart } from '../../lib/saju/types'
import { ELEMENT_COLOR_DEEP } from '../../lib/ui/elementStyle'
import { personalCopy, sajuCopy } from '../../lib/copy'

const KIND_LABEL: Record<Pillar['kind'], string> = {
  year: '연주',
  month: '월주',
  day: '일주',
  hour: '시주',
}

/** 일주는 셋째 칸이다 */
const DAY = 2

/**
 * 일주 열에 아주 옅게 깔리는 물.
 *
 * 진하게 깔면 넷 중 하나가 눌린 버튼처럼 보인다. 실제로 그랬다.
 * 중요하다는 건 알리되 고를 수 있는 것처럼 보이면 안 된다.
 */
const DAY_WASH = 'color-mix(in srgb, var(--accent) 5%, var(--surface))'

/**
 * 명식표.
 *
 * 기둥 넷을 가로로 비교하는 표다. 세로줄은 안 긋는다. 격자를 다 그으면
 * 스프레드시트가 되고, 정작 눈이 따라가야 할 가로 줄이 안 보인다.
 *
 * 여덟 글자 밑에 음과 오행을 같이 적는다. 처음 보는 사람에게 `庚` 은 읽을
 * 수조차 없는 표시인데, 그게 화면에서 제일 큰 글자면서 아무것도 안 알려줬다.
 */
export function SajuPillarTable({ pillars }: { pillars: SajuChart['pillars'] }) {
  const list = [pillars.year, pillars.month, pillars.day, pillars.hour]

  return (
    <div className="chart-grid">
      {/* 기둥 이름 */}
      <Cell />
      {list.map((p, i) => (
        <Cell key={i} col={i} className="chart-name pb-1.5 pt-2.5" top>
          <span
            style={{
              color: i === DAY ? 'var(--accent-deep)' : 'var(--ink-soft)',
              fontWeight: i === DAY ? 700 : undefined,
            }}
          >
            {KIND_LABEL[p?.kind ?? 'hour']}
          </span>
        </Cell>
      ))}

      {/* 천간과 지지. 이 여덟 글자를 보러 오는 화면이라 제일 크다 */}
      <Glyphs
        list={list}
        pick={(p) => p.stem}
        sound={(p) => STEM_KO[p.stem]}
        element={(p) => STEM_ELEMENT[p.stem]}
        fallback={sajuCopy.hourUnknownLabel}
      />
      <Glyphs
        list={list}
        pick={(p) => p.branch}
        sound={(p) => BRANCH_KO[p.branch]}
        element={(p) => BRANCH_ELEMENT[p.branch]}
        fallback={sajuCopy.hourUnknownValue}
      />

      <Rule />

      <Row
        label="십신"
        values={list.map((p) =>
          p ? (p.stemGod ?? `일간 ${ELEMENT_LABEL[STEM_ELEMENT[p.stem]]}`) : null,
        )}
      />
      <Rule />
      <Row label="지장간" values={list.map((p) => p?.hiddenStems.join(' ') ?? null)} />
      <Rule />
      <Row
        label={personalCopy.stageLabel}
        values={list.map((p) => p?.stage ?? null)}
        // 힘이 센 단계만 짚는다. 좋고 나쁨이 아니라 어느 단계인지를 보여주는 값이다
        strongAt={list.map((p) => (p ? STRONG_STAGES.has(p.stage) : false))}
      />
      <Rule />
      <Row label="납음" values={list.map((p) => p?.naYin ?? null)} last />
    </div>
  )
}

/**
 * 한자 한 줄과 그 밑의 음 · 오행.
 *
 * 음은 한자 크기를 따라 커지지 않는다. 커지면 부가 정보가 열 너비를 정하게 되고
 * 320px 에서 기둥 넷이 안 들어간다.
 */
function Glyphs({
  list,
  pick,
  sound,
  element,
  fallback,
}: {
  list: Array<Pillar | null>
  pick: (p: Pillar) => string
  sound: (p: Pillar) => string
  element: (p: Pillar) => Element
  fallback: string
}) {
  return (
    <>
      <Cell />
      {list.map((p, i) => (
        <Cell key={i} col={i} className="pb-3">
          {p ? (
            <>
              <span
                className="chart-glyph serif block font-bold"
                style={{ color: ELEMENT_COLOR_DEEP[element(p)] }}
              >
                {pick(p)}
              </span>
              <span className="chart-sound block" style={{ color: 'var(--ink-soft)' }}>
                {sound(p)} · {ELEMENT_LABEL[element(p)]}
              </span>
            </>
          ) : (
            <span className="chart-value block py-5" style={{ color: 'var(--ink-soft)' }}>
              {fallback}
            </span>
          )}
        </Cell>
      ))}
    </>
  )
}

/** 줄 사이 한 올. 세로줄을 안 그으니 이게 가로 줄을 잡아준다 */
function Rule() {
  return (
    <span
      aria-hidden="true"
      className="col-span-full"
      style={{ borderTop: '1px solid var(--rule-faint)' }}
    />
  )
}

function Row({
  label,
  values,
  strongAt,
  last = false,
}: {
  label: string
  values: Array<string | null>
  strongAt?: boolean[]
  /** 마지막 줄만 일주 물의 아래 모서리를 둥글린다 */
  last?: boolean
}) {
  return (
    <>
      <Cell className="chart-name py-2 pr-1.5 text-left">
        <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
      </Cell>
      {values.map((v, i) => (
        <Cell key={i} col={i} className="chart-value py-2" bottom={last}>
          <span
            style={{
              color: strongAt?.[i] ? 'var(--accent-deep)' : 'var(--ink)',
              fontWeight: strongAt?.[i] ? 600 : undefined,
            }}
          >
            {v}
          </span>
        </Cell>
      ))}
    </>
  )
}

/**
 * 칸 하나.
 *
 * 일주 칸만 물을 들여 위아래로 이어 보이게 한다. 테두리로 두르면 줄 사이에서
 * 끊기고, 표 안에 상자가 하나 떠 있는 것처럼 읽힌다.
 */
function Cell({
  children,
  col,
  top = false,
  bottom = false,
  className = '',
}: {
  children?: ReactNode
  /** 몇 번째 기둥인가. 이름 칸에는 안 넘긴다 */
  col?: number
  top?: boolean
  bottom?: boolean
  className?: string
}) {
  const style: CSSProperties =
    col === DAY
      ? {
          background: DAY_WASH,
          borderTopLeftRadius: top ? 6 : undefined,
          borderTopRightRadius: top ? 6 : undefined,
          borderBottomLeftRadius: bottom ? 6 : undefined,
          borderBottomRightRadius: bottom ? 6 : undefined,
        }
      : {}

  return (
    <div className={['text-center', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
