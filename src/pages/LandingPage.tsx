import { CommonButton } from '../components/Common'
import { LandingConsent } from '../components/Landing'
import { landingCopy } from '../lib/copy'
import { ARCHETYPES } from '../lib/report/archetypes'
import { LANDING_TASTE } from '../lib/report/sample'
import { useTeamStore } from '../store/teamStore'

export function LandingPage() {
  const goInput = useTeamStore((s) => s.goInput)
  const showExample = useTeamStore((s) => s.showExample)
  const consented = useTeamStore((s) => s.consented)
  const setConsent = useTeamStore((s) => s.setConsent)

  return (
    // `main` 의 `pb-28` 을 상쇄한다. 안 그러면 끝까지 내렸을 때 sticky 가 제 자리로
    // 내려앉으면서 바닥에서 112px 떠오르고, 버튼 아래에 한지 결이 다시 드러난다
    <div className="-mb-28 flex flex-col gap-9 pt-6">
      <div>
        {/* 아이브로우는 머리글로 올라갔다. commonCopy.tagline */}
        <h1 className="serif text-32 font-extrabold leading-tight tracking-tight sm:text-5xl">
          {landingCopy.titleTop}
          <br />
          {landingCopy.titleBottom}
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {landingCopy.leadTop}
          <br />
          {landingCopy.leadBottom}
        </p>
      </div>

      <div>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          {landingCopy.tasteLabel}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {LANDING_TASTE.map((name) => (
            <li
              key={name}
              className="serif rounded-full px-3.5 py-1.5 text-sm font-bold"
              style={{
                background: 'var(--accent-wash)',
                color: 'var(--accent-deep)',
              }}
            >
              {name}
            </li>
          ))}
          <li
            className="rounded-full px-3.5 py-1.5 text-sm"
            style={{ background: 'var(--paper-deep)', color: 'var(--ink-soft)' }}
          >
            {landingCopy.tasteMore(ARCHETYPES.length - LANDING_TASTE.length)}
          </li>
        </ul>
      </div>

      <hr className="rule-double" />

      <ol className="flex flex-col">
        {landingCopy.steps.map(([num, title, note], i) => (
          <li
            key={title}
            className="flex gap-5 py-4"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--rule)' }}
          >
            <span
              className="serif w-5 shrink-0 text-lg font-bold"
              style={{ color: 'var(--accent-deep)' }}
            >
              {num}
            </span>
            <div>
              <p className="serif text-base font-bold">{title}</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
                {note}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-center text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {landingCopy.noticeTop}
        <br />
        {landingCopy.noticeBottom}
      </p>

      {/*
        시작 버튼은 바닥에 붙여둔다. 흐름 안에 두면 유형 목록과 三단 설명에 밀려
        접힌 자리 밑으로 내려가고, 첫 화면에서 뭘 하면 되는지가 안 보인다.
        머리글처럼 반투명으로 뒀더니 三단 설명이 버튼 위로 비쳐서 지저분했다.
        머리글은 뒤로 지나가는 게 얼마 없지만 여기는 면이 넓다. 불투명하게 덮는다.

        바닥에 딱 붙이고 아래 패딩으로 `AppNotice` 높이를 먹는다. 입력 화면처럼
        `bottom-12` 로 띄우면 바와 고지 사이 48px 이 뚫려서 본문이 그 틈으로 지나간다.
        버튼 하나일 때는 티가 안 났는데 여기는 면이 넓어서 바로 보인다.
      */}
      <div
        className="sticky bottom-0 -mx-5 flex flex-col gap-2.5 px-5 pb-12 pt-3"
        style={{
          background: 'var(--paper)',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <LandingConsent consented={consented} onChange={setConsent} />
        {/*
          동의 전에는 못 누른다. 바로 위 체크박스가 왜 막혔는지를 말해준다.
          예시 리포트는 개인정보를 안 넣으니 그대로 열어둔다.
        */}
        <CommonButton
          type="button"
          variant="primary"
          serif
          onClick={goInput}
          disabled={!consented}
        >
          {landingCopy.ctaStart}
        </CommonButton>
        <CommonButton type="button" variant="ghost" onClick={showExample}>
          {landingCopy.ctaExample}
        </CommonButton>
      </div>
    </div>
  )
}
