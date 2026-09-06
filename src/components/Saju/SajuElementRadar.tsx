import { ELEMENTS, ELEMENT_LABEL } from '../../lib/saju/constants'
import { ELEMENT_COLOR } from '../../lib/ui/elementStyle'
import type { ElementScores } from '../../lib/saju/types'
import { useReveal } from '../../lib/ui/useReveal'

type Props = {
  percents: ElementScores
  size?: number
  /** 축 라벨을 그릴지. 공유 카드처럼 좁은 곳에서는 끈다 */
  showLabels?: boolean
}

const MAX = 50

function point(index: number, ratio: number, radius: number, center: number) {
  const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2
  return [
    center + Math.cos(angle) * radius * ratio,
    center + Math.sin(angle) * radius * ratio,
  ] as const
}

/** 오행 5각 레이더. 차트 라이브러리 대신 직접 그린다 */
export function SajuElementRadar({ percents, size = 240, showLabels = true }: Props) {
  const { ref, shown } = useReveal<SVGSVGElement>()
  const center = size / 2
  const radius = size / 2 - (showLabels ? 34 : 10)

  const grid = [0.25, 0.5, 0.75, 1].map((r) =>
    ELEMENTS.map((_, i) => point(i, r, radius, center).join(',')).join(' '),
  )

  const shape = ELEMENTS.map((el, i) =>
    point(i, Math.min(percents[el] / MAX, 1), radius, center).join(','),
  ).join(' ')

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`팀 오행 분포. ${ELEMENTS.map((el) => `${ELEMENT_LABEL[el]} ${percents[el]}퍼센트`).join(', ')}`}
    >
      {grid.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="var(--rule)"
          strokeWidth={1}
        />
      ))}
      {ELEMENTS.map((_, i) => {
        const [x, y] = point(i, 1, radius, center)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="var(--rule)"
            strokeWidth={1}
          />
        )
      })}

      {/*
        폴리곤 points 는 CSS 로 전이가 안 된다. 중심에서 펴지는 것처럼 보이게
        transform scale 을 준다. 꼭짓점 원도 같이 딸려 나온다.
      */}
      <g
        style={{
          transform: shown ? 'scale(1)' : 'scale(0)',
          transformOrigin: `${center}px ${center}px`,
          opacity: shown ? 1 : 0,
          transition:
            'transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease-out',
        }}
      >
        <polygon
          points={shape}
          fill="var(--accent)"
          fillOpacity={0.22}
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {ELEMENTS.map((el, i) => {
          const [x, y] = point(i, Math.min(percents[el] / MAX, 1), radius, center)
          return <circle key={el} cx={x} cy={y} r={4} fill={ELEMENT_COLOR[el]} />
        })}
      </g>

      {showLabels &&
        ELEMENTS.map((el, i) => {
          const [x, y] = point(i, 1.2, radius, center)
          return (
            <g key={el}>
              <text
                x={x}
                y={y - 3}
                textAnchor="middle"
                fontSize={14}
                fontWeight={700}
                fill={ELEMENT_COLOR[el]}
              >
                {el}
              </text>
              <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                fontSize={11}
                fill="var(--ink-soft)"
              >
                {percents[el]}%
              </text>
            </g>
          )
        })}
    </svg>
  )
}
