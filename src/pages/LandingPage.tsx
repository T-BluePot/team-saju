import { CommonButton } from '../components/Common'
import { AppBottomBar } from '../components/Layout'
import { LandingConsent, LandingTasteScroll } from '../components/Landing'
import { landingCopy } from '../lib/copy'
import { useTeamStore } from '../store/teamStore'

export function LandingPage() {
  const goInput = useTeamStore((s) => s.goInput)
  const showExample = useTeamStore((s) => s.showExample)
  const consented = useTeamStore((s) => s.consented)
  const setConsent = useTeamStore((s) => s.setConsent)

  return (
    <div className="flex flex-col gap-9 pt-6">
      <div>
        {/* 아이브로우는 머리글로 올라갔다. commonCopy.tagline */}
        <h1 className="serif text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
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

      {/*
        유형을 알약으로 늘어놓으면 이름만 스치고 지나간다. 한 장씩 걸어두면
        한 유형을 끝까지 읽는다. 판은 결과 화면 것과 같다.
      */}
      <div>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          {landingCopy.tasteLabel}
        </p>
        <div className="mt-4">
          <LandingTasteScroll />
        </div>
      </div>

      <hr className="rule-double" />

      <ol className="flex flex-col">
        {landingCopy.steps.map(([num, title, note], i) => (
          <li
            key={title}
            className="flex gap-5 py-4"
            // 항목 사이는 점선 --rule-faint. index.css 의 괘선 표를 따른다
            style={{ borderTop: i === 0 ? 'none' : '1px dashed var(--rule-faint)' }}
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

        동의 전에는 팀 만들기를 못 누른다. 바로 위 체크박스가 왜 막혔는지를
        말해준다. 예시 리포트는 개인정보를 안 넣으니 그대로 열어둔다.
      */}
      <AppBottomBar>
        <LandingConsent consented={consented} onChange={setConsent} />
        <CommonButton
          type="button"
          variant="primary"
          serif
          onClick={goInput}
          disabled={!consented}
        >
          {landingCopy.ctaStart}
        </CommonButton>
        {/*
          주 버튼과 같은 크기로 두면 둘 중 뭘 눌러야 하는지가 안 갈린다.
          한 단 내려서 밑줄 링크로 둔다
        */}
        <button
          type="button"
          onClick={showExample}
          className="press mx-auto rounded px-2 py-1.5 text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: 'var(--ink-soft)', outlineColor: 'var(--accent)' }}
        >
          {landingCopy.ctaExample}
        </button>
      </AppBottomBar>
    </div>
  )
}
