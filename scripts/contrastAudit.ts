import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 색 토큰 대비 감사.
 *
 * 브라우저를 띄우고 화면을 훑는 방식으로 한 번 했다가 놓쳤다. 표본 팀이 火 주도라
 * `--accent` 가 #d93a26 으로 풀렸고, 그 위의 흰 글자는 4.53:1 로 통과했다.
 * 그런데 `--accent` 는 `[data-element]` 가 팀마다 갈아끼운다. 土 팀에서는 같은 자리가
 * 3.04:1 이었다. **화면 하나를 훑는 걸로는 다섯 갈래를 다 못 본다.**
 *
 * 그래서 화면이 아니라 토큰을 본다. `index.css` 를 읽어 밝게/어둡게 × 오행 다섯에
 * 기본까지 열두 갈래를 만들고, 실제로 쓰는 짝만 골라 잰다. 브라우저가 필요 없으니
 * `npm test` 에 그냥 붙는다.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CSS = join(ROOT, 'src', 'index.css')

/** 색을 쓰는 파일. 스타일은 `.css` 아니면 `.tsx` 의 style 객체에만 있다 */
export function styleFiles(relDir = 'src'): Array<[string, string]> {
  const out: Array<[string, string]> = []

  for (const entry of readdirSync(join(ROOT, relDir.split('/').join(sep)))) {
    const rel = `${relDir}/${entry}`
    if (statSync(join(ROOT, rel.split('/').join(sep))).isDirectory()) {
      if (entry === '__tests__') continue
      out.push(...styleFiles(rel))
      continue
    }
    if (/\.(tsx|css)$/.test(entry)) {
      out.push([rel, readFileSync(join(ROOT, rel.split('/').join(sep)), 'utf8')])
    }
  }
  return out
}

export const ELEMENT_SLUG: Record<string, string> = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water',
}

export type Rgb = [number, number, number]
type Tokens = Record<string, string>

export function readCss(): string {
  return readFileSync(CSS, 'utf8')
}

/** 주석을 걷는다. 주석 안에 있는 `{` 가 블록 세는 걸 망친다 */
function strip(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/** `sel` 로 시작하는 규칙의 본문을 전부 모은다. 같은 선택자가 여러 번 나올 수 있다 */
function bodies(css: string, selector: string): string[] {
  const out: string[] = []
  let from = 0

  for (;;) {
    const at = css.indexOf(selector, from)
    if (at < 0) break
    // 선택자 뒤에 오는 건 `{` 아니면 `,` 뿐이다. `[data-element='木'] , [data-element='火']`
    const rest = css.slice(at + selector.length)
    const brace = rest.match(/^[\s,]*(?:\[[^\]]*\][\s,]*)*\{/)
    if (!brace) {
      from = at + selector.length
      continue
    }
    const open = at + selector.length + brace[0].length - 1
    let depth = 1
    let i = open + 1
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth += 1
      else if (css[i] === '}') depth -= 1
      i += 1
    }
    out.push(css.slice(open + 1, i - 1))
    from = i
  }
  return out
}

/** 한 블록 안의 `--이름: 값;` 을 모은다. 중첩 블록 안쪽은 안 본다 */
function decls(body: string): Tokens {
  const flat = body.replace(/\{[^{}]*\}/g, '')
  const out: Tokens = {}
  for (const m of flat.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim()
  }
  return out
}

/**
 * 어두운 테마 블록들.
 *
 * 하나가 아니다. `:root` 를 뒤집는 블록과 `[data-element]` 를 뒤집는 블록이 따로 있다.
 * 첫 블록만 걷었더니 뒤의 것이 밝은 쪽에 남아서, 밝은 화면에서 `--accent-deep` 이
 * 어두운 테마 규칙대로 원본 오방색으로 풀렸다. 火 팀 4.14:1 처럼 없는 실패가 나왔다.
 */
const DARK_AT = '@media (prefers-color-scheme: dark)'

function darkBodies(css: string): string[] {
  const out: string[] = []
  let from = 0
  for (;;) {
    const at = css.indexOf(DARK_AT, from)
    if (at < 0) break
    const open = css.indexOf('{', at)
    let depth = 1
    let i = open + 1
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth += 1
      else if (css[i] === '}') depth -= 1
      i += 1
    }
    out.push(css.slice(open + 1, i - 1))
    from = i
  }
  return out
}

/**
 * 잴 갈래를 만든다.
 *
 * 얹는 순서가 곧 캐스케이드다. `:root` 와 `[data-element]` 는 명시도가 같아서
 * 파일에 늦게 적힌 쪽이 이긴다. 어두운 테마의 `[data-element]` 가 제일 늦다.
 */
