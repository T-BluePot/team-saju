import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * 버튼 프리미티브.
 *
 * 색은 CSS 변수만 쓴다. 결과 화면에서는 주도 오행에 따라 강조색이 갈린다.
 * primary 는 면색으로 --accent-deep 을 쓰고 글자는 --on-accent 다.
 * 오방색 원본 위에 흰 글자를 놓으면 라이트에서 土 3.04:1, 金 3.92:1 로 안 읽힌다.
 * 다크는 --accent-deep 자체가 밝아서 흰 글자면 2.21:1 까지 떨어진다.
 * 그래서 글자색도 테마를 따라 뒤집는다.
 */
export type CommonButtonVariant = 'primary' | 'ink' | 'ghost' | 'quiet'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CommonButtonVariant
  /** 카드 하단에 꽉 차게 붙는 형태. 모서리를 없애고 위 괘선만 남긴다 */
  fullBleed?: boolean
  /** 명조체로. 결정 버튼에 쓴다 */
  serif?: boolean
  children: ReactNode
}

// 전이는 .press 가 갖는다. 여기 transition 유틸을 두면 레이어 순서상 덮여서 죽은 선언이 된다
/*
 * 투명도를 깎지 않는다. `disabled:opacity-40` 은 주요 버튼을 한지 위에서 2.1:1 로
 * 만든다. 랜딩에서 동의 전 "팀 만들기" 가 이 상태로 첫인상을 차지하게 되면서
 * 뭘 눌러야 하는지가 안 읽혔다. 투명도 대신 색을 따로 준다.
 */
const BASE =
  'inline-flex items-center justify-center select-none disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2'

/** 눌리는 반응. index.css 의 .press 를 공유한다 */
const PRESS = 'press'

const SHAPE = {
  normal: 'rounded-2xl px-5 py-3.5 text-base font-semibold',
  bleed: 'w-full py-4 text-base font-bold',
  /** 꽉 차는 보조 버튼. 주요 버튼과 나란히 놓여도 무게가 안 겹치게 한 단 내린다 */
  bleedQuiet: 'w-full py-4 text-sm font-medium',
} as const

function styleFor(
  variant: CommonButtonVariant,
  fullBleed: boolean,
  disabled: boolean,
) {
  const base: React.CSSProperties = {
    outlineColor: 'var(--accent)',
  }
  // 눌리지 않는다는 건 색으로 말한다. 면을 한 단 내리고 글자를 흐린 먹으로 둔다
  if (disabled) {
    return {
      ...base,
      background: 'var(--paper-deep)',
      color: 'var(--ink-soft)',
      border: variant === 'ghost' ? '1px solid var(--rule)' : undefined,
      borderTop:
        fullBleed && variant === 'quiet' ? '1px solid var(--rule)' : undefined,
    }
  }
  if (variant === 'primary') {
    return { ...base, background: 'var(--accent-deep)', color: 'var(--on-accent)' }
  }
  // 강조색을 안 쓰는 결정 버튼. 결과 화면에서 오행색이 갈려도 같은 먹으로 남는다
  if (variant === 'ink') {
    return { ...base, background: 'var(--ink)', color: 'var(--paper)' }
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
      style={{ ...styleFor(variant, fullBleed, rest.disabled === true), ...style }}
    >
      {children}
    </button>
  )
}
