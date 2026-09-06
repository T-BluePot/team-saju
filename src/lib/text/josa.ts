/**
 * 조사를 앞말 받침에 맞춰 붙인다.
 *
 * 오행 이름을 문장에 끼워넣으면 목 금은 받침이 있고 화 토 수는 없어서
 * "화이 넘치는데" 같은 비문이 나온다. 하드코딩하면 다섯 중 셋이 깨진다.
 *
 * 사람 이름도 마찬가지다. "은우이(가)" 처럼 괄호로 도망가면 읽는 맛이 떨어진다.
 *
 * 계산과 문장을 나눠놨는데 그 문장이 비문이면 나눈 의미가 없다.
 * 손으로 쓴 문구는 `archetypes.ts` 처럼 그냥 맞게 쓰면 되지만,
 * 오행 이름을 템플릿에 끼우는 자리는 이걸 거쳐야 한다.
 */

const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3

/** 마지막 글자가 한글 음절인가 */
export function endsWithHangul(word: string): boolean {
  const code = word.charCodeAt(word.length - 1)
  return !Number.isNaN(code) && code >= HANGUL_START && code <= HANGUL_END
}

/** 마지막 글자에 받침이 있나. 한글이 아니면 판단할 수 없다 */
export function hasFinalConsonant(word: string): boolean {
  if (!endsWithHangul(word)) return false
  return (word.charCodeAt(word.length - 1) - HANGUL_START) % 28 > 0
}

/**
 * 한글이 아니면 둘 다 적는다.
 *
 * 이름은 사용자가 자유롭게 넣는다. `Kim` 이나 `팀원0` 은 받침 소리로 끝나는데
 * 한글 음절이 아니라 받침을 셀 수 없다. 그냥 하나를 고르면 조용히 틀린다.
 * 괄호는 못생겼어도 틀리지는 않는다.
 */
function attach(word: string, withFinal: string, withoutFinal: string): string {
  if (!endsWithHangul(word)) return `${word}${withFinal}(${withoutFinal})`
  return word + (hasFinalConsonant(word) ? withFinal : withoutFinal)
}

/**
 * 여럿을 잇는다. 셋 이상이면 쉼표로 잇고 마지막만 과/와 다.
 * "조율과 실행과 분석" 은 문법은 맞아도 읽기 나쁘다.
 */
export function and(words: string[]): string {
  if (words.length <= 1) return words[0] ?? ''
  const head = words.slice(0, -1)
  const last = words[words.length - 1]
  const before = head[head.length - 1]
  const joiner = hasFinalConsonant(before) ? '과 ' : '와 '
  return head.length === 1
    ? `${before}${joiner}${last}`
    : `${head.slice(0, -1).join(', ')}, ${before}${joiner}${last}`
}

/** 목이 / 화가 */
export const subject = (word: string) => attach(word, '이', '가')

/** 목을 / 화를 */
export const object = (word: string) => attach(word, '을', '를')

/** 목은 / 화는 */
export const topic = (word: string) => attach(word, '은', '는')

/** 목입니다 / 화입니다. 서술격 조사는 받침과 무관하지만 자리를 맞춰둔다 */
export const copula = (word: string) => `${word}입니다`
