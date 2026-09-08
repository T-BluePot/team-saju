/**
 * 주석을 걷어낸 소스에서 한글이 남아 있는 자리를 찾는다.
 *
 * 화면 문구는 `src/lib/copy/` 에 모으기로 했다. 컴포넌트로 다시 새어나오는 걸
 * `__tests__/noInlineCopy.test.ts` 가 막고, 같은 스캐너를 `npm run scan:copy` 가 목록 출력에 쓴다.
 * 두 곳이 다른 규칙으로 세면 테스트는 통과하는데 목록에는 남아 있는 상태가 생긴다.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 저장소 루트. cwd 를 쓰지 않는다.
 *
 * 상대 경로로 열면 하위 디렉터리에서 돌리거나 러너가 root 를 다르게 잡았을 때
 * 의미 있는 실패 대신 ENOENT 로 죽는다. 테스트는 수집 단계에서 터져서 어떤
 * 검사가 왜 깨졌는지도 안 나온다.
 */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/** 문구가 있으면 안 되는 곳. `src/lib/copy/` 자신은 당연히 대상이 아니다. */
export const SCAN_DIRS = [
  'src/components',
  'src/pages',
  'src/store',
  'src/lib/share',
  'src/lib/ui',
]

/**
 * 한글이 남아도 되는 낱말. 파일 단위로 빼주면 그 파일에 새로 들어온 카피까지
 * 같이 눈감아주게 되므로 낱말로만 연다. 늘어나는 게 보여야 하니 이유를 붙인다.
 */
export const ALLOWED_TERMS = [
  // 사주의 네 기둥. docs/03-saju-spec.md 의 용어다
  '연주',
  '월주',
  '일주',
  '시주',
  // 지지 안에 든 천간. 같은 명세에 있다
  '지장간',
  // 나 자신에 해당하는 글자
  '일간',
  // 오행이 어느 단계인지. SajuElementBars 의 눈금 라벨이다
  '넘침',
  '부족',
  '비어 있음',
]

export const COPY_DIR = 'src/lib/copy'

export interface Hit {
  line: number
  text: string
  chars: number
}

export interface FileScan {
  file: string
  chars: number
  hits: Hit[]
}

const HANGUL = /[가-힣]/g
const BACKSLASH = String.fromCharCode(92)
const NEWLINE = String.fromCharCode(10)

/**
 * 앞 글자가 이것들이면 그 `/` 는 나눗셈이 아니라 정규식의 시작이다.
 *
 * `<` 는 일부러 뺐다. 넣으면 JSX 닫는 태그 `</div>` 의 슬래시를 정규식 시작으로
 * 읽고, 같은 줄에 달린 `//` 주석을 통째로 못 지운다. 문구가 하나도 없는데 가드
 * 테스트가 실패한다. `<` 뒤에 정규식이 오는 코드는 실제로 없다.
 */
