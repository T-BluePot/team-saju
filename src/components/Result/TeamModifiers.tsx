import { CommonRule, CommonSubHeading } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'

/**
 * 유형 위에 얹는 변주.
 *
 * 주도와 결핍 두 변수만으로는 3인 팀과 8인 팀이 같은 결과로 떨어진다.
 * 같은 유형이어도 이게 다르면 다른 팀이다.
 *
 * 사람을 지목하지 않는다. 누가 겉도는지 이름을 쓰면 배제하는 UI 가 된다.
 */
export function TeamModifiers({ report }: { report: TeamReport }) {
  if (report.modifiers.length === 0) return null

  return (
    <>
      <CommonRule />

      <CommonSubHeading>이 팀만의 변주</CommonSubHeading>
      <p className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
        같은 유형이어도 여기가 다르면 다른 팀입니다
      </p>

      <ul className="mt-3 flex flex-col gap-4">
        {report.modifiers.map((m) => (
          <li key={m.id}>
            <span
              className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: 'var(--accent-wash)', color: 'var(--accent-deep)' }}
            >
              {m.label}
            </span>
            <p className="mt-1.5 text-sm leading-relaxed">{m.line}</p>
            {m.fix && (
              <p
                className="mt-1.5 border-l-2 pl-3 text-sm leading-relaxed"
                style={{ borderColor: 'var(--accent)', color: 'var(--ink-soft)' }}
              >
                {m.fix}
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
