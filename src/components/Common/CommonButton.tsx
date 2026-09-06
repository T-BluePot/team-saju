import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * 버튼 프리미티브.
 *
 * 색은 CSS 변수만 쓴다. 결과 화면에서는 주도 오행에 따라 강조색이 갈린다.
 * primary 는 흰 글자를 얹으니 면색으로 --accent-deep 을 쓴다.
 * 오방색 원본 위에 흰 글자를 놓으면 土 3.04:1, 金 3.92:1 로 안 읽힌다.
 */
export type CommonButtonVariant = 'primary' | 'ghost' | 'quiet'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CommonButtonVariant
  /** 카드 하단에 꽉 차게 붙는 형태. 모서리를 없애고 위 괘선만 남긴다 */
  fullBleed?: boolean
  /** 명조체로. 결정 버튼에 쓴다 */
  serif?: boolean
  children: ReactNode
}

// 전이는 .press 가 갖는다. 여기 transition 유틸을 두면 레이어 순서상 덮여서 죽은 선언이 된다
const BASE =
  'inline-flex items-center justify-center select-none disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2'

/** 눌리는 반응. index.css 의 .press 를 공유한다 */
const PRESS = 'press'

const SHAPE = {
  normal: 'rounded-2xl px-5 py-3.5 text-base font-semibold',
  bleed: 'w-full py-4 text-base font-bold',
  /** 꽉 차는 보조 버튼. 주요 버튼과 나란히 놓여도 무게가 안 겹치게 한 단 내린다 */
  bleedQuiet: 'w-full py-4 text-sm font-medium',
} as const

function styleFor(variant: CommonButtonVariant, fullBleed: boolean) {
  const base: React.CSSProperties = {
    outlineColor: 'var(--accent)',
  }
  if (variant === 'primary') {
    return { ...base, background: 'var(--accent-deep)', color: '#fff' }
  }
  if (variant === 'ghost') {
    return {
      ...base,
      border: '1px solid var(--rule)',
      color: 'var(--ink)',
      background: 'transparent',
    }
  }
  // quiet
  return {
    ...base,
    color: 'var(--ink-soft)',
    background: 'transparent',
    borderTop: fullBleed ? '1px solid var(--rule)' : undefined,
  }
}

export function CommonButton({
  variant = 'primary',
  fullBleed = false,
  serif = false,
  className = '',
  children,
  style,
  ...rest
}: Props) {
  const shape = fullBleed
    ? variant === 'quiet'
      ? SHAPE.bleedQuiet
      : SHAPE.bleed
    : SHAPE.normal
  const classes = [BASE, PRESS, shape, serif ? 'serif' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...rest}
      className={classes}
      style={{ ...styleFor(variant, fullBleed), ...style }}
    >
      {children}
    </button>
  )
}
