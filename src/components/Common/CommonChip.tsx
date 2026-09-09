import type { ReactNode } from 'react'

type Tone = 'neutral' | 'soft' | 'accent' | 'warn'

const TONE: Record<Tone, React.CSSProperties> = {
  /** 테두리만 있는 칩. 십신, 조합 집계, 동의 출처가 쓴다 */
  neutral: {
    border: '1px solid var(--rule)',
    color: 'var(--ink-soft)',
  },
  /** 면으로 채운 칩. 본문 옆에 붙는 꼬리표 자리라 테두리를 안 두른다 */
  soft: {
    background: 'var(--paper-deep)',
    color: 'var(--ink-soft)',
  },
  accent: {
    background: 'var(--accent-wash)',
    color: 'var(--accent-deep)',
  },
  warn: {
    background: 'var(--warn-wash)',
    color: 'var(--warn)',
  },
}

/** 작은 라벨. 오행 과잉 결핍 표시, 조합 집계, 동의 출처 배지에 쓴다 */
export function CommonChip({
  tone = 'neutral',
  size = 'md',
  className = '',
  children,
}: {
  tone?: Tone
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}) {
  const shape = size === 'sm' ? 'px-2 py-0.5 text-11' : 'px-3 py-1 text-xs'
  return (
    <span
      className={['inline-block rounded-full text-center font-medium', shape, className]
        .filter(Boolean)
        .join(' ')}
      style={TONE[tone]}
    >
      {children}
    </span>
  )
}
