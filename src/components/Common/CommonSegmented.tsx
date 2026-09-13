/**
 * 둘 중 하나를 고르는 알약 줄.
 *
 * 기운 카드의 `균형을 더하는 기운 / 현재와 겹치는 기운` 과 입력 화면의
 * `십이지시 / 직접 입력` 이 같은 물건이다. 각자 만들어 두면 알약 높이와
 * 고른 쪽 표시가 화면마다 갈린다.
 *
 * 탭 롤을 쓰지 않는다. `role="tab"` 은 `tablist` 와 `tabpanel` 이 같이 서야
 * 뜻이 생기고 화살표 키 이동까지 따라와야 한다. 여기는 값을 고르는 자리라
 * `aria-pressed` 가 맞다.
 */
export function CommonSegmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  /** 이 줄이 무엇을 고르는 줄인지 */
  label: string
  value: T
  options: Array<[T, string]>
  onChange: (next: T) => void
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className="press text-xs font-semibold"
          style={{ color: value === key ? 'var(--ink)' : 'var(--ink-soft)' }}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
