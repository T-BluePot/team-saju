import { useEffect, useState } from 'react'

import type { SajuChart } from '../../lib/saju/types'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'
import { STEM_ELEMENT } from '../../lib/saju/constants'

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

const LINE_MS = 900

/** 한 사람 명식은 여덟 글자 */
const PER_CHART = 8

/**
 * 몇 사람 명식을 넘겨볼지.
 * 8명을 넣어도 8번 다 보여주면 로딩이 한세월이라 세 명에서 끊는다.
 */
const MAX_ROUNDS = 3

/** 글자를 다 여는 데 쓰는 시간. 사람이 늘면 늘리되 선형으로는 안 늘린다 */
function revealMsFor(rounds: number) {
  return 2100 + (rounds - 1) * 900
}

type Props = {
  charts: SajuChart[]
  onDone: () => void
}

export function LoadingView({ charts, onDone }: Props) {
  /** 지금까지 연 글자 수. 사람 수만큼 이어서 센다 */
  const [opened, setOpened] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)

  const rounds = Math.min(Math.max(charts.length, 1), MAX_ROUNDS)
  const totalSteps = rounds * PER_CHART

  // 여덟 글자를 다 열면 다음 사람으로 넘어간다.
  // floor 를 쓰면 opened 가 8일 때 바로 다음 사람으로 넘어가버려서
  // 앞사람 명식이 여덟 글자를 다 채운 화면을 한 프레임도 못 보여준다.
  const who = Math.min(Math.max(Math.ceil(opened / PER_CHART) - 1, 0), rounds - 1)
  const revealed = opened - who * PER_CHART

  const sample = charts[who]
  const pillars = sample
    ? [sample.pillars.year, sample.pillars.month, sample.pillars.day, sample.pillars.hour]
    : []

  useEffect(() => {
    const stepMs = revealMsFor(rounds) / totalSteps

    const stepper = setInterval(() => {
      setOpened((n) => (n >= totalSteps ? n : n + 1))
    }, stepMs)

    const roller = setInterval(() => {
      setLineIndex((i) => (i + 1) % LINES.length)
    }, LINE_MS)

    const finish = setTimeout(onDone, revealMsFor(rounds) + 700)

    return () => {
      clearInterval(stepper)
      clearInterval(roller)
      clearTimeout(finish)
    }
  }, [onDone, rounds, totalSteps])

  return (
    <div className="flex min-h-[68vh] flex-col items-center justify-center gap-10 py-10">
      <div key={who} className="flex gap-2.5">
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
                background: 'var(--accent)',
                animation: `pulse-soft 1.1s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
        {charts.length <= 1 || !sample
          ? '명식을 살펴보고 있습니다'
          : `${sample.member.name} 명식을 보는 중`}
      </p>
    </div>
  )
}
