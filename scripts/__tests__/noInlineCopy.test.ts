import { describe, expect, it } from 'vitest'

import { ALLOWED_TERMS, SCAN_DIRS, scanRepo } from '../inlineCopyScan.ts'

/**
 * 화면 문구는 `src/lib/copy/` 에 모으기로 했다. 컴포넌트로 다시 새어나오면 여기가 깨진다.
 *
 * 예외는 파일이 아니라 낱말 단위다. 파일을 통째로 빼면 그 파일에 새로 들어온
 * 카피까지 같이 눈감아준다. 늘어나는 게 보여야 하니 `ALLOWED_TERMS` 에
 * 낱말마다 이유를 붙여 둔다.
 */
describe('인라인 한글', () => {
  it(`${SCAN_DIRS.join(', ')} 에 남아 있지 않다`, () => {
    const leftovers = scanRepo(true).flatMap((scan) =>
      scan.hits.map((hit) => `${scan.file}:${hit.line}  ${hit.text}`),
    )

    expect(leftovers).toEqual([])
  })

  it('허용 낱말은 명리 용어뿐이다', () => {
    // 문장이 통째로 들어오면 그 파일의 카피가 전부 가려진다
    for (const term of ALLOWED_TERMS) {
      expect(term.length).toBeLessThanOrEqual(6)
    }
  })
})
