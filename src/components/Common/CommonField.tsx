import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

// outline-none 을 같이 쓰면 안 된다. Tailwind v4 에서 --tw-outline-style 을 none 으로
// 박아버려서 focus-visible 규칙까지 같이 죽는다. 키보드로 다니면 포커스가 안 보인다
const CONTROL =
  'rounded-xl px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

const controlStyle: React.CSSProperties = {
  background: 'var(--paper-deep)',
  border: '1px solid var(--rule)',
  color: 'var(--ink)',
  outlineColor: 'var(--accent)',
}

/**
 * 라벨과 컨트롤을 묶는다.
 * label 의 htmlFor 는 여기서 만들고 id 를 children 으로 넘긴다.
 * 컨트롤에 그 id 를 다는 건 호출부 몫이라 강제되지는 않는다. 규칙으로 지킨다.
 */
export function CommonField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string) => ReactNode
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="serif text-sm font-bold">
        {label}
      </label>
      {children(id)}
      {hint && (
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

export function CommonTextInput({
  className = '',
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[CONTROL, className].filter(Boolean).join(' ')}
      style={{ ...controlStyle, ...style }}
    />
  )
}

export function CommonSelect({
  className = '',
  style,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[CONTROL, className].filter(Boolean).join(' ')}
      style={{ ...controlStyle, ...style }}
    />
  )
}

/**
 * 라디오와 체크박스는 라벨 전체가 클릭 영역이 되게 감싼다.
 * type 기본값을 반드시 둔다. input 의 기본 type 은 text 라서
 * 빠뜨리면 체크박스가 텍스트 칸으로 렌더되고 checked 가 항상 false 로 읽힌다.
 * {...rest} 보다 앞에 둬야 호출부의 type="radio" 가 이긴다.
 */
export function CommonCheckLabel({
  children,
  className = '',
  type = 'checkbox',
  style,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label
      className={['flex cursor-pointer items-center gap-2 text-sm', className]
        .filter(Boolean)
        .join(' ')}
    >
      <input type={type} {...rest} style={{ accentColor: 'var(--accent)', ...style }} />
      <span>{children}</span>
    </label>
  )
}

/** 묶음 입력. 성별, 양음력처럼 선택지가 몇 개 없을 때 */
export function CommonFieldGroup({
  legend,
  children,
  boxed = false,
}: {
  legend: string
  children: ReactNode
  boxed?: boolean
}) {
  return (
    <fieldset
      className={boxed ? 'flex flex-col gap-2 rounded-xl p-3' : 'flex flex-col gap-1.5'}
      style={
        boxed
          ? { background: 'var(--paper-deep)', border: '1px solid var(--rule)' }
          : undefined
      }
    >
      <legend className={boxed ? 'px-1 text-sm font-medium' : 'serif text-sm font-bold'}>
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}