export function scopes(css: string): Map<string, Tokens> {
  const clean = strip(css)
  const parts = darkBodies(clean)
  const dark = parts.join('\n')
  const light = parts.reduce((acc, body) => acc.replace(body, ''), clean)

  const rootLight = bodies(light, ':root').reduce<Tokens>((a, b) => ({ ...a, ...decls(b) }), {})
  const rootDark = bodies(dark, ':root').reduce<Tokens>((a, b) => ({ ...a, ...decls(b) }), {})

  const elLight = (el: string) =>
    bodies(light, `[data-element='${el}']`).reduce<Tokens>((a, b) => ({ ...a, ...decls(b) }), {})
  const elDark = (el: string) =>
    bodies(dark, `[data-element='${el}']`).reduce<Tokens>((a, b) => ({ ...a, ...decls(b) }), {})

  const out = new Map<string, Tokens>()
  out.set('밝게 · 기본', rootLight)
  out.set('어둡게 · 기본', { ...rootLight, ...rootDark })

  for (const el of Object.keys(ELEMENT_SLUG)) {
    out.set(`밝게 · ${el} 팀`, { ...rootLight, ...elLight(el) })
    out.set(`어둡게 · ${el} 팀`, { ...rootLight, ...rootDark, ...elLight(el), ...elDark(el) })
  }
  return out
}

function hex(value: string): Rgb | null {
  const m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const h = m[1]
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb
}

/** `color-mix(in srgb, A p%, B)` 의 인자를 쉼표로 가른다. 괄호 안 쉼표는 안 센다 */
function args(inner: string): string[] {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const c of inner) {
    if (c === '(') depth += 1
    if (c === ')') depth -= 1
    if (c === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += c
    }
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

/**
 * 토큰 값을 rgb 로 푼다. `var()` 사슬과 `color-mix(in srgb, …)` 를 따라간다.
 * 두 번째 색이 `transparent` 면 섞을 바탕이 없으니 여기서는 다루지 않는다.
 */
export function resolve(value: string, tokens: Tokens, seen = new Set<string>()): Rgb | null {
  const v = value.trim()

  const direct = hex(v)
  if (direct) return direct

  const varMatch = v.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/)
  if (varMatch) {
    const name = varMatch[1]
    if (seen.has(name)) return null
    const next = tokens[name]
    if (next !== undefined) return resolve(next, tokens, new Set([...seen, name]))
    return varMatch[2] ? resolve(varMatch[2], tokens, seen) : null
  }

  const mix = v.match(/^color-mix\(([\s\S]+)\)$/)
  if (mix) {
    const parts = args(mix[1])
    if (parts.length !== 3 || parts[0] !== 'in srgb') return null
    const first = parts[1].match(/^([\s\S]+?)\s+([\d.]+)%$/)
    if (!first) return null
    const a = resolve(first[1], tokens, seen)
    const b = resolve(parts[2], tokens, seen)
    if (!a || !b) return null
    const p = Number(first[2]) / 100
    return a.map((c, i) => Math.round(c * p + b[i] * (1 - p))) as Rgb
  }

  return null
}

