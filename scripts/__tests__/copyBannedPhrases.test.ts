import { describe, expect, it } from 'vitest'

import { BANNED_PHRASES } from '../../src/lib/report/__tests__/bannedPhrases.ts'
import { copyFiles, extractLiterals, read } from '../inlineCopyScan.ts'

/**
 * 리포트 본문에 걸어둔 금지어를 화면 문구에도 건다.
 *
 * 목록은 복사하지 않고 그대로 가져온다. 그 파일에 "카피 테스트가 여러 파일로
 * 늘면서 목록이 복사되기 시작했다. 한 곳에 둔다" 고 적혀 있다.
 */
describe('화면 문구', () => {
  const files = copyFiles()

  it('카피 파일을 찾는다', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s 에 금지 표현이 없다', (file) => {
    const literals = extractLiterals(read(file))

    for (const literal of literals) {
      for (const banned of BANNED_PHRASES) {
        expect(literal).not.toMatch(banned)
      }
    }
  })
})
