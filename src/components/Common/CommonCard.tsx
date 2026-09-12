import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react'

type OwnProps<T extends ElementType> = {
  /** form 이나 li 로도 쓴다. 폼 카드까지 프리미티브로 덮으려면 필요하다 */
  as?: T
  /** 안쪽 여백을 없앤다. 하단에 꽉 차는 버튼을 붙일 때 */
  flush?: boolean
  /** 기본은 2xl. 바텀시트처럼 위만 둥근 경우 직접 준다 */
  radius?: string
  /**
   * className 과 style 은 여기서 구체 타입으로 못박는다.
   * 아래 Omit 에 걸려 제네릭 쪽에서 빠지기 때문이다. 안 그러면 T 가 안 정해진 상태라
   * className 이 ComponentPropsWithoutRef<T>[string] 로 남아서 기본값 '' 을 못 넣는다.
   */
  className?: string
  style?: CSSProperties
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
