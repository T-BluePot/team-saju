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

/**
 * 이 기기가 **파일**을 공유 시트로 넘길 수 있나.
 *
 * `navigator.canShare` 가 있는지만 보면 안 된다. 그 API 가 존재하는 이유 자체가
 * "메서드가 있다" 와 "이 payload 를 보낼 수 있다" 가 다르기 때문이다.
 * 데스크톱 Chrome 은 `canShare` 를 갖고 있으면서 파일에는 false 를 준다.
 * 그래서 실제 분기와 똑같은 식으로 판정한다. 안 그러면 버튼에 "공유" 라고 써놓고
 * 누르면 조용히 내려받기가 도는 꼴이 된다.
 */
function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || typeof File === 'undefined') return false
  const probe = new File([], 'probe.png', { type: 'image/png' })
  return navigator.canShare?.({ files: [probe] }) ?? false
}

/** 길게 눌러 저장하라는 안내는 터치 기기에서만 뜻이 있다 */
function isTouch(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
}

const FAILED = '이미지를 못 만들었습니다. 화면을 새로고침하고 다시 해보세요'

export function TeamShareCard({ report }: { report: TeamReport }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobRef = useRef<Blob | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const [canShare] = useState(canShareFiles)
  const [touch] = useState(isTouch)

  /**
   * 미리 구워둔다.
   *
   * `navigator.share` 는 transient activation 을 요구하는데, blob 을 만드는 동안
   * 일러스트를 네트워크로 받아온다. 150KB 짜리를 콜드 캐시에서 받으면 그 await 가
   * 활성화 창을 넘길 수 있고, WebKit 은 이 창에 특히 인색하다. 그러면 share 가
   * NotAllowedError 로 죽는데, 만료된 활성화는 폴백의 a.click() 이 여는 탭도 같이
   * 막아서 공유도 저장도 안 되는 상태가 된다. 고치려던 기기에서 정확히 깨진다.
   *
   * pointerdown 은 click 보다 먼저 오니 여기서 출발시켜 두면 클릭 시점에 기다릴 게 없다.
   */
  const warm = () => {
    if (blobRef.current) return
    void shareCardBlob(report)
      .then((b) => {
        blobRef.current = b
      })
      .catch(() => {
        // 여기서 실패해도 조용히 둔다. save() 가 다시 시도하고 그때 안내한다
      })
  }

  const makePreview = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      await drawShareCard(canvas, report)
      setPreview(canvas.toDataURL('image/png'))
      setNotice(null)
    } catch {
      setNotice(FAILED)
    }
  }

  const save = async () => {
    setBusy(true)
    setNotice(null)
    try {
      const blob = blobRef.current ?? (await shareCardBlob(report))
      if (!blob) {
        setNotice(FAILED)
        return
      }
      blobRef.current = blob

      const name = shareCardFileName(report)
      const file = new File([blob], name, { type: 'image/png' })

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

      saveBlob(blob, name)
    } catch {
      setNotice(FAILED)
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
          <>
            <img
              src={preview}
              alt="공유 카드 미리보기"
              className="mt-5 w-full max-w-[280px] rounded-xl"
              style={{ border: '1px solid var(--rule)' }}
            />
            {touch && (
              <p className="mt-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                저장이 안 되면 이 이미지를 길게 눌러도 됩니다
              </p>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/*
          라이브 리전은 내용보다 먼저 접근성 트리에 있어야 안정적으로 읽힌다.
          리전과 내용을 같이 붙이면 일부 스크린리더가 놓친다.
        */}
        <p
          role="status"
          className={notice ? 'mt-4 rounded-lg px-3 py-2 text-sm' : undefined}
          style={
            notice
              ? { background: 'var(--accent-wash)', color: 'var(--accent-deep)' }
              : undefined
          }
        >
          {notice}
        </p>
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
        onPointerDown={warm}
        onFocus={warm}
        onClick={save}
      >
        {busy ? '만드는 중' : canShare ? '이미지 공유' : '이미지 저장'}
      </CommonButton>
    </CommonCard>
  )
}
