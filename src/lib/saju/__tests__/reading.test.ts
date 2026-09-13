import { describe, expect, it } from 'vitest'

import { BRANCHES, STEMS } from '../constants'
import { BRANCH_ANIMAL, STEM_IMAGE, TONE_KO, dayReading } from '../reading'

describe('일주 물상', () => {
  it('천간 열과 지지 열둘이 다 있다', () => {
    for (const s of STEMS) expect(STEM_IMAGE[s], s).toBeTruthy()
    for (const b of BRANCHES) expect(BRANCH_ANIMAL[b], b).toBeTruthy()
  })

  it('물상이 겹치지 않는다', () => {
    // 겹치면 열 중 둘이 같은 사람으로 읽힌다
    expect(new Set(Object.values(STEM_IMAGE)).size).toBe(10)
    expect(new Set(Object.values(BRANCH_ANIMAL)).size).toBe(12)
  })

  it('庚戌 은 산 중턱의 바위와 흰 개다', () => {
    // 색은 지지가 아니라 일간의 오행이 정한다. 庚 은 金 이라 흰
    expect(dayReading({ stem: '庚', branch: '戌' })).toEqual({
      image: '산 중턱의 바위',
      animal: '흰 개',
    })
  })

  it('색은 일간 오행을 따라간다', () => {
    // 같은 지지라도 일간이 바뀌면 색이 바뀐다
    expect(dayReading({ stem: '甲', branch: '午' }).animal).toBe('푸른 말')
    expect(dayReading({ stem: '丙', branch: '午' }).animal).toBe('붉은 말')
    expect(new Set(Object.values(TONE_KO)).size).toBe(5)
  })

  it('60갑자 어디를 넣어도 두 값이 다 나온다', () => {
    for (const stem of STEMS) {
      for (const branch of BRANCHES) {
        const r = dayReading({ stem, branch })
        expect(r.image, `${stem}${branch}`).toBeTruthy()
        expect(r.animal, `${stem}${branch}`).toMatch(/^\S+ \S+$/)
      }
    }
  })

  it('물상에 성격을 붙이지 않는다', () => {
    // 표에 없는 얘기를 지어내는 순간 "주어진 팩트만" 이 깨진다. 명사구까지가 몫이다
    for (const v of Object.values(STEM_IMAGE)) {
      expect(v, v).not.toMatch(/합니다|해요|입니다|하다|성격|사람/)
    }
  })
})
