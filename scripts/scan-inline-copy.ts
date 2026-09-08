/**
 * 인라인 한글이 어디에 얼마나 남아 있는지 목록으로 뽑는다.
 *
 * 이관 전 기준선을 만들고, 이관 뒤 같은 명령으로 0 이 됐는지 확인한다.
 * 판정은 `scripts/__tests__/noInlineCopy.test.ts` 가 하고 여기는 세기만 한다.
 *
 *   npm run scan:copy          허용 낱말을 뺀 목록 (테스트와 같은 기준)
 *   npm run scan:copy -- --all 명리 용어까지 전부
 */
import { scanRepo, SCAN_DIRS } from './inlineCopyScan.ts'

const all = process.argv.includes('--all')
const scans = scanRepo(!all)

const totalChars = scans.reduce((sum, scan) => sum + scan.chars, 0)
const totalLines = scans.reduce((sum, scan) => sum + scan.hits.length, 0)

console.log(`대상 ${SCAN_DIRS.join(', ')}`)
console.log(all ? '기준 명리 용어 포함' : '기준 허용 낱말 제외')
console.log(`합계 ${scans.length}개 파일 / ${totalLines}줄 / 한글 ${totalChars}자`)
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
