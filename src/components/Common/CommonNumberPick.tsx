import { useId } from 'react'

/**
 * 목록에서 고르거나 그냥 써넣는 숫자 칸.
 *
 * 고르기만 두면 목록에 없는 값을 못 넣는다. 10분 단위 목록으로는 7분에 태어난
 * 사람이 제 시각을 넣을 수 없었다. 쓰기만 두면 흔한 값도 매번 타이핑해야 한다.
 * `datalist` 를 달면 한 칸이 둘을 다 한다. 화살표로 목록을 열고, 그대로 쓸 수도 있다.
 *
 * 시와 분이 같은 물건이라 같은 컴포넌트를 쓴다. 한쪽만 고르기, 한쪽만 쓰기로
 * 두면 나란히 선 두 칸이 서로 다르게 동작한다.
 */
export function CommonNumberPick({
  label,
  suffix,
  value,
  min,
  max,
  options,
  onChange,
}: {
  /** 화면에 안 보이고 읽어주기만 하는 이름 */
  label: string
  /** 칸 뒤에 붙는 단위 */
  suffix: string
  value: number
  min: number
  max: number
  /** 목록에 띄울 값들. 여기 없는 값도 쓸 수 있다 */
  options: number[]
  onChange: (next: number) => void
}) {
  const id = useId()
  const listId = `${id}-list`

  return (
    <span className="flex items-center gap-1.5">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        list={listId}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value)
          // 빈 칸이나 글자는 그냥 무시한다. NaN 이 들어가면 계산이 통째로 깨진다
          if (e.target.value === '' || Number.isNaN(next)) return
          onChange(Math.min(Math.max(Math.trunc(next), min), max))
        }}
        className="w-20 rounded-xl px-3 py-3 text-center text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          background: 'var(--paper-deep)',
          border: '1px solid var(--rule)',
          color: 'var(--ink)',
          outlineColor: 'var(--accent)',
        }}
      />
      <datalist id={listId}>
        {options.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {suffix}
      </span>
    </span>
  )
}
