import { useEffect, useState } from 'react'

import type { SajuChart } from '../lib/saju/types'
import { ELEMENT_COLOR } from '../lib/ui/elementStyle'
import { STEM_ELEMENT } from '../lib/saju/constants'

/** 계산은 이미 끝나 있다. 이건 뜸을 들이는 화면이다 */
const LINES = [
  '붓에 먹을 묻히는 중',
  '만세력 책장을 넘기는 중',
  '입춘 지났는지 확인하는 중',
  '천간이랑 지지를 짝지어 주는 중',
  '월지에게 요즘 계절을 물어보는 중',
  '지장간 속을 뒤지는 중',
  '오행을 저울에 올려보는 중',
  '일간한테 요새 어떠냐고 묻는 중',
  '십신들 자리를 배치하는 중',
  '어르신이 돋보기를 닦는 중',
  '헛기침 한 번 하는 중',
]

const STEP_MS = 260
const LINE_MS = 900

type Props = {
  charts: SajuChart[]
  onDone: () => void
}

export function LoadingView({ charts, onDone }: Props) {
  const [revealed, setRevealed] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)

  const sample = charts[0]
  const pillars = sample
    ? [sample.pillars.year, sample.pillars.month, sample.pillars.day, sample.pillars.hour]
    : []

  useEffect(() => {
    const total = 8
    const stepper = setInterval(() => {
      setRevealed((n) => (n >= total ? n : n + 1))
    }, STEP_MS)

    const roller = setInterval(() => {
      setLineIndex((i) => (i + 1) % LINES.length)
    }, LINE_MS)

    const finish = setTimeout(onDone, STEP_MS * total + 700)

    return () => {
      clearInterval(stepper)
      clearInterval(roller)
      clearTimeout(finish)
    }
  }, [onDone])

  return (
    <div className="flex min-h-[68vh] flex-col items-center justify-center gap-10 py-10">
      <div className="flex gap-2.5">
        {pillars.map((p, col) => (
          <div key={col} className="flex flex-col gap-2.5">
            {[p?.stem ?? null, p?.branch ?? null].map((ch, row) => {
              const order = col * 2 + row
              const shown = revealed > order
              const color =
                ch && row === 0 ? ELEMENT_COLOR[STEM_ELEMENT[p!.stem]] : 'var(--ink)'
              return (
                <div
                  key={row}
                  className="serif flex size-14 items-center justify-center rounded-lg text-2xl font-bold transition-all duration-300 sm:size-16 sm:text-3xl"
                  style={{
                    background: shown ? 'var(--surface)' : 'transparent',
                    border: `1px solid ${shown ? 'var(--rule)' : 'color-mix(in srgb, var(--rule) 45%, transparent)'}`,
                    color: shown ? color : 'transparent',
                    opacity: shown ? 1 : 0.4,
                    transform: shown ? 'scale(1)' : 'scale(0.94)',
                  }}
                >
                  {ch ?? '·'}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="serif text-lg" style={{ color: 'var(--ink)' }}>
          {LINES[lineIndex]}
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full"
              style={{
                background: 'var(--cinnabar)',
                animation: `pulse-soft 1.1s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
        {charts.length}명의 명식을 살펴보고 있습니다
      </p>
    </div>
  )
}
