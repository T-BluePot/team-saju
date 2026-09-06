import type { ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'warn'

const TONE: Record<Tone, React.CSSProperties> = {
  neutral: {
    background: 'var(--paper-deep)',
    border: '1px solid var(--rule)',
    color: 'var(--ink)',
  },
  accent: {
    background: 'var(--accent-wash)',
    color: 'var(--accent)',
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
  const shape =
    size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1.5 text-sm'
  return (
    <span
      className={['inline-flex items-center rounded-full font-medium', shape, className]
        .filter(Boolean)
        .join(' ')}
      style={TONE[tone]}
    >
      {children}
    </span>
  )
}
