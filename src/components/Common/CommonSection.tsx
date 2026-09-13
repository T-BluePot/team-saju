import { Children, Fragment } from 'react'
import type { ReactNode } from 'react'

import { CommonCard } from './CommonCard'
import { CommonFieldLabel } from './CommonField'

/**
 * 번호를 붙인 섹션. 결과 화면의 분석, 상세 보고서처럼
 * 순서가 있는 덩어리에 쓴다.
 */
export function CommonSection({
  index,
  title,
  subtitle,
  flush = false,
  children,
}: {
  /** 一 二 三 같은 한자 번호 */
  index?: string
  title: string
  subtitle?: string
  /** 안쪽 여백을 카드가 주지 않는다. 공유처럼 버튼이 모서리에 붙는 자리가 쓴다 */
  flush?: boolean
  children: ReactNode
}) {
  return (
    <section>
      {/*
        번호와 제목은 한 줄, 부제는 제목의 시작선에 걸어 아래로 내린다.
        셋을 한 줄로 이으면 제목과 부제가 같은 무게로 읽히고, 좁은 화면에서
        줄바꿈 자리가 제멋대로 잡혀 부제가 번호 아래로 흐른다.
      */}
      <div
        className="mb-5 grid items-baseline gap-x-2.5 gap-y-1"
        style={{ gridTemplateColumns: index ? 'auto 1fr' : '1fr' }}
      >
        {index && (
          <span className="serif text-sm font-bold" style={{ color: 'var(--accent-deep)' }}>
            {index}
          </span>
        )}
        <h3 className="serif text-xl font-bold">{title}</h3>
        {subtitle && (
          <span
            className="text-xs leading-relaxed"
            style={{ color: 'var(--ink-soft)', gridColumn: index ? 2 : 1 }}
          >
            {subtitle}
          </span>
        )}
      </div>
      <CommonCard flush={flush}>{children}</CommonCard>
    </section>
  )
}

/**
 * 카드 안을 라벨 붙은 덩어리로 나눈다.
 *
 * 몸통을 라벨보다 한 칸 들여써서 어디까지가 그 라벨의 소관인지 보이게 한다.
 * 들여쓰기가 없으면 라벨이 그냥 굵은 한 줄로만 읽히고, 아래 내용이 어느
 * 라벨에 속하는지가 안 갈린다.
 */
export function CommonBlock({
  label,
  description,
  aside,
  first = false,
  children,
}: {
  label: string
  /** 라벨 바로 아래 붙는 한 줄 */
  description?: string
  /** 라벨 줄 오른쪽 끝에 서는 것. 개인 명식의 동의 출처 딱지가 여기 온다 */
  aside?: ReactNode
  /** 첫 블록은 윗선을 긋지 않는다 */
  first?: boolean
  children: ReactNode
}) {
  /* 라벨 규칙은 입력 필드와 같은 것을 쓴다. 한 화면에서 라벨이 두 규칙을 가지면 안 된다 */
  const head = (
    <CommonFieldLabel
      as="p"
      // 딱지가 옆에 서면 여백은 바깥 줄이 준다. 라벨이 들고 있으면 딱지가 위로 뜬다
      space={aside ? 'none' : 'block'}
      label={label}
      description={description}
    />
  )

  return (
    <div
      className={first ? 'pb-5' : 'py-5'}
      style={first ? undefined : { borderTop: '1px solid var(--rule)' }}
    >
      {aside ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          {head}
          {aside}
        </div>
      ) : (
        head
      )}
      <div className="pl-3">{children}</div>
    </div>
  )
}

/**
 * 처방 한 덩어리.
 *
 * 분석의 축 해설 아래와 상세 보고서의 사각지대 아래에 같은 모양으로 붙는다.
 * 각자 만들어 뒀더니 도장 크기와 글자 크기가 갈렸다.
 */
