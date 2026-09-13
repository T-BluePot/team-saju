import { describe, expect, it } from 'vitest'

import {
  ELEMENT_PAIRS,
  MIN_RATIO,
  ON_ACCENT_SURFACES,
  PAIRS,
  auditContrast,
  auditOnAccentPairs,
  contrast,
  readCss,
  resolve,
  scopes,
  styleFiles,
} from '../contrastAudit.ts'

/**
 * `CLAUDE.md` 의 `대비 4.5:1` 을 토큰에 건다.
 *
 * 화면을 훑는 감사로 한 번 했다가 놓쳤다. 표본 팀이 火 주도라 `--accent` 가 한 갈래로만
 * 풀렸고, 土 팀에서 處 도장이 3.04:1 인 걸 못 봤다. 여기서는 오행 다섯을 다 만든다.
 */
describe('색 토큰 대비', () => {
  const css = readCss()

  it('밝게 어둡게 × 기본과 오행 다섯, 열두 갈래를 만든다', () => {
    expect([...scopes(css).keys()]).toHaveLength(12)
  })

  it('잴 짝이 비어 있지 않다', () => {
    expect(PAIRS.length).toBeGreaterThan(0)
    expect(ELEMENT_PAIRS).toHaveLength(15)
  })

  it(`쓰는 짝이 전부 ${MIN_RATIO}:1 을 넘는다`, () => {
    const failures = auditContrast(css)
    const lines = failures.map(
      (f) => `${f.scope} — ${f.where}: ${f.fg} on ${f.bg} = ${f.ratio}:1`,
    )
    expect(lines).toEqual([])
  })

  /**
   * 통과만 보면 감사가 사실은 아무것도 안 재고 있어도 모른다.
   * 일부러 깨진 토큰을 넣어 물리는지 본다.
   */
  it('토큰이 어긋나면 잡는다', () => {
    const broken = css.replace('--on-accent: #fff;', '--on-accent: #cccccc;')
    expect(broken).not.toBe(css)
    expect(auditContrast(broken).length).toBeGreaterThan(0)
  })
})

/**
 * 토큰이 안전해도 컴포넌트가 짝을 잘못 고르면 소용이 없다.
 *
 * `--on-accent` 를 `--accent` 위에 얹은 자리가 실제로 둘 있었고, 표본 팀이 火 라
 * 4.53:1 로 통과해서 화면 감사로도 안 걸렸다. 土 팀은 3.04:1 이었다.
 */
describe('--on-accent 가 얹히는 면', () => {
  const files = styleFiles()

  it('색을 쓰는 파일을 찾는다', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it(`${ON_ACCENT_SURFACES.join(' 나 ')} 위에만 얹는다`, () => {
    const bad = auditOnAccentPairs(files).map(
      (m) => `${m.file}: background ${m.background ?? '(못 찾음)'}`,
    )
    expect(bad).toEqual([])
  })

  it('--accent 위에 얹으면 잡는다', () => {
    const bad = auditOnAccentPairs([
      ['가짜.tsx', `style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}`],
    ])
    expect(bad).toHaveLength(1)
    expect(bad[0].background).toBe('--accent')
  })
})

describe('대비 계산', () => {
  it('흰색과 검정은 21:1', () => {
    expect(contrast([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 5)
  })

  it('같은 색은 1:1', () => {
    expect(contrast([107, 99, 85], [107, 99, 85])).toBeCloseTo(1, 5)
  })
})

describe('토큰 풀기', () => {
  const tokens = {
    '--a': '#d93a26',
    '--b': 'var(--a)',
    '--c': 'color-mix(in srgb, var(--a) 12%, #fffdf8)',
    '--loop': 'var(--loop)',
  }

  it('var 사슬을 따라간다', () => {
    expect(resolve('var(--b)', tokens)).toEqual([217, 58, 38])
  })

  it('세 자리 hex 를 편다', () => {
    expect(resolve('#fff', tokens)).toEqual([255, 255, 255])
  })

  it('color-mix 를 섞는다', () => {
    expect(resolve('var(--c)', tokens)).toEqual([250, 230, 223])
  })

  it('돌아가는 var 에 갇히지 않는다', () => {
    expect(resolve('var(--loop)', tokens)).toBeNull()
  })
})
