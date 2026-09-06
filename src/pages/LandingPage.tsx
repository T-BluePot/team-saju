import { CommonButton } from '../components/Common'
import { ARCHETYPES } from '../lib/report/archetypes'
import { LANDING_TASTE } from '../lib/report/sample'
import { useTeamStore } from '../store/teamStore'

export function LandingPage() {
  const goInput = useTeamStore((s) => s.goInput)
  const showExample = useTeamStore((s) => s.showExample)

  const steps: Array<[string, string, string]> = [
    ['一', '팀원을 넣습니다', '이름과 생년월일. 시간은 몰라도 됩니다'],
    ['二', '코드가 계산합니다', '절기 기준으로 여덟 글자를 뽑습니다'],
    ['三', '팀 리포트가 나옵니다', '유형, 강점, 이번 주에 해볼 것까지'],
  ]

  return (
    <div className="flex flex-col gap-9 py-6">
      <div>
        <p className="serif text-sm" style={{ color: 'var(--accent-deep)' }}>
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

      <div>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          이런 유형이 나옵니다
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
            그리고 {ARCHETYPES.length - LANDING_TASTE.length}가지 더
          </li>
        </ul>
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

      <div className="flex flex-col gap-2.5">
        <CommonButton type="button" variant="primary" serif onClick={goInput}>
          팀 만들기
        </CommonButton>
        <CommonButton type="button" variant="ghost" onClick={showExample}>
          예시 리포트 먼저 보기
        </CommonButton>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        재미로 보는 콘텐츠입니다. 채용이나 평가에 쓰라고 만든 게 아닙니다.
        <br />
        입력한 정보는 아무데도 저장되지 않고 새로고침하면 사라집니다.
      </p>
    </div>
  )
}
