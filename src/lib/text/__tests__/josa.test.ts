import { describe, expect, it } from 'vitest'

import { and, hasFinalConsonant, object, subject, topic } from '../josa'
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

  it('한글이 아니면 받침을 셀 수 없다', () => {
    expect(hasFinalConsonant('')).toBe(false)
    expect(hasFinalConsonant('A')).toBe(false)
    expect(hasFinalConsonant('1')).toBe(false)
  })

  it('한글이 아닌 이름에는 둘 다 적는다', () => {
    // 이름은 자유 입력이다. Kim 이나 팀원0 은 받침 소리로 끝나는데 음절이 아니라
    // 셀 수가 없다. 하나를 고르면 조용히 틀린다. 괄호는 못생겨도 틀리지 않는다
    expect(subject('Kim')).toBe('Kim이(가)')
    expect(subject('팀원0')).toBe('팀원0이(가)')
    expect(object('Amy')).toBe('Amy을(를)')
    expect(subject('은우')).toBe('은우가')
    expect(subject('김')).toBe('김이')
  })

  it('여럿을 이을 때 앞말 받침을 본다', () => {
    expect(and([])).toBe('')
    expect(and(['조율'])).toBe('조율')
    expect(and(['조율', '실행'])).toBe('조율과 실행')
    expect(and(['추진', '기획', '분석'])).toBe('추진, 기획과 분석')
    // 받침이 없으면 와
    expect(and(['가', '나'])).toBe('가와 나')
  })
})
