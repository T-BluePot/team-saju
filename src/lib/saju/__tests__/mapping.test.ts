import { describe, expect, it } from 'vitest'
import { LunarUtil } from 'lunar-typescript'

import { NAYIN_KO, STRONG_STAGES, TWELVE_STAGE_KO } from '../constants'

/**
 * 라이브러리 표와 직접 대조한다.
 *
 * 날짜를 여러 개 돌려보는 방식은 커버리지가 우연에 기댄다. 날짜를 하나 바꾸거나
 * 라이브러리가 절기 테이블을 손보면 조용히 줄어든다. 표를 직접 보면 값 하나만 바뀌어도 깨진다.
 *
 * 매핑이 빠지면 `?? raw` 폴백으로 간체가 화면에 그대로 뜬다.
 */
describe('라이브러리 값과 매핑 대조', () => {
  it('십이운성 열둘을 빠짐없이 옮긴다', () => {
    const missing = LunarUtil.CHANG_SHENG.filter((v) => !(v in TWELVE_STAGE_KO))
    expect(missing, `매핑에 없는 십이운성: ${missing.join(' ')}`).toEqual([])
    expect(LunarUtil.CHANG_SHENG).toHaveLength(12)
  })

  it('매핑에 라이브러리가 안 쓰는 값이 없다', () => {
    const extra = Object.keys(TWELVE_STAGE_KO).filter(
      (k) => !LunarUtil.CHANG_SHENG.includes(k),
    )
    expect(extra, `라이브러리가 안 쓰는 키: ${extra.join(' ')}`).toEqual([])
  })

  it('납음 서른 가지를 빠짐없이 옮긴다', () => {
    const all = LunarUtil.JIA_ZI.map((gz) => LunarUtil.NAYIN[gz])
    const distinct = [...new Set(all)]
    expect(distinct).toHaveLength(30)

    const missing = distinct.filter((v) => !(v in NAYIN_KO))
    expect(missing, `매핑에 없는 납음: ${missing.join(' ')}`).toEqual([])

    const extra = Object.keys(NAYIN_KO).filter((k) => !distinct.includes(k))
    expect(extra, `라이브러리가 안 쓰는 키: ${extra.join(' ')}`).toEqual([])
  })

  it('옮긴 값에 한자가 안 섞인다', () => {
    // 폴백으로 원문이 새면 여기서 걸린다
    const han = /[\u4e00-\u9fff]/
    for (const [raw, ko] of Object.entries(TWELVE_STAGE_KO)) {
      expect(han.test(ko), `${raw} 가 한자로 남았다: ${ko}`).toBe(false)
    }
    for (const [raw, ko] of Object.entries(NAYIN_KO)) {
      expect(han.test(ko), `${raw} 가 한자로 남았다: ${ko}`).toBe(false)
    }
  })

  it('센 단계 목록이 실제 표시값과 어긋나지 않는다', () => {
    // 카피를 다듬다 한 글자만 바뀌어도 배지 색이 전부 회색으로 떨어진다
    const values = Object.values(TWELVE_STAGE_KO)
    const orphan = [...STRONG_STAGES].filter((s) => !values.includes(s))
    expect(orphan, `표시값에 없는 센 단계: ${orphan.join(' ')}`).toEqual([])
  })
})
