/**
 * 컴포넌트에 인라인으로 남은 문구를 목록으로 뽑는다. 한글과 한자를 본다.
 *
 * 판정은 `scripts/__tests__/noInlineCopy.test.ts` 가 하고 여기는 세기만 한다.
 *
 *   npm run scan:copy            허용 목록을 뺀 결과 (테스트와 같은 기준)
 *   npm run scan:copy -- --all   도메인 어휘와 장식 글리프까지 전부
 *   npm run scan:copy -- --lines 줄 단위로 펼쳐서
 */
import { scanRepo, SCAN_DIRS } from './inlineCopyScan.ts'

const all = process.argv.includes('--all')
const scans = scanRepo(!all)

const totalChars = scans.reduce((sum, scan) => sum + scan.chars, 0)
const totalLines = scans.reduce((sum, scan) => sum + scan.hits.length, 0)

console.log(`대상 ${SCAN_DIRS.join(', ')}`)
console.log(all ? '기준 도메인 어휘와 글리프 포함' : '기준 허용 목록 제외')
console.log(`합계 ${scans.length}개 파일 / ${totalLines}줄 / ${totalChars}자`)
console.log('')

for (const scan of scans) {
  console.log(`${String(scan.chars).padStart(5)}자  ${String(scan.hits.length).padStart(3)}줄  ${scan.file}`)
}

if (process.argv.includes('--lines')) {
  console.log('')
  for (const scan of scans) {
    console.log(`--- ${scan.file}`)
    for (const hit of scan.hits) console.log(`  L${hit.line}  ${hit.text}`)
  }
}
