import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const CONTROL =
  'rounded-xl px-4 py-3 text-sm outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

const controlStyle: React.CSSProperties = {
  background: 'var(--paper-deep)',
  border: '1px solid var(--rule)',
  color: 'var(--ink)',
  outlineColor: 'var(--accent)',
}

/**
 * 라벨과 컨트롤을 묶는다.
 * label 과 input 을 id 로 연결하는 걸 컴포넌트가 보장해서
 * 화면마다 빠뜨릴 일이 없게 한다.
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

export function CommonTextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={CONTROL} style={controlStyle} />
}

export function CommonSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={CONTROL} style={controlStyle} />
}

/** 라디오와 체크박스는 라벨 전체가 클릭 영역이 되게 감싼다 */
export function CommonCheckLabel({
  children,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label
      className={['flex cursor-pointer items-center gap-2 text-sm', className]
        .filter(Boolean)
        .join(' ')}
    >
      <input {...rest} style={{ accentColor: 'var(--accent)' }} />
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
