import { CommonRule, CommonSubHeading } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'
import { modifiersCopy } from '../../lib/copy'

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

      <CommonSubHeading>{modifiersCopy.heading}</CommonSubHeading>
      <p className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
        {modifiersCopy.note}
      </p>

      {/*
        분홍 칩을 걷었다. 변주가 서넛씩 붙는 자리라 칩이 줄마다 뜨면
        같은 강조가 반복돼서 정작 본문이 뒤로 물러난다.
        라벨은 볼드로 두고 항목 경계는 점선으로만 긋는다.
      */}
      <ul className="mt-3 flex flex-col">
        {report.modifiers.map((m, i) => (
          <li
            key={m.id}
            className={i === 0 ? 'pb-4' : 'py-4'}
            style={i === 0 ? undefined : { borderTop: '1px dashed var(--rule-faint)' }}
          >
            <p className="text-sm font-bold">{m.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed">{m.line}</p>
            {m.fix && (
              <p
                className="mt-2 rounded-xl px-4 py-3 text-sm leading-relaxed"
                style={{ background: 'var(--paper-deep)', color: 'var(--ink-soft)' }}
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
