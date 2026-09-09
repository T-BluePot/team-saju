import { CommonBlock, CommonEntry, CommonEntryList } from '../Common'
import type { TeamReport } from '../../lib/report/teamReport'
import { modifiersCopy, resultCopy } from '../../lib/copy'

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
    <CommonBlock label={modifiersCopy.heading} description={modifiersCopy.note}>
      {/*
        분홍 칩을 걷었다. 변주가 서넛씩 붙는 자리라 칩이 줄마다 뜨면
        같은 강조가 반복돼서 정작 본문이 뒤로 물러난다.
      */}
      <CommonEntryList divided>
        {report.modifiers.map((m) => (
          <div key={m.id}>
            <p className="mb-1.5 text-sm font-bold" style={{ color: 'var(--accent-deep)' }}>
              {m.label}
            </p>
            <CommonEntry fix={m.fix} fixMark={resultCopy.prescriptionMark}>
              {m.line}
            </CommonEntry>
          </div>
        ))}
      </CommonEntryList>
    </CommonBlock>
  )
}
