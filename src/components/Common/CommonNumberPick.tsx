import { useEffect, useId, useRef, useState } from 'react'

/**
 * 목록에서 고르거나 그냥 써넣는 숫자 칸.
 *
 * 고르기만 두면 목록에 없는 값을 못 넣는다. 10분 단위 목록으로는 7분에 태어난
 * 사람이 제 시각을 넣을 수 없었다. 쓰기만 두면 흔한 값도 매번 타이핑해야 한다.
 * 한 칸이 둘을 다 한다.
 *
 * **`datalist` 를 안 쓴다.** `type="number"` 에는 브라우저가 목록을 아예 안 열고,
 * `type="text"` 로 바꿔도 화살표가 hover 때만 희미하게 뜬다. 열 수 있는 줄을
 * 모르면 없는 기능이다. 목록을 직접 그린다.
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
  const box = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)

  /**
   * 쓰는 중인 글자.
   *
   * 값을 숫자로만 들고 있으면 칸을 비울 수가 없다. 지우는 순간 0 이 들어와서
   * `7` 을 쓰려면 `07` 을 쓰게 된다. 쓰는 동안은 글자를 그대로 보여주고
   * 칸을 떠날 때 정리한다.
   */
  const [typing, setTyping] = useState<string | null>(null)

  const clamp = (n: number) => Math.min(Math.max(Math.trunc(n), min), max)

  // 바깥을 누르면 닫는다. 목록 안의 버튼을 누르는 건 pointerdown 이 먼저라 여기서 걸러진다
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  return (
    <span ref={box} className="relative flex items-center gap-1.5">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>

      <span className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          value={typing ?? String(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '')
            if (raw === '') {
              setTyping('')
              return
            }
            /*
              보이는 글자도 같이 자른다. 저장값만 자르고 글자를 그대로 두면
              59 가 들어간 칸에 99 가 적혀 있다. 칸을 떠날 때 정리하는 것에
              기대면, 떠나지 않는 동안은 어긋난 채로 보인다.
            */
            const next = clamp(Number(raw))
            setTyping(String(next))
            onChange(next)
          }}
          onBlur={() => setTyping(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
            if (e.key === 'Escape') setOpen(false)
          }}
          className="w-20 rounded-xl py-3 pl-3 pr-8 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: 'var(--paper-deep)',
            border: '1px solid var(--rule)',
            color: 'var(--ink)',
            outlineColor: 'var(--accent)',
          }}
        />

        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="press absolute inset-y-0 right-0 grid w-8 place-items-center rounded-r-xl focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: 'var(--ink-soft)', outlineColor: 'var(--accent)' }}
        >
          {/* 꺾쇠는 글자로 두지 않는다. 글꼴마다 굵기와 가운데가 달라진다 */}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
              d="M6 9.5 L12 15.5 L18 9.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            className="scroll-y absolute left-0 top-full z-20 mt-1 max-h-52 w-20 overflow-y-auto rounded-xl py-1"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--rule)',
            }}
          >
            {/*
              `<li>` 는 자리만 내준다. 역할을 비워야 `listbox` 가 `option` 을
              바로 거느린다. 사이에 `listitem` 이 끼면 그 관계가 끊겨서
              스크린리더가 「24개 중 3번」 같은 자리 안내를 못 읽는다.
            */}
            {options.map((n) => (
              <li key={n} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={n === value}
                  onClick={() => {
                    setTyping(null)
                    onChange(clamp(n))
                    setOpen(false)
                  }}
                  className="press w-full px-3 py-2 text-left text-sm"
                  style={{
                    background: n === value ? 'var(--paper-deep)' : 'transparent',
                    color: 'var(--ink)',
                  }}
                >
                  {n}
                </button>
              </li>
            ))}
          </ul>
        )}
      </span>

      <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {suffix}
      </span>
    </span>
  )
}