const REGEX_PREV = /[(,=:[!&|?{};+\-*%~^>]/

/**
 * 주석을 공백으로 바꾼다. 줄 번호가 어긋나면 안 되니 줄바꿈은 남긴다.
 *
 * 문자열과 정규식 안을 구분하지 않으면 `/[\/:*?"<>|]/` 같은 자리에서 따옴표를
 * 문자열 시작으로 읽고, 그 뒤 주석을 통째로 못 지운다. 실제로 renderShareCard.ts
 * 가 그 모양이라 세는 값이 29자 어긋났다.
 */
export function stripComments(src: string): string {
  let out = ''
  let i = 0
  let state = 'code'
  let inCharClass = false

  while (i < src.length) {
    const c = src[i]
    const n = src[i + 1]

    if (state === 'code') {
      if (c === '/' && n === '/') {
        state = 'line'
        out += '  '
        i += 2
        continue
      }
      if (c === '/' && n === '*') {
        state = 'block'
        out += '  '
        i += 2
        continue
      }
      if (c === '/' && REGEX_PREV.test(out.replace(/\s+$/, '').slice(-1) || '(')) {
        state = 'regex'
        inCharClass = false
        out += c
        i += 1
        continue
      }
      if (c === "'") state = 'single'
      else if (c === '"') state = 'double'
      else if (c === '`') state = 'template'
      out += c
      i += 1
      continue
    }

    if (state === 'line') {
      if (c === NEWLINE) {
        state = 'code'
        out += c
      } else {
        out += ' '
      }
      i += 1
      continue
    }

    if (state === 'block') {
      if (c === '*' && n === '/') {
        state = 'code'
        out += '  '
        i += 2
        continue
      }
      out += c === NEWLINE ? c : ' '
      i += 1
      continue
    }

    if (state === 'regex') {
      if (c === BACKSLASH) {
        out += c + (n ?? '')
        i += 2
        continue
      }
      // 정규식은 한 줄을 못 넘는다. 문자 클래스가 안 닫혀도 줄에서 끊어야
      // 오판이 파일 끝까지 번지지 않는다
      if (c === NEWLINE) {
        state = 'code'
        inCharClass = false
        out += c
        i += 1
        continue
      }
      // 문자 클래스 안의 `/` 는 정규식을 끝내지 않는다
      if (c === '[') inCharClass = true
      else if (c === ']') inCharClass = false
      else if (!inCharClass && c === '/') state = 'code'
      out += c
      i += 1
      continue
    }

    // 문자열 안
    if (c === BACKSLASH) {
      out += c + (n ?? '')
      i += 2
      continue
    }
    if (
      (state === 'single' && c === "'") ||
      (state === 'double' && c === '"') ||
      (state === 'template' && c === '`')
    ) {
      state = 'code'
    }
    out += c
    i += 1
  }

  return out
}

/** 허용 낱말을 지운 뒤에도 한글이 남은 줄만 돌려준다. */
export function scanSource(source: string, applyAllowList: boolean): Hit[] {
  const lines = stripComments(source).split(NEWLINE)
  const hits: Hit[] = []

  lines.forEach((line, index) => {
    const probe = applyAllowList
      ? ALLOWED_TERMS.reduce((acc, term) => acc.split(term).join(''), line)
      : line
    const found = probe.match(HANGUL)
    if (found) hits.push({ line: index + 1, text: line.trim(), chars: found.length })
  })

  return hits
}

/** 루트 기준 상대 경로로 돌려준다. 실패 메시지에 그대로 쓴다. */
function walk(relDir: string): string[] {
  const found: string[] = []

  for (const entry of readdirSync(join(ROOT, relDir))) {
    const rel = `${relDir}/${entry}`
    if (statSync(join(ROOT, rel)).isDirectory()) {
      if (entry === '__tests__') continue
      found.push(...walk(rel))
      continue
    }
    if (/\.tsx?$/.test(entry)) found.push(rel)
  }

  return found
}

/** `applyAllowList` 를 끄면 명리 용어까지 전부 세어 이관 전 목록을 만든다. */
export function scanRepo(applyAllowList: boolean): FileScan[] {
  const scans: FileScan[] = []

  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      const hits = scanSource(read(file), applyAllowList)
      if (!hits.length) continue
      scans.push({
        file,
        chars: hits.reduce((sum, hit) => sum + hit.chars, 0),
        hits,
      })
    }
  }

  return scans.sort((a, b) => b.chars - a.chars)
}

/** 루트 기준 상대 경로를 읽는다. */
export function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath.split('/').join(sep)), 'utf8')
}

/**
 * `src/lib/copy/` 아래 모든 카피 파일.
 *
 * 하위 폴더까지 훑고 배럴도 뺀 것 없이 본다. 안 훑는 자리를 두면 result.ts 가
 * 커져서 폴더로 쪼개진 날 그 안의 문구는 아무도 검사하지 않는데 테스트는
 * 계속 초록으로 통과한다.
 */
export function copyFiles(): string[] {
  return walk(COPY_DIR).filter((file) => file.endsWith('.ts'))
}

/**
 * 주석을 걷어낸 뒤 문자열 리터럴 안쪽만 뽑는다.
 *
 * 카피 검사를 파일 전문에 걸면 "왜 이렇게 뒀는지" 를 적어둔 주석까지 걸린다.
 * 금지어를 설명하는 주석이 금지어 검사에 걸리는 건 곤란하다.
 */
export function extractLiterals(source: string): string[] {
  const stripped = stripComments(source)
  const pattern = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g
  const found: string[] = []

  for (const match of stripped.matchAll(pattern)) {
    found.push(match[1] ?? match[2] ?? match[3] ?? '')
  }

  return found
}
