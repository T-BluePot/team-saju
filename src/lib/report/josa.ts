/**
 * 조사를 앞말 받침에 맞춰 붙인다.
 *
 * 오행 이름을 문장에 끼워넣으면 목 금은 받침이 있고 화 토 수는 없어서
 * "화이 넘치는데" 같은 비문이 나온다. 하드코딩하면 다섯 중 셋이 깨진다.
 *
 * 계산과 문장을 나눠놨는데 그 문장이 비문이면 나눈 의미가 없다.
 * 손으로 쓴 문구는 `archetypes.ts` 처럼 그냥 맞게 쓰면 되지만,
 * 오행 이름을 템플릿에 끼우는 자리는 이걸 거쳐야 한다.
 */

const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3

/** 마지막 글자에 받침이 있나 */
export function hasFinalConsonant(word: string): boolean {
  const code = word.charCodeAt(word.length - 1)
  if (Number.isNaN(code) || code < HANGUL_START || code > HANGUL_END) return false
  return (code - HANGUL_START) % 28 > 0
}

function attach(word: string, withFinal: string, withoutFinal: string): string {
  return word + (hasFinalConsonant(word) ? withFinal : withoutFinal)
}

/** 목이 / 화가 */
export const subject = (word: string) => attach(word, '이', '가')

/** 목을 / 화를 */
export const object = (word: string) => attach(word, '을', '를')

/** 목은 / 화는 */
export const topic = (word: string) => attach(word, '은', '는')

/** 목입니다 / 화입니다. 서술격 조사는 받침과 무관하지만 자리를 맞춰둔다 */
export const copula = (word: string) => `${word}입니다`
