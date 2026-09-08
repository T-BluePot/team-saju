/**
 * 소스에서 화면 문구가 남아 있는 자리를 찾는다.
 *
 * 화면 문구는 `src/lib/copy/` 에 모으기로 했다. 컴포넌트로 다시 새어나오는 걸
 * `__tests__/noInlineCopy.test.ts` 가 막고, 같은 스캐너를 `npm run scan:copy` 가 목록 출력에 쓴다.
 * 두 곳이 다른 규칙으로 세면 테스트는 통과하는데 목록에는 남아 있는 상태가 생긴다.
 *
 * 파싱은 TypeScript 에 맡긴다. 손으로 짠 주석 제거기를 쓰던 때는 JSX 닫는 태그를
 * 정규식으로 오인해서, 문구가 하나도 없는데 가드가 실패하는 일이 있었다.
 * 파서는 주석을 애초에 노드로 넘기지 않아서 그 부류가 통째로 사라진다.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

/**
 * 저장소 루트. cwd 를 쓰지 않는다.
 *
 * 상대 경로로 열면 하위 디렉터리에서 돌리거나 러너가 root 를 다르게 잡았을 때
 * 의미 있는 실패 대신 ENOENT 로 죽는다.
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

export const COPY_DIR = 'src/lib/copy'

/**
 * 남아도 되는 낱말. 명리 용어라 카피가 아니라 도메인 어휘다.
 *
 * 파일 단위로 빼주면 그 파일에 새로 들어온 카피까지 같이 눈감아주게 되므로
 * 낱말로만 연다. 늘어나는 게 보여야 하니 이유를 붙인다.
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

/**
 * 남아도 되는 글자. 읽는 문구가 아니라 도장 무늬다.
 *
 * `占` 은 `aria-hidden` 으로 달린 장식이고, 그중 하나는 `CommonSection` 프리미티브에
 * 있다. 카피로 끌어오면 프리미티브가 `lib/copy` 를 import 하게 된다.
 * 낱말과 목적이 달라서 목록을 나눠 둔다.
 */
export const ALLOWED_GLYPHS = ['占']

/**
 * 화면에 나갈 수 있는 글자. 한글과 한자를 본다.
 *
 * 한자를 빼두면 `宜` `忌` `處方` `一二三` 같은 자리가 그냥 새어나간다.
 * 자모(`ㅎㅎ` `ㅠㅠ`)도 넣는다. 음절만 보면 자모로만 쓴 문구가 안 걸린다.
 */
const SCRIPTED = /[가-힣ㄱ-ㆎ㐀-䶿一-鿿]/g

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

/** 루트 기준 상대 경로를 읽는다. */
export function read(relPath: string): string {
  return readFileSync(join(ROOT, relPath.split('/').join(sep)), 'utf8')
}

function parse(source: string, fileName: string): ts.SourceFile {
  return ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
}

interface Literal {
  line: number
  value: string
}

/**
 * 화면에 나갈 수 있는 문자열 조각을 전부 모은다.
 *
 * JSX 사이의 글, 따옴표 문자열, 템플릿의 고정 부분을 본다. 템플릿의 `${...}` 는
 * 계산된 값이라 건너뛰지만, 그 안에 문자열 리터럴이 있으면 그건 카피라 잡는다.
 * `${cond ? '한글' : ''}` 의 '한글' 은 검사 대상이다.
 *
 * import 경로나 `className` 은 따로 거르지 않는다. 한글도 한자도 안 들어가서
 * 애초에 걸릴 일이 없다. 안 쓰는 예외 규칙을 두면 나중에 읽는 사람이 그게
 * 무슨 사연이 있는 줄 안다.
 */
function collectLiterals(source: string, fileName: string): Literal[] {
  const sourceFile = parse(source, fileName)
  const found: Literal[] = []

  const take = (node: ts.Node, value: string) => {
    if (!value.trim()) return
    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
    found.push({ line: line + 1, value })
  }

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) take(node, node.text)
    else if (ts.isStringLiteral(node)) take(node, node.text)
    else if (ts.isNoSubstitutionTemplateLiteral(node)) take(node, node.text)
    else if (ts.isTemplateExpression(node)) {
      take(node.head, node.head.text)
      for (const span of node.templateSpans) take(span.literal, span.literal.text)
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return found
}

/** 허용 목록을 지우고 남은 글자만 센다. */
function countLeftover(value: string, applyAllowList: boolean): number {
  const probe = applyAllowList
    ? [...ALLOWED_TERMS, ...ALLOWED_GLYPHS].reduce(
        (acc, term) => acc.split(term).join(''),
        value,
      )
    : value

  return (probe.match(SCRIPTED) ?? []).length
}

/** 문구가 남은 줄만 돌려준다. 한 줄에 여러 개면 합쳐서 한 건으로 센다. */
export function scanSource(
  source: string,
  applyAllowList: boolean,
  fileName = 'file.tsx',
): Hit[] {
  const lines = source.split('\n')
  const byLine = new Map<number, number>()

  for (const literal of collectLiterals(source, fileName)) {
    const chars = countLeftover(literal.value, applyAllowList)
    if (!chars) continue
    byLine.set(literal.line, (byLine.get(literal.line) ?? 0) + chars)
  }

  return [...byLine.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([line, chars]) => ({ line, chars, text: (lines[line - 1] ?? '').trim() }))
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

/** `applyAllowList` 를 끄면 도메인 어휘까지 전부 세어 이관 전 목록을 만든다. */
export function scanRepo(applyAllowList: boolean): FileScan[] {
  const scans: FileScan[] = []

  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      const hits = scanSource(read(file), applyAllowList, file)
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

/**
 * `src/lib/copy/` 아래 모든 카피 파일.
 *
 * 하위 폴더까지 훑고 배럴도 뺀 것 없이 본다. 안 훑는 자리를 두면 result.ts 가
 * 커져서 폴더로 쪼개진 날 그 안의 문구는 아무도 검사하지 않는데 테스트는
 * 계속 초록으로 통과한다.
 */
export function copyFiles(): string[] {
  // 확장자로 거르지 않는다. copy 는 React 를 안 쓰기로 했지만 그걸 강제하는 검사가
  // 따로 없어서, .tsx 를 조용히 빼면 그 파일만 금지어 검사를 안 받는다
  return walk(COPY_DIR)
}

/**
 * 문자열 리터럴 안쪽만 뽑는다. 금지어 검사가 쓴다.
 *
 * 파일 전문에 검사를 걸면 "왜 이렇게 뒀는지" 를 적어둔 주석까지 걸린다.
 * 금지어를 설명하는 주석이 금지어 검사에 걸리는 건 곤란하다.
 */
export function extractLiterals(source: string, fileName = 'file.ts'): string[] {
  return collectLiterals(source, fileName).map((literal) => literal.value)
}
