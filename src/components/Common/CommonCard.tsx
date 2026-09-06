import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article'
  /** 안쪽 여백을 없앤다. 하단에 꽉 차는 버튼을 붙일 때 쓴다 */
  flush?: boolean
  children: ReactNode
}

/**
 * 한지 위에 얹는 기본 면.
 * 그림자 대신 얇은 괘선으로 경계를 만든다.
 */
export function CommonCard({
  as: Tag = 'section',
  flush = false,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <Tag
      {...rest}
      className={[
        'rounded-2xl',
        flush ? 'overflow-hidden' : 'p-6 sm:p-7',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
    >
      {children}
    </Tag>
  )
}

/** 카드 안에서 한 단 낮은 면. 통계 타일 같은 데 쓴다 */
export function CommonWell({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={['rounded-xl p-4', className].filter(Boolean).join(' ')}
      style={{ background: 'var(--paper-deep)' }}
    >
      {children}
    </div>
  )
}
