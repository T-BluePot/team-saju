import { describe, expect, it } from 'vitest'

import { copyFiles, extractLiterals, scanSource } from '../inlineCopyScan.ts'

/**
 * 스캐너 자체의 회귀 테스트.
 *
 * 예전에는 주석을 손으로 지웠고, 그 판정이 틀리면 문구가 하나도 없는데 가드가
 * 실패했다. 아래 네 줄은 그때 실제로 깨졌던 자리다. 파서에 맡긴 지금은 구조적으로
 * 안 나지만, 다시 손으로 짜고 싶어질 때를 위해 남긴다.
 */
describe('주석은 문구가 아니다', () => {
  const cases: Array<[string, string]> = [
    ['JSX 닫는 태그 뒤 줄주석', '<div>{x}</div> // 여기 한글 주석'],
    ['JSX 닫는 태그 뒤 블록주석', '<div>{x}</div> /* 한글 */'],
    ['정규식 안의 따옴표', `const clean = (s: string) => s.replace(/[\\/:*?"<>|\\s]+/g, '-') // 한글 주석`],
    ['안 닫힌 문자 클래스', 'const re = /[abc/ // 한글 주석'],
    ['여러 줄 주석', '/**\n * 한글 설명\n */\nconst a = 1'],
  ]

  it.each(cases)('%s', (_name, source) => {
    expect(scanSource(source, true)).toEqual([])
  })
})

describe('문구는 잡는다', () => {
  const hit = (source: string) => scanSource(source, true)

  it('JSX 사이의 글', () => {
    expect(hit('<p>여기 문구</p>')).toHaveLength(1)
  })

  it('따옴표 문자열', () => {
    expect(hit(`const a = '여기 문구'`)).toHaveLength(1)
  })

  it('템플릿의 고정 부분', () => {
    expect(hit('const a = `${n}명 분석하기`')).toHaveLength(1)
  })

  it('한 줄에 여러 개면 한 건으로 합친다', () => {
    const hits = hit(`const a = ['하나', '둘']`)
    expect(hits).toHaveLength(1)
    expect(hits[0].chars).toBe(3)
  })

  it('줄 번호와 원문을 같이 준다', () => {
    const hits = hit('const a = 1\nconst b = `문구`')
    expect(hits[0].line).toBe(2)
    expect(hits[0].text).toBe('const b = `문구`')
  })
})

describe('카피가 아닌 것은 안 잡는다', () => {
  it('import 경로', () => {
    expect(scanSource(`import { a } from '../lib/copy'`, true)).toEqual([])
  })

  it('오행 키는 식별자라 문자열이 아니다', () => {
    expect(scanSource('const c = { 木: 1, 火: 2 }', true)).toEqual([])
  })

  it('허용 낱말만 있으면 넘어간다', () => {
    expect(scanSource(`const k = { year: '연주', month: '월주' }`, true)).toEqual([])
  })

  it('허용 낱말에 다른 말이 붙으면 잡는다', () => {
    expect(scanSource(`const n = '시주를 빼고 봅니다'`, true)).toHaveLength(1)
  })
})

/** 한글만 보던 시절에는 `宜` `忌` `處方` 이 그냥 새어나갔다. */
describe('한자도 본다', () => {
  it('한자 문구', () => {
    expect(scanSource(`const s = '處方 · 이번 주에 해볼 것'`, true)).toHaveLength(1)
  })

  it('한자만 있어도 잡는다', () => {
    expect(scanSource(`const s = '宜'`, true)).toHaveLength(1)
  })

  it('자모만 쓴 문구도 잡는다', () => {
    expect(scanSource(`const a = 'ㅎㅎ'`, true)).toHaveLength(1)
  })

  it('보간 식 안의 문자열도 카피다', () => {
    expect(scanSource("const a = `${x ? '한글' : ''}`", true)).toHaveLength(1)
  })

  it('도장 글리프는 장식이라 넘어간다', () => {
    expect(scanSource(`const seal = '占'`, true)).toEqual([])
  })
})

describe('금지어 검사가 볼 문자열', () => {
  it('주석은 안 넘긴다', () => {
    const literals = extractLiterals(`// 건강\nconst a = '문구'`)
    expect(literals).toEqual(['문구'])
  })

  it('배럴까지 포함해 카피 파일을 전부 찾는다', () => {
    expect(copyFiles()).toContain('src/lib/copy/index.ts')
  })
})