function luminance([r, g, b]: Rgb): number {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export type Pair = { fg: string; bg: string; where: string }

/**
 * 실제로 화면에 있는 짝만 적는다.
 *
 * 있지도 않은 조합을 넣으면 통과시키려고 토큰을 고치게 된다. 새 짝을 쓰기 시작하면
 * 여기 한 줄을 같이 더한다.
 */
export const PAIRS: Pair[] = [
  { fg: '--ink', bg: '--paper', where: '본문' },
  { fg: '--ink', bg: '--surface', where: '카드 본문' },
  { fg: '--ink', bg: '--paper-deep', where: '입력칸 글자' },
  { fg: '--ink-soft', bg: '--paper', where: '보조 문구' },
  { fg: '--ink-soft', bg: '--surface', where: '카드 보조 문구' },
  { fg: '--ink-soft', bg: '--paper-deep', where: '인원 배지 · 처방 상자 글' },
  { fg: '--accent-deep', bg: '--paper', where: '섹션 번호' },
  { fg: '--accent-deep', bg: '--surface', where: '균형 점수 · 강조 숫자' },
  { fg: '--accent-deep', bg: '--accent-wash', where: '예시 띠 · 강조 칩' },
  // 인장, 處 도장, 주 버튼. 면은 반드시 --accent-deep 이다.
  // 원본 오방색을 깔면 土 3.04:1 金 3.92:1 로 떨어진다
  { fg: '--on-accent', bg: '--accent-deep', where: '인장 · 處 도장 · 주 버튼' },
]

/**
 * 오행 다섯이 한 화면에 같이 서는 자리.
 *
 * 도장은 `--el-*-deep` 을 면으로 깔고 `--on-accent` 를 얹는다. 위의
 * `--on-accent on --accent-deep` 과 같은 짝처럼 보이지만, 어두운 환경에서는
 * `--accent-deep` 이 `var(--accent)` 로 갈려서 다른 색이 된다.
 * 그래서 따로 잰다.
 */
export const ELEMENT_PAIRS: Pair[] = Object.values(ELEMENT_SLUG).flatMap((slug) => [
  { fg: `--el-${slug}-deep`, bg: '--surface', where: `오행 글자 (${slug}) · 카드 위` },
  { fg: `--el-${slug}-deep`, bg: '--paper', where: `오행 글자 (${slug}) · 한지 위` },
  {
    fg: '--on-accent',
    bg: `--el-${slug}-deep`,
    where: `기운 카드 오행 도장 (${slug})`,
  },
])

/** 본문 글자 기준. 큰 글자 예외(18.66px bold / 24px)에 기대지 않는다 */
export const MIN_RATIO = 4.5

export type Failure = {
  scope: string
  where: string
  fg: string
  bg: string
  ratio: number
}

/**
 * `--on-accent` 를 얹어도 되는 면.
 *
 * `--accent-deep` 이 기준이고, `--energy-seal` 은 `ELEMENT_COLOR_DEEP` 을 그대로 받는
 * 인라인 변수라 같은 갈래다 (`TeamEnergyCards.tsx`). 목록에 없는 면이 나오면
 * 그 조합이 안전한지 먼저 재고 여기 한 줄을 더한다.
 */
export const ON_ACCENT_SURFACES = ['--accent-deep', '--energy-seal']

/**
 * `at` 을 감싸는 제일 안쪽 중괄호 블록.
 *
 * 앞뒤 몇 백 자로 창을 잡았더니 옆 규칙의 `background` 를 집어서, `CommonButton` 의
 * primary 가 바로 위 ghost 의 면색으로 읽혔다. CSS 규칙이든 `style={{ }}` 객체든
 * 짝은 같은 중괄호 안에 있다. 블록으로 자르면 그런 오인이 없다.
 */
function enclosingBlock(text: string, at: number): string {
  let depth = 0
  let open = -1
  for (let i = at; i >= 0; i -= 1) {
    if (text[i] === '}') depth += 1
    else if (text[i] === '{') {
      if (depth === 0) {
        open = i
        break
      }
      depth -= 1
    }
  }
  if (open < 0) return ''

  depth = 1
  let i = open + 1
  while (i < text.length && depth > 0) {
    if (text[i] === '{') depth += 1
    else if (text[i] === '}') depth -= 1
    i += 1
  }
  return text.slice(open + 1, i - 1)
}

export type MisPair = { file: string; at: number; background: string | null }

/**
 * 토큰이 안전해도 컴포넌트가 짝을 잘못 고르면 소용이 없다.
 *
 * 실제로 그랬다. `--on-accent` 를 `--accent` 위에 얹은 자리가 둘 있었고, 火 팀에서만
 * 4.53:1 로 통과해서 눈으로도 화면 감사로도 안 걸렸다. 土 팀은 3.04:1 이었다.
 * 그래서 짝 자체를 못 박는다.
 */
export function auditOnAccentPairs(files: Array<[string, string]>): MisPair[] {
  const out: MisPair[] = []

  for (const [file, source] of files) {
    const text = strip(source)
    for (const m of text.matchAll(/var\(--on-accent\)/g)) {
      const at = m.index ?? 0
      const block = enclosingBlock(text, at)
      const bg = [...block.matchAll(/background(?:-color)?\s*:\s*'?var\(\s*(--[\w-]+)/g)].pop()
      const name = bg ? bg[1] : null
      if (!name || !ON_ACCENT_SURFACES.includes(name)) {
        out.push({ file, at, background: name })
      }
    }
  }
  return out
}

export function auditContrast(css = readCss()): Failure[] {
  const out: Failure[] = []

  for (const [scope, tokens] of scopes(css)) {
    const pairs = scope.endsWith('기본') ? [...PAIRS, ...ELEMENT_PAIRS] : PAIRS

    for (const pair of pairs) {
      const fg = resolve(`var(${pair.fg})`, tokens)
      const bg = resolve(`var(${pair.bg})`, tokens)
      if (!fg || !bg) {
        throw new Error(`${scope} 에서 ${pair.fg} 또는 ${pair.bg} 를 못 풀었다`)
      }
      const ratio = contrast(fg, bg)
      if (ratio < MIN_RATIO) {
        out.push({
          scope,
          where: pair.where,
          fg: pair.fg,
          bg: pair.bg,
          ratio: Math.round(ratio * 100) / 100,
        })
      }
    }
  }
  return out
}
