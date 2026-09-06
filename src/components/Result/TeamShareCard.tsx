import { useRef, useState } from 'react'

import { CommonButton, CommonCard } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'
import {
  drawShareCard,
  shareCardBlob,
  shareCardFileName,
} from '../../lib/share/renderShareCard'

export function TeamShareCard({ report }: { report: TeamReport }) {
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
    <CommonCard as="section" flush>
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

      <CommonButton type="button" variant="quiet" fullBleed onClick={makePreview}>
        미리보기
      </CommonButton>
      <CommonButton type="button" variant="primary" fullBleed serif disabled={busy} onClick={download}>
        {busy ? '만드는 중' : '이미지 저장'}
      </CommonButton>
    </CommonCard>
  )
}
