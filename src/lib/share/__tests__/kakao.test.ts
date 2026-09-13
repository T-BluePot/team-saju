import { afterEach, describe, expect, it, vi } from 'vitest'

import { SITE_URL } from '../../config'

/**
 * 카카오 버튼을 어디서 그리나.
 *
 * 키는 번들에 그대로 박히는 값이라, 코드 가드가 풀리면 프리뷰 배포나 남의 사이트에서
 * 버튼이 뜬다. 진짜 제한은 카카오 콘솔이지만 코드 쪽 목록이 그 등록과 어긋나지
 * 않게 여기서 고정한다.
 *
 * 키는 `config.ts` 가 모듈을 읽을 때 한 번 정하므로 주소와 키를 바꿀 때마다 새로 읽는다.
 */
async function readyAt(url: string, key = 'test-key'): Promise<boolean> {
  const { origin, hostname } = new URL(url)
  vi.stubGlobal('window', { location: { origin, hostname } })
  vi.stubEnv('VITE_KAKAO_JS_KEY', key)
  vi.resetModules()
  const { kakaoReady } = await import('../kakao')
  return kakaoReady()
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('카카오 버튼을 그려도 되는 주소', () => {
  it('배포 주소에서는 그린다', async () => {
    expect(await readyAt(SITE_URL)).toBe(true)
    expect(await readyAt(`${SITE_URL}/?x=1#demo`)).toBe(true)
  })

  it('다른 주소에서는 안 그린다', async () => {
    expect(await readyAt('https://evil.example.com')).toBe(false)
    expect(await readyAt('https://abc123.team-saju.pages.dev')).toBe(false)
    // 스킴이 다르면 다른 주소다
    expect(await readyAt(SITE_URL.replace('https://', 'http://'))).toBe(false)
  })

  it('개발 서버는 localhost 만 연다', async () => {
    expect(await readyAt('http://localhost:5180')).toBe(true)
    expect(await readyAt('http://192.168.0.10:5180')).toBe(false)
  })

  it('키가 없으면 배포 주소에서도 안 그린다', async () => {
    expect(await readyAt(SITE_URL, '')).toBe(false)
  })
})
