import type { ReactNode } from 'react'

import { CommonCard } from './CommonCard'

/**
 * 번호를 붙인 섹션. 결과 화면의 분석, 상세 보고서처럼
 * 순서가 있는 덩어리에 쓴다.
 */
export function CommonSection({
  index,
  title,
  subtitle,
  children,
}: {
  /** 一 二 三 같은 한자 번호 */
  index?: string
  title: string
  subtitle?: string
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
      <CommonCard>{children}</CommonCard>
    </section>
  )
}

/** 카드 안에서 소제목을 나눌 때 */
export function CommonSubHeading({ children }: { children: ReactNode }) {
  return <h4 className="serif text-base font-bold">{children}</h4>
}

export function CommonRule({ double = false }: { double?: boolean }) {
  return <hr className={double ? 'rule-double my-7' : 'rule my-7'} />
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
