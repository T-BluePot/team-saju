import { useRef, useState } from 'react'

import { CommonButton, CommonSection } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'
import { shareCardCopy } from '../../lib/copy'
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

const FAILED = shareCardCopy.failed

export function TeamShareCard({ report }: { report: TeamReport }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const zoomRef = useRef<HTMLDialogElement>(null)
  const blobRef = useRef<Blob | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
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
    // 한 번 구우면 다시 안 굽는다. 두 번째부터는 접었다 펴는 것뿐이다
    if (preview) {
      setOpen((v) => !v)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      await drawShareCard(canvas, report)
      setPreview(canvas.toDataURL('image/png'))
      setOpen(true)
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
    <CommonSection
      index={shareCardCopy.index}
      title={shareCardCopy.heading}
      subtitle={shareCardCopy.note}
      flush
    >
      <div className="px-6 pt-6 text-center sm:px-7">
        {/* 아직 아무것도 없을 때가 기본이다. 뭘 누르면 뭐가 나오는지 여기서 말한다 */}
        {!open && (
          <p className="pb-6 text-xs" style={{ color: 'var(--ink-soft)' }}>
            {shareCardCopy.emptyHint}
          </p>
        )}

        {/*
          높이를 재지 않고 펼친다. 카피 길이에 따라 판 높이가 달라져서
          `max-height` 로 어림잡으면 긴 팀에서 아래가 잘린다
        */}
        <div className={open ? 'reveal open' : 'reveal'}>
          <div>
            <div className="reveal-inner">
              {preview && (
                <>
                  <button
                    type="button"
                    onClick={() => zoomRef.current?.showModal()}
                    className="press mx-auto block w-70 max-w-full overflow-hidden rounded-xl"
                    style={{ border: '1px solid var(--rule)', cursor: 'zoom-in' }}
                  >
                    <img src={preview} alt={shareCardCopy.previewAlt} className="block w-full" />
                  </button>
                  <p className="pb-6 pt-3 text-11" style={{ color: 'var(--ink-soft)' }}>
                    {touch ? shareCardCopy.longPressHint : shareCardCopy.zoomHint}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/*
          라이브 리전은 내용보다 먼저 접근성 트리에 있어야 안정적으로 읽힌다.
          리전과 내용을 같이 붙이면 일부 스크린리더가 놓친다.
        */}
        <p
          role="status"
          className={notice ? 'mb-6 rounded-lg px-3 py-2 text-sm' : undefined}
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
        {open ? shareCardCopy.close : shareCardCopy.preview}
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
        {busy
          ? shareCardCopy.busy
          : canShare
            ? shareCardCopy.share
            : shareCardCopy.download}
      </CommonButton>

      {/*
        크게 보기. `showModal()` 이 포커스 가두기와 Esc 를 챙긴다.
        직접 만들면 뒤 화면 스크롤 잠금까지 손으로 짜야 한다
      */}
      <dialog
        ref={zoomRef}
        onClick={(e) => {
          if (e.target === zoomRef.current) zoomRef.current?.close()
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-5"
        style={{ width: '100%', height: '100%' }}
      >
        {preview && (
          <div className="flex h-full items-center justify-center">
            <img
              src={preview}
              alt={shareCardCopy.previewAlt}
              className="max-h-full w-auto max-w-full rounded-2xl"
            />
            <button
              type="button"
              onClick={() => zoomRef.current?.close()}
              aria-label={shareCardCopy.close}
              className="press fixed right-5 top-5 grid size-10 place-items-center rounded-full text-xl leading-none"
              style={{ background: 'var(--paper)', color: 'var(--ink)' }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </dialog>
    </CommonSection>
  )
}
