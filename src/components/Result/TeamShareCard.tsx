import { useRef, useState } from 'react'

import { CommonButton, CommonCard } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'
import {
  drawShareCard,
  shareCardBlob,
  shareCardFileName,
} from '../../lib/share/renderShareCard'

/**
 * blob 을 파일로 내려받는다.
 *
 * 앵커를 문서에 붙였다 뗀다. Firefox 는 문서에 붙어 있지 않으면 click 이 안 먹는다.
 * revoke 도 미룬다. iOS Safari 는 download 속성을 무시하고 blob 을 새 탭으로 여는데,
 * 바로 revoke 하면 그 탭이 빈 화면으로 뜬다.
 */
function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** 이 기기가 파일 공유 시트를 띄울 수 있나. 모바일이면 대개 된다 */
const CAN_SHARE_FILES =
  typeof navigator !== 'undefined' && typeof navigator.canShare === 'function'

export function TeamShareCard({ report }: { report: TeamReport }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const makePreview = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    await drawShareCard(canvas, report)
    setPreview(canvas.toDataURL('image/png'))
  }

  const save = async () => {
    setBusy(true)
    setNotice(null)
    try {
      const blob = await shareCardBlob(report)
      if (!blob) {
        setNotice('이미지를 못 만들었습니다. 미리보기를 눌러서 길게 누르면 저장돼요')
        return
      }

      const file = new File([blob], shareCardFileName(report), { type: 'image/png' })

      // 모바일은 공유 시트가 낫다. 저장이랑 슬랙이 한 번에 나온다
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] })
          return
        } catch (err) {
          // 사용자가 시트를 닫은 건 실패가 아니다. 조용히 끝낸다
          if (err instanceof DOMException && err.name === 'AbortError') return
          // 그 밖의 이유면 내려받기로 떨어진다
        }
      }

      saveBlob(blob, shareCardFileName(report))
    } finally {
      setBusy(false)
    }
  }

  const label = CAN_SHARE_FILES ? '이미지 공유' : '이미지 저장'

  return (
    <CommonCard as="section" flush>
      <div className="p-6 sm:p-7">
        <h3 className="serif text-lg font-bold">이미지로 공유하기</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          팀 유형과 오행 분포만 담깁니다. 이름과 생년월일은 안 들어가요
        </p>

        {preview && (
          <>
            <img
              src={preview}
              alt="공유 카드 미리보기"
              className="mt-5 w-full max-w-[280px] rounded-xl"
              style={{ border: '1px solid var(--rule)' }}
            />
            <p className="mt-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
              저장이 안 되면 이 이미지를 길게 눌러 저장하세요
            </p>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />

        {notice && (
          <p
            className="mt-4 rounded-lg px-3 py-2 text-sm"
            style={{ background: 'var(--accent-wash)', color: 'var(--accent)' }}
            role="status"
          >
            {notice}
          </p>
        )}
      </div>

      <CommonButton type="button" variant="quiet" fullBleed onClick={makePreview}>
        미리보기
      </CommonButton>
      <CommonButton
        type="button"
        variant="primary"
        fullBleed
        serif
        disabled={busy}
        onClick={save}
      >
        {busy ? '만드는 중' : label}
      </CommonButton>
    </CommonCard>
  )
}
