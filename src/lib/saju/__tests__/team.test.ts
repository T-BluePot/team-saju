import { describe, expect, it } from 'vitest'

import { pairChemistry } from '../team'
import { CONTROLS, ELEMENTS, GENERATES } from '../constants'
import type { Element, SajuChart } from '../types'

/**
 * `pairChemistry` 는 주도 오행과 이름만 본다.
 * 계산 전체를 돌릴 필요가 없어서 그 두 개만 채운 스텁을 쓴다.
 */
const chart = (id: string, name: string, dominant: Element) =>
  ({ member: { id, name }, elements: { dominant } }) as SajuChart

const a = (e: Element) => chart('a', '가람', e)
const b = (e: Element) => chart('b', '나린', e)

/**
 * 방향은 리팩터 이후 `team.ts` 가 정하고 `report/pairs.ts` 가 읽는다.
 * 이음매가 두 파일로 갈려서, 여기가 뒤집히면 화면에서 주어와 목적어가 바뀐 문장이 나간다.
 * `pairs.test.ts` 는 `flow` 를 손으로 넣기 때문에 이걸 못 잡는다.
 */
describe('페어 케미', () => {
  it('생하는 쪽이 ab 다', () => {
    // 木 이 火 를 생한다. 그러면 木 을 든 쪽이 주체다
    expect(pairChemistry(a('木'), b('火')).flow).toBe('ab')
    expect(pairChemistry(a('火'), b('木')).flow).toBe('ba')
  })

  it('극하는 쪽이 주체다', () => {
    // 木 이 土 를 극한다
    expect(pairChemistry(a('木'), b('土')).flow).toBe('ab')
    expect(pairChemistry(a('土'), b('木')).flow).toBe('ba')
  })

  it('같은 오행이면 방향이 없다', () => {
    expect(pairChemistry(a('水'), b('水')).flow).toBeNull()
  })

  it('25가지 조합 전부 오행표와 방향이 맞는다', () => {
    for (const ea of ELEMENTS) {
      for (const eb of ELEMENTS) {
        const p = pairChemistry(a(ea), b(eb))
        const label = `${ea}-${eb}`

        if (ea === eb) {
          expect(p, label).toMatchObject({ relation: 'same', score: 70, flow: null })
          continue
        }

        // 주체는 항상 생하거나 극하는 쪽이다
        const actor = p.flow === 'ab' ? ea : eb
        const target = p.flow === 'ab' ? eb : ea
        if (p.relation === 'generating') {
          expect(GENERATES[actor], label).toBe(target)
          expect(p.score, label).toBe(90)
        } else {
          expect(CONTROLS[actor], label).toBe(target)
          expect(p.score, label).toBe(55)
        }
      }
    }
  })

  it('a 와 b 를 바꿔 넣어도 같은 사람이 주체다', () => {
    for (const ea of ELEMENTS) {
      for (const eb of ELEMENTS) {
        if (ea === eb) continue
        const forward = pairChemistry(chart('a', '가람', ea), chart('b', '나린', eb))
        const backward = pairChemistry(chart('b', '나린', eb), chart('a', '가람', ea))
        const actorOf = (p: typeof forward) => (p.flow === 'ab' ? p.aName : p.bName)
        expect(actorOf(backward), `${ea}-${eb}`).toBe(actorOf(forward))
      }
    }
  })
})
