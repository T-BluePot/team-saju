import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type OwnProps<T extends ElementType> = {
  /** form 이나 li 로도 쓴다. 폼 카드까지 프리미티브로 덮으려면 필요하다 */
  as?: T
  /** 안쪽 여백을 없앤다. 하단에 꽉 차는 버튼을 붙일 때 */
  flush?: boolean
  /** 기본은 2xl. 바텀시트처럼 위만 둥근 경우 직접 준다 */
  radius?: string
  children: ReactNode
}

/**
 * as 로 고른 태그가 실제로 받는 props 만 허용한다.
 * 뭉뚱그려 HTMLAttributes 로 두면 as="div" 에 onSubmit 을 넘겨도 통과하고
 * 반대로 멀쩡한 as="a" href 가 막힌다.
 */
type Props<T extends ElementType> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T>>

/**
 * 한지 위에 얹는 기본 면.
 * 그림자 대신 얇은 괘선으로 경계를 만든다.
 */
export function CommonCard<T extends ElementType = 'section'>({
  as,
  flush = false,
  radius = 'rounded-2xl',
  className = '',
  children,
  style,
  ...rest
}: Props<T>) {
  const Tag = (as ?? 'section') as ElementType
  return (
    <Tag
      {...rest}
      className={[radius, flush ? 'overflow-hidden' : 'p-6 sm:p-7', className]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)', ...style }}
    >
      {children}
    </Tag>
  )
}

/** 카드 안에서 한 단 낮은 면. 통계 타일 같은 데 쓴다 */
export function CommonWell({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={['rounded-xl p-4', className].filter(Boolean).join(' ')}
      style={{ background: 'var(--paper-deep)' }}
    >
      {children}
    </div>
  )
}