export function CommonPrescription({ mark, children }: { mark: string; children: ReactNode }) {
  return (
    <div
      className="mt-3 flex items-center gap-2.5 rounded-xl px-4 py-3"
      style={{ background: 'var(--paper-deep)' }}
    >
      <span
        className="serif grid size-5 shrink-0 place-items-center rounded-full text-10 font-bold leading-none"
        // --on-accent 는 --accent-deep 위에 얹는 짝이다. 오방색 원본을 깔면
        // 土 3.04:1 金 3.92:1 로 떨어진다. index.css 의 .seal 주석에 적힌 숫자다
        style={{ background: 'var(--accent-deep)', color: 'var(--on-accent)' }}
      >
        {mark}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </p>
    </div>
  )
}

/**
 * 항목이 쌓이는 자리.
 *
 * 간격은 여기서만 정한다. 항목이 저마다 첫째냐 아니냐로 위아래 패딩을 다르게
 * 가지면 같은 카드 안에서 줄 간격이 자리마다 달라진다.
 */
export function CommonEntryList({
  children,
  divided = false,
}: {
  children: ReactNode
  /** 항목 사이에 점선을 끼운다. 같은 종류가 나란히 설 때 쓴다 */
  divided?: boolean
}) {
  const items = Children.toArray(children)

  return (
    <div className="flex flex-col gap-5">
      {items.map((child, i) => (
        <Fragment key={i}>
          {/*
            선을 항목의 테두리로 두지 않는다. 테두리로 두면 그 항목의 패딩이
            선에 붙어서 위아래 간격이 달라 보인다. 선을 항목 사이에 따로
            끼우면 gap 이 위아래를 똑같이 벌린다.
          */}
          {divided && i > 0 && (
            <span
              aria-hidden="true"
              className="block"
              style={{ borderTop: '1px dashed var(--rule-faint)' }}
            />
          )}
          {child}
        </Fragment>
      ))}
    </div>
  )
}

/**
 * 머리줄 하나에 본문 하나.
 *
 * 오행이든 성향 축이든 변주든 생김새가 같다. `火 넘침 45%` 와 `厚 추진 38%` 는
 * 왼쪽에 한 글자 표식, 가운데 이름, 오른쪽 끝에 비율로 똑같이 읽힌다.
 * 자리마다 따로 만들면 패딩이 갈라진다.
 */
export function CommonEntry({
  mark,
  markLabel,
  markColor,
  title,
  value,
  valueColor,
  fix,
  fixMark,
  children,
}: {
  /** 한 글자 표식. 오행 한자거나 厚 薄 이다. 없는 자리도 있다 */
  mark?: string
  /** 표식을 읽어줄 말. 오행일 때만 있다 */
  markLabel?: string
  markColor?: string
  /** 머리줄 이름. 본문만 있는 항목은 비운다 */
  title?: string
  value?: string
  /** 비율 색. 두꺼운 축과 얇은 축은 표식과 같은 색으로 물들인다 */
  valueColor?: string
  /** 처방. 붙는 자리에만 온다 */
  fix?: string
  fixMark?: string
  children: ReactNode
}) {
  return (
    <div>
      {title && (
        <p className="mb-3 flex items-center gap-2">
          {mark && (
            <span
              className="serif text-base font-bold leading-none"
              style={{ color: markColor }}
            >
              <span aria-hidden={markLabel ? 'true' : undefined}>{mark}</span>
              {markLabel && <span className="sr-only">{markLabel}</span>}
            </span>
          )}
          <span className="serif text-base font-bold leading-tight">{title}</span>
          {value && (
            <span
              className="ml-auto text-xs tabular-nums"
              style={{ color: valueColor ?? 'var(--ink-soft)' }}
            >
              {value}
            </span>
          )}
        </p>
      )}
      <p className="text-sm leading-relaxed">{children}</p>
      {fix && fixMark && <CommonPrescription mark={fixMark}>{fix}</CommonPrescription>}
    </div>
  )
}

/** 붉은 인장 */
export function CommonSeal({
  children = '占',
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <span className={['seal', className].filter(Boolean).join(' ')} aria-hidden="true">
      {children}
    </span>
  )
}
