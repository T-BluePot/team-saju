import { describe, expect, it } from 'vitest'

import { hasFinalConsonant, object, subject, topic } from '../josa'
import { ELEMENT_LABEL } from '../../saju/constants'

describe('조사 붙이기', () => {
  it('오행 이름의 받침을 맞게 본다', () => {
    // 목 금은 받침이 있고 화 토 수는 없다
    expect(hasFinalConsonant(ELEMENT_LABEL.木)).toBe(true)
    expect(hasFinalConsonant(ELEMENT_LABEL.金)).toBe(true)
    expect(hasFinalConsonant(ELEMENT_LABEL.火)).toBe(false)
    expect(hasFinalConsonant(ELEMENT_LABEL.土)).toBe(false)
    expect(hasFinalConsonant(ELEMENT_LABEL.水)).toBe(false)
  })

  it('이 가 을 를 은 는 을 가려 붙인다', () => {
    expect(subject('목')).toBe('목이')
    expect(subject('화')).toBe('화가')
    expect(object('금')).toBe('금을')
    expect(object('수')).toBe('수를')
    expect(topic('목')).toBe('목은')
    expect(topic('토')).toBe('토는')
  })

  it('한글이 아니면 받침 없는 쪽으로 본다', () => {
    expect(hasFinalConsonant('')).toBe(false)
    expect(hasFinalConsonant('A')).toBe(false)
    expect(hasFinalConsonant('1')).toBe(false)
  })
})
