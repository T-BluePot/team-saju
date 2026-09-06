import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  /** form 이나 li 로도 쓴다. 폼 카드까지 프리미티브로 덮으려면 필요하다 */
  as?: ElementType
  /** 안쪽 여백을 없앤다. 하단에 꽉 차는 버튼을 붙일 때 */
  flush?: boolean
  /** 기본은 2xl. 바텀시트처럼 위만 둥근 경우 직접 준다 */
  radius?: string
  children: ReactNode
}

/**
 * 한지 위에 얹는 기본 면.
 * 그림자 대신 얇은 괘선으로 경계를 만든다.
 */
export function CommonCard({
  as: Tag = 'section',
  flush = false,
  radius = 'rounded-2xl',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <Tag
      {...rest}
      className={[radius, flush ? 'overflow-hidden' : 'p-6 sm:p-7', className]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
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
