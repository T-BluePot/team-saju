import { useEffect, useRef } from 'react'

import { consentCopy } from '../../lib/copy'
import { CommonButton, CommonCheckLabel } from '../Common'

type Props = {
  consented: boolean
  onChange: (next: boolean) => void
}

/**
 * 개인정보 동의. 문서 06-privacy.md
 *
 * 전에는 입력 화면에 들어서면 전면 모달이 가로막았다. 화면을 한 겹 더 쌓아놓고
 * 읽지도 않을 문서를 들이미는 꼴이라, 첫 화면에서 체크박스 한 줄로 받고
 * 자세한 내용은 원하는 사람만 열어보게 바꿨다.
 *
 * 다크패턴을 쓰지 않는다. 체크는 기본값이 꺼짐이고 저절로 켜지지 않는다.
 */
export function LandingConsent({ consented, onChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  /**
   * 열림 상태를 React 에 두지 않는다. `dialog` 자신이 이미 그걸 알고 있다.
   *
   * 처음엔 `useState` 로 거울처럼 들고 effect 로 맞췄는데, Esc 로 닫으면 브라우저가
   * 직접 닫아서 state 는 열린 채로 남는다. 그러면 다음에 상세 보기를 눌러도
   * 같은 값이라 effect 가 안 돌아서 **영영 안 열린다.**
   *
   * `close` 이벤트로 맞추려 했지만 이 이벤트는 버블링을 안 해서 React 의 `onClose`
   * 로 안 잡히고, 엘리먼트에 직접 걸어도 안 오는 브라우저가 있었다.
   * 거울을 없애면 어긋날 것도 없다.
   */
  const openDetail = () => {
    const el = ref.current
    // 이미 열려 있는데 다시 부르면 InvalidStateError 가 난다
    if (el && !el.open) el.showModal()
  }
  const closeDetail = () => ref.current?.close()

  /**
   * 뒷막을 눌러 닫을 때 누르기 시작한 자리도 같이 본다.
   *
   * `click` 만 보면 본문에서 드래그를 시작해 뒷막에서 손을 뗐을 때 target 이 공통 조상인
   * `dialog` 가 되어 걸린다. 개인정보 문구를 긁어서 복사하려다 창이 닫힌다.
   */
  const downOnBackdrop = useRef(false)

  /**
   * `#...consent` 로 들어오면 바로 연다. 개인정보 고지 딥링크이고,
   * 덤으로 캡쳐할 때 클릭을 안 거쳐도 된다. `ResultPage` 의 탭과 같은 방식이라
   * 개발 모드로 막지 않는다.
   */
  useEffect(() => {
    if (window.location.hash.includes('consent')) openDetail()
  }, [])

  return (
    <>
      <div className="flex items-center gap-2">
        <CommonCheckLabel
          checked={consented}
          onChange={(e) => onChange(e.target.checked)}
          className="min-h-11"
        >
          {consentCopy.checkbox}
        </CommonCheckLabel>
        {/* 라벨 밖에 둔다. 안에 넣으면 눌렀을 때 체크가 같이 토글된다 */}
        <button
          type="button"
          onClick={openDetail}
          className="press ml-auto shrink-0 rounded px-1 py-1 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: 'var(--ink-soft)', outlineColor: 'var(--accent)' }}
        >
          {consentCopy.openDetail}
        </button>
      </div>

      {/*
        `showModal()` 로 연다. 포커스 가두기, Esc 로 닫기, 배경 위 최상단 배치가
        전부 딸려온다. 직접 만들면 그 셋을 손으로 짜야 하고, 전에 쓰던 모달은
        포커스를 안 가둬서 뒤쪽 폼에 키보드로 들어갈 수 있었다.
      */}
      <dialog
        ref={ref}
        onMouseDown={(e) => {
          downOnBackdrop.current = e.target === ref.current
        }}
        onClick={(e) => {
          if (downOnBackdrop.current && e.target === ref.current) closeDetail()
        }}
        aria-labelledby="privacy-title"
        className="sheet m-auto mb-0 w-full max-w-2xl rounded-t-3xl p-0"
        style={{
          maxHeight: '92vh',
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          color: 'var(--ink)',
        }}
      >
        <div className="flex max-h-[92vh] flex-col">
          <div className="flex-1 overflow-y-auto px-7 pb-6 pt-8">
            <span className="seal px-2 py-1 text-[11px]" style={{ transform: 'rotate(-4deg)' }}>
              {consentCopy.seal}
            </span>

            <h2 id="privacy-title" className="serif mt-4 text-2xl font-extrabold">
              {consentCopy.title}
            </h2>

            <hr className="rule my-6" />

            {/*
              라벨을 강조색으로 두면 네 항목이 전부 눈에 띄려고 다툰다.
              읽는 순서는 라벨이 아니라 내용이라 라벨은 한 단 내리고,
              항목 경계는 점선으로만 긋는다
            */}
            <dl className="flex flex-col">
              {consentCopy.items.map(([term, desc], i) => (
                <div
                  key={term}
                  className="grid gap-3 py-3 text-xs leading-relaxed"
                  style={{
                    gridTemplateColumns: '78px 1fr',
                    borderTop: i === 0 ? undefined : '1px dashed var(--rule-faint)',
                  }}
                >
                  <dt className="font-semibold" style={{ color: 'var(--ink-soft)' }}>
                    {term}
                  </dt>
                  <dd className="m-0">{desc}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {consentCopy.footnoteTop}
              <br />
              {consentCopy.footnoteBottom}
            </p>
          </div>

          <div className="shrink-0">
            <CommonButton type="button" variant="ink" fullBleed onClick={closeDetail}>
              {consentCopy.close}
            </CommonButton>
          </div>
        </div>
      </dialog>
    </>
  )
}
