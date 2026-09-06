import { useRef, useState } from 'react'

import type { TeamReport } from '../lib/report/teamReport'
import { ELEMENT_LABEL } from '../lib/saju/constants'
import {
  drawShareCard,
  shareCardBlob,
  shareCardFileName,
} from '../lib/share/renderShareCard'
import {
  ELEMENT_COLOR,
  ILLUST_SOURCE,
  ILLUST_SOURCE_URL,
  illustFor,
} from '../lib/ui/elementStyle'
import { ElementBars } from './ElementBars'
import { ElementRadar } from './ElementRadar'

export function TeamReportView({ report }: { report: TeamReport }) {
  const { analysis, archetype, dominant, lacking } = report
  const illust = illustFor(archetype.id, analysis.elements.dominant)

  return (
    <div className="flex flex-col gap-10">
      <Headline report={report} />

      <figure className="flex flex-col items-center gap-3">
        <div
          className="flex w-full items-center justify-center rounded-2xl px-6 py-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
        >
          <img
            src={illust.src}
            alt={`${archetype.name} 이미지`}
            className="animate-ink h-44 w-auto object-contain sm:h-56"
            loading="lazy"
          />
        </div>
        <figcaption className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
          일러스트{' '}
          <a
            href={ILLUST_SOURCE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
          >
            {ILLUST_SOURCE}
          </a>
        </figcaption>
      </figure>

      <Block index="一" title="분석" subtitle="팀 전체의 기운을 재봤습니다">
        <div className="flex flex-col items-center gap-7 sm:flex-row">
          <ElementRadar percents={analysis.elements.percents} size={230} />
          <div className="w-full flex-1">
            <ElementBars percents={analysis.elements.percents} flags={analysis.flags} />
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Stat
            title="넘치는 기운"
            value={`${dominant.element} ${ELEMENT_LABEL[dominant.element]} ${dominant.percent}%`}
            note={dominant.meaning}
            color={ELEMENT_COLOR[dominant.element]}
          />
          <Stat
            title="비어 있는 곳"
            value={`${lacking.element} ${ELEMENT_LABEL[lacking.element]} ${lacking.percent}%`}
            note={lacking.effect}
            color={ELEMENT_COLOR[lacking.element]}
          />
        </div>

        <div
          className="mt-3 flex items-baseline gap-3 rounded-xl px-4 py-3"
          style={{ background: 'var(--paper-deep)' }}
        >
          <span className="serif text-2xl font-bold" style={{ color: 'var(--cinnabar)' }}>
            {analysis.balance}
          </span>
          <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            균형 점수. 100이면 다섯 기운이 완전히 고른 상태입니다
          </span>
        </div>
      </Block>

      <Block index="二" title="상세 보고서" subtitle="강점과 빈자리, 그리고 처방">
        <h4 className="serif text-base font-bold">이 팀의 강점</h4>
        <ul className="mt-3 flex flex-col gap-2.5">
          {archetype.strengths.map((s) => (
            <li key={s} className="flex gap-3 text-sm leading-relaxed">
              <span style={{ color: 'var(--cinnabar)' }}>·</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <hr className="rule my-7" />

        <h4 className="serif text-base font-bold">놓치기 쉬운 것</h4>
        <ul className="mt-3 flex flex-col gap-5">
          {archetype.blindSpots.map((b, i) => (
            <li key={b}>
              <p className="text-sm leading-relaxed">{b}</p>
              <p
                className="mt-2 border-l-2 py-1 pl-3 text-sm leading-relaxed"
                style={{ borderColor: 'var(--cinnabar)' }}
              >
                <span
                  className="serif mr-1.5 text-xs font-bold"
                  style={{ color: 'var(--cinnabar)' }}
                >
                  處方
                </span>
                {archetype.prescriptions[i]}
              </p>
            </li>
          ))}
        </ul>

        <hr className="rule my-7" />

        <h4 className="serif text-base font-bold">이 팀에 들어오면 좋은 사람</h4>
        <p className="serif mt-3 text-lg leading-relaxed">{archetype.needsPerson}</p>

        <hr className="rule my-7" />

        <h4 className="serif text-base font-bold">조합 집계</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip label="상생" count={analysis.pairCounts.generating} />
          <Chip label="비슷한 결" count={analysis.pairCounts.same} />
          <Chip label="긴장감 있는 조합" count={analysis.pairCounts.tension} />
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
          누가 누구인지는 공유 이미지에 안 들어갑니다. 개인 탭에서만 보여요
        </p>
      </Block>

      <ShareBlock report={report} />
    </div>
  )
}

function Headline({ report }: { report: TeamReport }) {
  const { analysis, archetype } = report
  return (
    <header className="relative pt-2">
      <span
        className="seal animate-seal absolute right-0 top-0 size-11 text-base"
        aria-hidden="true"
      >
        占
      </span>

      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {analysis.teamName} · {analysis.size}명
      </p>

      <h2 className="serif animate-ink mt-3 text-[2rem] font-extrabold leading-[1.15] sm:text-[2.6rem]">
        {archetype.name}
      </h2>

      <p className="serif mt-3 text-base sm:text-lg" style={{ color: 'var(--ink-soft)' }}>
        {archetype.tagline}
      </p>

      <hr className="rule-double mt-6" />
    </header>
  )
}

function Block({
  index,
  title,
  subtitle,
  children,
}: {
  index: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-3">
        <span className="serif text-sm font-bold" style={{ color: 'var(--cinnabar)' }}>
          {index}
        </span>
        <h3 className="serif text-xl font-bold">{title}</h3>
        <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          {subtitle}
        </span>
      </div>
      <div
        className="rounded-2xl p-6 sm:p-7"
        style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
      >
        {children}
      </div>
    </section>
  )
}

function ShareBlock({ report }: { report: TeamReport }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const makePreview = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    await drawShareCard(canvas, report)
    setPreview(canvas.toDataURL('image/png'))
  }

  const download = async () => {
    setBusy(true)
    try {
      const blob = await shareCardBlob(report)
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = shareCardFileName(report)
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className="overflow-hidden rounded-2xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
    >
      <div className="p-6 sm:p-7">
        <h3 className="serif text-lg font-bold">이미지로 공유하기</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          팀 유형과 오행 분포만 담깁니다. 이름과 생년월일은 안 들어가요
        </p>

        {preview && (
          <img
            src={preview}
            alt="공유 카드 미리보기"
            className="mt-5 w-full max-w-[280px] rounded-xl"
            style={{ border: '1px solid var(--rule)' }}
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        type="button"
        onClick={makePreview}
        className="block w-full py-3.5 text-sm"
        style={{ borderTop: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
      >
        미리보기
      </button>
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="serif block w-full py-4 text-base font-bold text-white disabled:opacity-50"
        style={{ background: 'var(--cinnabar)' }}
      >
        {busy ? '만드는 중' : '이미지 저장'}
      </button>
    </section>
  )
}

function Stat({
  title,
  value,
  note,
  color,
}: {
  title: string
  value: string
  note: string
  color: string
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--paper-deep)' }}>
      <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
        {title}
      </p>
      <p className="serif mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
        {note}
      </p>
    </div>
  )
}

function Chip({ label, count }: { label: string; count: number }) {
  return (
    <span
      className="rounded-full px-3 py-1.5 text-sm"
      style={{ background: 'var(--paper-deep)', border: '1px solid var(--rule)' }}
    >
      {label} <strong>{count}</strong>쌍
    </span>
  )
}
