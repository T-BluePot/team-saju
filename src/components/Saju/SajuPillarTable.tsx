import type { CSSProperties, ReactNode } from 'react'

import { ELEMENT_LABEL, STEM_ELEMENT, STRONG_STAGES } from '../../lib/saju/constants'
import type { Pillar, SajuChart } from '../../lib/saju/types'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'
import { personalCopy, sajuCopy } from '../../lib/copy'

const KIND_LABEL: Record<Pillar['kind'], string> = {
  year: '연주',
  month: '월주',
  day: '일주',
  hour: '시주',
}

/** 이름 칸 하나에 기둥 넷 */
const COLUMNS = 'auto repeat(4, minmax(0, 1fr))'

/** 일주 칸을 위아래로 잇는 물 */
const DAY_WASH = 'var(--accent-wash)'

/**
 * 명식표.
 *
 * 전에는 기둥 하나가 카드 하나였고 그 안에 이름 없는 줄이 넷 쌓였다.
 * 375px 에서 칸이 62px 라 십신도 지장간도 단계도 납음도 전부 10px 회색으로
 * 비슷하게 보였고, 어느 줄이 뭔지는 밑의 안내문을 읽고 세어봐야 알았다.
 *
 * 줄에 이름을 붙였다. 여덟 글자는 위에서 크게 보여주고, 나머지는 이름 붙은
 * 줄로 내린다. 기둥 넷과 같은 격자를 써서 세로줄이 그대로 맞는다.
 */
export function SajuPillarTable({ pillars }: { pillars: SajuChart['pillars'] }) {
  const list = [pillars.year, pillars.month, pillars.day, pillars.hour]

  return (
    <div className="grid gap-x-1" style={{ gridTemplateColumns: COLUMNS }}>
      <Cell />
      {list.map((p, i) => (
        <Cell key={i} day={i === 2} className="pt-2 text-11" top>
          <span style={{ color: i === 2 ? 'var(--accent-deep)' : 'var(--ink-soft)' }}>
            {KIND_LABEL[p?.kind ?? 'hour']}
          </span>
        </Cell>
      ))}

      {/* 천간과 지지. 이 여덟 글자를 보러 오는 화면이라 제일 크다 */}
      <Cell />
      {list.map((p, i) => (
        <Cell key={i} day={i === 2} className="text-3xl font-bold leading-tight">
          {p ? (
            <span style={{ color: ELEMENT_COLOR[STEM_ELEMENT[p.stem]] }}>{p.stem}</span>
          ) : (
            <span className="text-sm font-normal" style={{ color: 'var(--ink-soft)' }}>
              {sajuCopy.hourUnknownLabel}
            </span>
          )}
        </Cell>
      ))}

      <Cell />
      {list.map((p, i) => (
        <Cell key={i} day={i === 2} className="pb-2 text-3xl font-bold leading-tight">
          {p ? (
            p.branch
          ) : (
            <span className="text-sm font-normal" style={{ color: 'var(--ink-soft)' }}>
              {sajuCopy.hourUnknownValue}
            </span>
          )}
        </Cell>
      ))}

      {/*
        여덟 글자와 그 아래 부속 정보를 가르는 한 줄. 줄마다 그으면 한 블록 안에
        선이 넷이 되고, 정작 표가 어디서 끝나는지가 안 보인다. 줄 구별은 이미
        왼쪽 이름이 하고 있다
      */}
      <Rule />

      <Row
        label="십신"
        values={list.map((p) =>
          p ? (p.stemGod ?? `일간 ${ELEMENT_LABEL[STEM_ELEMENT[p.stem]]}`) : null,
        )}
      />
      <Row label="지장간" values={list.map((p) => p?.hiddenStems.join(' ') ?? null)} />
      <Row
        label={personalCopy.stageLabel}
        values={list.map((p) => p?.stage ?? null)}
        // 힘이 센 단계만 짚는다. 좋고 나쁨이 아니라 어느 단계인지를 보여주는 값이다
        strongAt={list.map((p) => (p ? STRONG_STAGES.has(p.stage) : false))}
      />
      <Row label="납음" values={list.map((p) => p?.naYin ?? null)} last />
    </div>
  )
}

/** 줄 사이를 긋는 점선. 격자 전체를 가로지른다 */
function Rule() {
  return (
    <span
      aria-hidden="true"
      className="col-span-full"
      style={{ borderTop: '1px dashed var(--rule-faint)' }}
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
      <Cell className="py-1.5 pr-1 text-left text-10">
        <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
      </Cell>
      {values.map((v, i) => (
        <Cell key={i} day={i === 2} className="py-1.5 text-10" bottom={last}>
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
 * 일주 칸은 물을 들여 세로로 이어 보이게 한다. 테두리로 두르면 줄 사이 간격만큼
 * 끊기고, 표 안에 상자가 하나 떠 있는 것처럼 읽힌다.
 */
function Cell({
  children,
  day = false,
  top = false,
  bottom = false,
  className = '',
}: {
  children?: ReactNode
  day?: boolean
  top?: boolean
  bottom?: boolean
  className?: string
}) {
  const style: CSSProperties = day
    ? {
        background: DAY_WASH,
        borderTopLeftRadius: top ? 8 : undefined,
        borderTopRightRadius: top ? 8 : undefined,
        borderBottomLeftRadius: bottom ? 8 : undefined,
        borderBottomRightRadius: bottom ? 8 : undefined,
      }
    : {}

  return (
    <div className={['text-center', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
