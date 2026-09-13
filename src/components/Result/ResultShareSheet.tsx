import { useRef, useState } from 'react'

import { CommonButton } from '../Common'
import { SITE_HOST, SITE_URL } from '../../lib/config'
import { shareSheetCopy } from '../../lib/copy'
import type { TeamReport } from '../../lib/report/teamReport'
import { kakaoReady, shareToKakao } from '../../lib/share/kakao'

/**
 * 결과를 밖으로 내보내는 두 번째 길.
 *
 * `四 이미지로 공유하기` 는 그림 파일을 만든다. 여기는 링크를 보낸다. 둘이 하는
 * 일이 달라서 이름도 갈랐다. 저장은 파일, 공유는 보내기다.
 *
 * 왜 하단 바에 두는가. 결과가 길어서 `四` 까지 내려가야 공유를 만난다. 다 읽고
 * 나서 "이거 팀 채널에 던져야지" 가 되는 자리는 화면 끝이 아니라 손 닿는 데다.
 *
 * **나가는 건 팀 유형과 서비스 주소까지다.** 이름도 생년월일도 안 실린다.
 * v1 은 결과를 저장하지 않아서 결과 자체를 가리키는 주소가 없다. 받은 사람은
 * 첫 화면으로 와서 자기 팀을 넣게 된다. 그게 이 링크가 하려는 일이다.
 */
export function ResultShareSheet({ report }: { report: TeamReport }) {
  const ref = useRef<HTMLDialogElement>(null)
  const downOnBackdrop = useRef(false)
  const [notice, setNotice] = useState<string | null>(null)

  const open = () => {
    const el = ref.current
    setNotice(null)
    // 이미 열려 있는데 다시 부르면 InvalidStateError 가 난다
    if (el && !el.open) el.showModal()
  }
  const close = () => ref.current?.close()

  const sendKakao = async () => {
    const ok = await shareToKakao(
      shareSheetCopy.cardTitle(report.archetype.name),
      shareSheetCopy.cardDescription(report.analysis.teamName, report.archetype.tagline),
      shareSheetCopy.cardButton,
      SITE_URL,
    )
    // SDK 를 못 받았거나 초기화가 안 됐다. 링크 복사가 남아 있으니 그쪽을 가리킨다
    if (!ok) setNotice(shareSheetCopy.kakaoFailed)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setNotice(shareSheetCopy.copied)
    } catch {
      // http 로 열었거나 권한이 막혔다. 주소를 직접 보라고 말해준다
      setNotice(shareSheetCopy.copyFailed)
    }
  }

  return (
    <>
      <CommonButton type="button" variant="primary" className="flex-1" onClick={open}>
        {shareSheetCopy.open}
      </CommonButton>

      <dialog
        ref={ref}
        onMouseDown={(e) => {
          downOnBackdrop.current = e.target === ref.current
        }}
        onClick={(e) => {
          if (downOnBackdrop.current && e.target === ref.current) close()
        }}
        aria-labelledby="share-title"
        className="sheet m-auto mb-0 w-full max-w-2xl rounded-t-3xl p-0"
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          color: 'var(--ink)',
        }}
      >
        <div className="flex flex-col gap-5 p-6">
          <div>
            <h2 id="share-title" className="serif text-lg font-bold">
              {shareSheetCopy.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {shareSheetCopy.note}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* 키가 없으면 아예 안 그린다. 눌러도 아무 일 없는 버튼을 두지 않는다 */}
            {kakaoReady() && (
              <CommonButton type="button" variant="primary" onClick={sendKakao}>
                {shareSheetCopy.kakao}
              </CommonButton>
            )}
            <CommonButton type="button" variant="ghost" onClick={copyLink}>
              {shareSheetCopy.copy}
            </CommonButton>
          </div>

          {/*
            눌러서 생긴 결과를 말해준다. 복사는 화면이 안 바뀌는 동작이라
            알려주지 않으면 됐는지 안 됐는지를 알 방법이 없다
          */}
          <p
            role="status"
            className="min-h-4 text-center text-xs"
            style={{ color: 'var(--ink-soft)' }}
          >
            {notice}
          </p>

          <p className="text-center text-11" style={{ color: 'var(--ink-faint)' }}>
            {SITE_HOST}
          </p>
        </div>

        <CommonButton type="button" variant="ink" fullBleed onClick={close}>
          {shareSheetCopy.close}
        </CommonButton>
      </dialog>
    </>
  )
}
