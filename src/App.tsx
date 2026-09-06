import { useMemo, useState } from 'react'

import { ConsentModal } from './components/ConsentModal'
import { LoadingView } from './components/LoadingView'
import { MemberForm } from './components/MemberForm'
import { PersonalView } from './components/PersonalView'
import { TeamReportView } from './components/TeamReportView'
import { buildTeamReport } from './lib/report/teamReport'
import { ELEMENT_COLOR } from './lib/ui/elementStyle'
import { MAX_MEMBERS, useTeamStore } from './store/teamStore'

const NOTICE = '이 브라우저에만 있고 아무데도 저장되지 않습니다 · 재미로 보는 콘텐츠입니다'

export default function App() {
  const consented = useTeamStore((s) => s.consented)
  const view = useTeamStore((s) => s.view)
  const agree = useTeamStore((s) => s.agree)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-8">
        {view === 'landing' && <Landing />}
        {view === 'input' && <InputPage />}
        {view === 'loading' && <LoadingPage />}
        {view === 'result' && <ResultPage />}
      </main>
      <Notice />
      {!consented && view !== 'landing' && <ConsentModal onAgree={agree} />}
    </div>
  )
}

function Header() {
  const reset = useTeamStore((s) => s.reset)
  const view = useTeamStore((s) => s.view)

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-sm"
      style={{
        background: 'color-mix(in srgb, var(--paper) 88%, transparent)',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="seal size-6 text-[11px]">占</span>
          <span className="serif text-base font-extrabold tracking-tight">팀사주</span>
        </div>
        {(view === 'result' || view === 'loading') && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg px-3 py-1.5 text-sm"
            style={{ border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
          >
            처음부터
          </button>
        )}
      </div>
    </header>
  )
}

function Landing() {
  const goInput = useTeamStore((s) => s.goInput)

  const steps: Array<[string, string, string]> = [
    ['一', '팀원을 넣습니다', '이름과 생년월일. 시간은 몰라도 됩니다'],
    ['二', '코드가 계산합니다', '절기 기준으로 여덟 글자를 뽑습니다'],
    ['三', '팀 리포트가 나옵니다', '유형, 강점, 이번 주에 해볼 것까지'],
  ]

  return (
    <div className="flex flex-col gap-9 py-6">
      <div>
        <p className="serif text-sm" style={{ color: 'var(--cinnabar)' }}>
          四柱로 보는 팀 궁합
        </p>
        <h1 className="serif mt-4 text-[2.4rem] font-extrabold leading-[1.2] sm:text-5xl">
          우리 팀은
          <br />
          어떤 팀일까
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          팀원 생년월일시를 넣으면 팀 전체의 오행 조합을 보고 어떤 유형인지, 뭐가
          비었는지 알려드립니다
        </p>
      </div>

      <hr className="rule-double" />

      <ol className="flex flex-col">
        {steps.map(([num, title, note], i) => (
          <li
            key={title}
            className="flex gap-5 py-4"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--rule)' }}
          >
            <span
              className="serif w-5 shrink-0 text-lg font-bold"
              style={{ color: 'var(--cinnabar)' }}
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

      <button
        type="button"
        onClick={goInput}
        className="serif rounded-2xl px-5 py-4 text-lg font-bold text-white"
        style={{ background: 'var(--cinnabar)' }}
      >
        팀 만들기
      </button>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        재미로 보는 콘텐츠입니다. 채용이나 평가에 쓰라고 만든 게 아닙니다.
        <br />
        입력한 정보는 아무데도 저장되지 않고 새로고침하면 사라집니다.
      </p>
    </div>
  )
}

function InputPage() {
  const members = useTeamStore((s) => s.members)
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const setTeamName = useTeamStore((s) => s.setTeamName)
  const addMember = useTeamStore((s) => s.addMember)
  const removeMember = useTeamStore((s) => s.removeMember)
  const goResult = useTeamStore((s) => s.goResult)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="teamName" className="serif text-sm font-bold">
          팀 이름
        </label>
        <input
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          maxLength={20}
          placeholder="우리 팀"
          className="rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            color: 'var(--ink)',
          }}
        />
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          공유 이미지에 들어갑니다. 편한 이름으로 적어주세요
        </p>
      </div>

      {charts.length > 0 && (
        <div>
          <p className="serif mb-2.5 text-sm font-bold">
            팀원 {charts.length}명
            <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>
              최대 {MAX_MEMBERS}명
            </span>
          </p>
          <ul className="flex flex-wrap gap-2">
            {charts.map((c) => (
              <li
                key={c.member.id}
                className="flex items-center gap-2 rounded-full py-1.5 pl-3.5 pr-2"
                style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }}
              >
                <span className="text-sm font-medium">{c.member.name}</span>
                <span
                  className="serif text-sm font-bold"
                  style={{ color: ELEMENT_COLOR[c.elements.dominant] }}
                >
                  {c.elements.dominant}
                </span>
                {c.member.consent.source === 'delegated' && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px]"
                    style={{ background: 'var(--cinnabar-wash)', color: 'var(--cinnabar)' }}
                  >
                    대리
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeMember(c.member.id)}
                  aria-label={`${c.member.name} 삭제`}
                  className="flex size-5 items-center justify-center rounded-full text-xs"
                  style={{ background: 'var(--paper-deep)', color: 'var(--ink-soft)' }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <MemberForm onSubmit={addMember} disabled={members.length >= MAX_MEMBERS} />

      <button
        type="button"
        onClick={goResult}
        disabled={members.length < 1}
        className="serif sticky bottom-12 rounded-2xl px-5 py-4 text-lg font-bold text-white disabled:opacity-35"
        style={{ background: 'var(--cinnabar)' }}
      >
        {members.length < 1 ? '팀원을 1명 이상 넣어주세요' : `${members.length}명 분석하기`}
      </button>
    </div>
  )
}

function LoadingPage() {
  const charts = useTeamStore((s) => s.charts)
  const finishLoading = useTeamStore((s) => s.finishLoading)
  return <LoadingView charts={charts} onDone={finishLoading} />
}

function ResultPage() {
  const charts = useTeamStore((s) => s.charts)
  const teamName = useTeamStore((s) => s.teamName)
  const goBack = useTeamStore((s) => s.goBack)
  const [tab, setTab] = useState<'team' | 'personal'>('team')

  const report = useMemo(() => buildTeamReport(charts, teamName), [charts, teamName])

  if (charts.length === 0) return null

  const tabs: Array<['team' | 'personal', string]> = [
    ['team', '팀 리포트'],
    ['personal', '개인 명식'],
  ]

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-5">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className="serif pb-1.5 text-base font-bold"
              style={{
                color: tab === key ? 'var(--ink)' : 'var(--ink-soft)',
                borderBottom:
                  tab === key ? '2px solid var(--cinnabar)' : '2px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={goBack}
          className="rounded-lg px-3 py-1.5 text-sm"
          style={{ border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
        >
          팀원 수정
        </button>
      </div>

      {tab === 'team' ? (
        <TeamReportView report={report} />
      ) : (
        <PersonalView charts={charts} pairs={report.analysis.pairs} />
      )}
    </div>
  )
}

function Notice() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 px-4 py-2 text-center text-[11px]"
      style={{
        background: 'color-mix(in srgb, var(--paper) 94%, transparent)',
        borderTop: '1px solid var(--rule)',
        color: 'var(--ink-soft)',
      }}
    >
      {NOTICE}
    </div>
  )
}
