import { useId } from 'react'
import type {
  ComponentPropsWithRef,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

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
      {/*
        도움말은 라벨 바로 아래다. 컨트롤 밑에 두면 다 적고 나서야 읽게 되는데,
        "공유 이미지에 표시됩니다" 처럼 적기 전에 알아야 하는 말이 여기 온다.
      */}
      <label htmlFor={id} className="serif text-sm font-bold">
        {label}
      </label>
      {hint && (
        <p className="-mt-0.5 text-xs" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      )}
      {children(id)}
    </div>
  )
}

export function CommonTextInput({
  className = '',
  style,
  ...props
}: ComponentPropsWithRef<'input'>) {
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

/**
 * 카드로 고르는 라디오.
 *
 * 라디오 점은 작고, 고른 게 뭔지 한눈에 안 들어온다. 본인 정보인지 대리 입력인지는
 * 개인정보를 다루는 근거가 갈리는 자리라 흘려보고 고르면 안 된다.
 * 면 전체를 누르게 하고 고른 쪽에 색을 준다.
 *
 * 안에는 진짜 `input[type=radio]` 를 둔다. 그래야 같은 `name` 끼리 묶여서
 * 화살표로 옮겨 다니고, 스크린리더가 "2개 중 1번" 을 읽어준다.
 * 포커스 링은 `sr-only` 라 안 보이니 `.pick` 이 바깥 라벨에 그려준다.
 */
export function CommonPickCard({
  name,
  checked,
  onChange,
  title,
  desc,
}: {
  name: string
  checked: boolean
  onChange: () => void
  title: string
  desc: string
}) {
  return (
    <label
      className="pick flex cursor-pointer gap-3 rounded-xl px-4 py-3.5"
      style={{
        background: checked ? 'var(--accent-wash)' : 'var(--paper)',
        border: `1px solid ${checked ? 'var(--accent)' : 'var(--rule)'}`,
      }}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className="mt-1 grid size-5 shrink-0 place-items-center rounded-full"
        style={{ border: `1.5px solid ${checked ? 'var(--accent-deep)' : 'var(--rule)'}` }}
      >
        {checked && (
          <span
            className="size-2.5 rounded-full"
            style={{ background: 'var(--accent-deep)' }}
          />
        )}
      </span>
      <span className="flex flex-col gap-1">
        <span
          className="serif text-lg font-bold leading-snug"
          style={checked ? { color: 'var(--accent-deep)' } : undefined}
        >
          {title}
        </span>
        <span className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {desc}
        </span>
      </span>
    </label>
  )
}

/** 묶음 입력. 양음력, 태어난 시간처럼 선택지가 몇 개 없을 때 */
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
