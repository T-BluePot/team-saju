import { ELEMENTS, ELEMENT_LABEL } from '../saju/constants'
import type { Element } from '../saju/types'
import { SOLO_LEAD, isSolo, needsBlock } from '../report/solo'
import type { TeamReport } from '../report/teamReport'
import { ELEMENT_HEX, ELEMENT_HEX_DEEP, illustFor } from '../ui/elementStyle'

/**
 * 공유 카드를 canvas 로 직접 그린다.
 *
 * html-to-image 같은 라이브러리를 안 쓰는 이유는 두 가지다.
 * 하나는 의존성을 늘리지 않으려고, 또 하나는 SVG 를 거치면 한글 폰트가
 * 환경에 따라 깨져서 나오기 때문이다. canvas 에 직접 그리면 시스템 폰트로 확실히 찍힌다.
 *
 * 여기 들어가는 건 팀 단위 정보뿐이다. 이름, 생년월일, 개인 간지는 넣지 않는다.
 * 문서 07-team-report.md
 *
 * 카피 길이가 유형마다 달라서 높이를 먼저 재고 그 다음에 그린다.
 */

const W = 1080
const PAD = 88
const MIN_H = 1350

/** 한지와 먹, 주사. index.css 의 토큰과 같은 값 */
const C = {
  paper: '#F7F3EA',
  paperDeep: '#EFE9DC',
  surface: '#FFFDF8',
  ink: '#17140F',
  inkSoft: '#6B6355',
  rule: '#DDD4C2',
}

const SERIF = '"Nanum Myeongjo", "Apple SD Gothic Neo", serif'
const SANS =
  '"Pretendard Variable", Pretendard, -apple-system, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif'

function serif(size: number, weight = 700) {
  return `${weight} ${size}px ${SERIF}`
}
function sans(size: number, weight = 400) {
  return `${weight} ${size}px ${SANS}`
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** 한지 결. 아주 옅은 격자 */
function drawPaper(ctx: CanvasRenderingContext2D, h: number) {
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, h)
  ctx.strokeStyle = 'rgba(221, 212, 194, 0.35)'
  ctx.lineWidth = 1
  for (let y = 0; y < h; y += 24) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
  for (let x = 0; x < W; x += 24) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
}

function drawRadar(
  ctx: CanvasRenderingContext2D,
  percents: Record<Element, number>,
  cx: number,
  cy: number,
  radius: number,
  accent: string,
) {
  const MAX = 50
  const at = (i: number, ratio: number) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return [cx + Math.cos(angle) * radius * ratio, cy + Math.sin(angle) * radius * ratio]
  }

  ctx.strokeStyle = C.rule
  ctx.lineWidth = 2
  for (const r of [0.25, 0.5, 0.75, 1]) {
    ctx.beginPath()
    ELEMENTS.forEach((_, i) => {
      const [x, y] = at(i, r)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.stroke()
  }

  ELEMENTS.forEach((_, i) => {
    const [x, y] = at(i, 1)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.stroke()
  })

  ctx.beginPath()
  ELEMENTS.forEach((el, i) => {
    const [x, y] = at(i, Math.min(percents[el] / MAX, 1))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  // 강조색을 16% 로 깔아준다. hex 뒤 두 자리가 알파다
  ctx.fillStyle = `${accent}29`
  ctx.fill()
  ctx.strokeStyle = accent
  ctx.lineWidth = 4
  ctx.stroke()

  ELEMENTS.forEach((el, i) => {
    const [x, y] = at(i, Math.min(percents[el] / MAX, 1))
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fillStyle = ELEMENT_HEX[el]
    ctx.fill()
  })

  ctx.textAlign = 'center'
  ELEMENTS.forEach((el, i) => {
    const [x, y] = at(i, 1.26)
    ctx.fillStyle = ELEMENT_HEX[el]
    ctx.font = serif(30, 700)
    ctx.fillText(el, x, y)
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(23, 500)
    ctx.fillText(`${percents[el]}%`, x, y + 32)
  })
  ctx.textAlign = 'left'
}

const RADAR_RADIUS = 140
const ILLUST_H = 230
/** 레이더 라벨이 반지름 밖으로 더 나가서 행 높이를 따로 잡는다 */
const ROW_H = Math.round(RADAR_RADIUS * 1.26 * 2 + 80)

function layout(
  ctx: CanvasRenderingContext2D,
  report: TeamReport,
  illust: HTMLImageElement | null,
  draw: boolean,
): number {
  const { analysis, archetype, dominant, lacking } = report
  const solo = isSolo(analysis)
  const needs = needsBlock(solo, archetype)
  // 화면과 같은 규칙. 주도 오행이 카드 강조색이 된다
  const accent = ELEMENT_HEX[analysis.elements.dominant]
  const accentDeep = ELEMENT_HEX_DEEP[analysis.elements.dominant]
  const inner = W - PAD * 2
  const paint = (fn: () => void) => {
    if (draw) fn()
  }

  let y = 118

  // 머리말과 인장
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(28, 500)
    // 혼자면 "1명" 이 아니라 아직 혼자라고 적는다. 팀인 척하지 않는다
    const who = solo ? '아직 혼자' : `${analysis.size}명`
    ctx.fillText(`${analysis.teamName} · ${who}`, PAD, y)

    ctx.save()
    ctx.translate(W - PAD - 34, y - 24)
    ctx.rotate((-4 * Math.PI) / 180)
    // 흰 글자를 얹으니 accentDeep 을 쓴다. 화면 인장과 같은 규칙
    ctx.fillStyle = accentDeep
    roundRect(ctx, -34, -34, 68, 68, 8)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = serif(36, 800)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('占', 0, 2)
    ctx.restore()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
  })

  // 유형 이름. 혼자면 "이 기운으로 팀을 만들면" 을 위에 붙여서 화면과 화법을 맞춘다
  y += solo ? 62 : 84
  if (solo) {
    paint(() => {
      ctx.fillStyle = accentDeep
      ctx.font = serif(26, 700)
      ctx.fillText(SOLO_LEAD, PAD, y)
    })
    y += 44
  }
  ctx.font = serif(72, 800)
  const nameLines = wrap(ctx, archetype.name, inner)
  paint(() => {
    ctx.fillStyle = C.ink
    nameLines.forEach((line, i) => ctx.fillText(line, PAD, y + i * 88))
  })
  y += nameLines.length * 88

  y += 8
  ctx.font = serif(34, 400)
  const tagLines = wrap(ctx, archetype.tagline, inner)
  paint(() => {
    ctx.fillStyle = C.inkSoft
    tagLines.forEach((line, i) => ctx.fillText(line, PAD, y + i * 46))
  })
  y += tagLines.length * 46

  // 겹줄 괘선
  y += 34
  paint(() => {
    ctx.strokeStyle = C.rule
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(PAD, y)
    ctx.lineTo(W - PAD, y)
    ctx.moveTo(PAD, y + 6)
    ctx.lineTo(W - PAD, y + 6)
    ctx.stroke()
  })
  y += 6

  // 일러스트와 레이더를 나란히
  const rowTop = y + 30
  const rowCy = rowTop + ROW_H / 2

  paint(() => {
    if (illust && illust.complete && illust.naturalWidth > 0) {
      const ratio = illust.naturalWidth / illust.naturalHeight
      const h = ILLUST_H
      const w = h * ratio
      ctx.drawImage(illust, PAD + (inner / 2 - w) / 2, rowCy - h / 2, w, h)
    }
  })
  paint(() =>
    drawRadar(ctx, analysis.elements.percents, PAD + inner * 0.74, rowCy, RADAR_RADIUS, accent),
  )
  y = rowTop + ROW_H + 46

  // 넘치는 기운 / 비어 있는 곳
  paint(() => {
    ctx.font = sans(25, 500)
    ctx.fillStyle = C.inkSoft
    ctx.fillText('넘치는 기운', PAD, y)
    ctx.textAlign = 'right'
    ctx.fillText('비어 있는 곳', W - PAD, y)
    ctx.textAlign = 'left'
  })

  y += 48
  paint(() => {
    ctx.font = serif(40, 700)
    ctx.fillStyle = ELEMENT_HEX[dominant.element]
    ctx.fillText(
      `${dominant.element} ${ELEMENT_LABEL[dominant.element]} ${dominant.percent}%`,
      PAD,
      y,
    )
    ctx.textAlign = 'right'
    ctx.fillStyle = ELEMENT_HEX[lacking.element]
    ctx.fillText(
      `${lacking.element} ${ELEMENT_LABEL[lacking.element]} ${lacking.percent}%`,
      W - PAD,
      y,
    )
    ctx.textAlign = 'left'
  })

  // 처방
  y += 54
  ctx.font = sans(29, 500)
  const preLines = wrap(ctx, archetype.prescriptions[0], inner - 84)
  const boxH = 54 + 46 + preLines.length * 42 + 30
  const boxTop = y

  paint(() => {
    ctx.fillStyle = C.surface
    roundRect(ctx, PAD, boxTop, inner, boxH, 24)
    ctx.fill()
    ctx.strokeStyle = C.rule
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = accent
    roundRect(ctx, PAD, boxTop + 20, 5, boxH - 40, 3)
    ctx.fill()

    ctx.fillStyle = accentDeep
    ctx.font = serif(25, 700)
    ctx.fillText('處方 · 이번 주에 해볼 것', PAD + 42, boxTop + 56)

    ctx.fillStyle = C.ink
    ctx.font = sans(29, 500)
    preLines.forEach((line, i) => ctx.fillText(line, PAD + 42, boxTop + 102 + i * 42))
  })
  y = boxTop + boxH + 50

  // 필요한 사람
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(25, 500)
    ctx.fillText(needs.heading, PAD, y)
  })

  y += 48
  ctx.font = serif(33, 700)
  const needLines = wrap(ctx, needs.body, inner)
  paint(() => {
    ctx.fillStyle = C.ink
    needLines.forEach((line, i) => ctx.fillText(line, PAD, y + i * 44))
  })
  y += needLines.length * 44

  // 푸터
  const footerTop = Math.max(y + 60, MIN_H - 96)
  paint(() => {
    ctx.strokeStyle = C.rule
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD, footerTop - 34)
    ctx.lineTo(W - PAD, footerTop - 34)
    ctx.stroke()

    ctx.fillStyle = C.inkSoft
    ctx.font = sans(23, 400)
    // 혼자면 조합이 없다. 0쌍 0쌍 0쌍은 알려주는 게 없어서 균형 점수만 남긴다
    const stats = solo
      ? `균형 ${analysis.balance}점`
      : `균형 ${analysis.balance}점 · 상생 ${analysis.pairCounts.generating}쌍 · 비슷한 결 ${analysis.pairCounts.same}쌍 · 긴장 ${analysis.pairCounts.tension}쌍`
    ctx.fillText(stats, PAD, footerTop)
    ctx.fillText('팀사주 · 재미로 보는 콘텐츠입니다', PAD, footerTop + 36)
  })

  return footerTop + 36 + 56
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function drawShareCard(
  canvas: HTMLCanvasElement,
  report: TeamReport,
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { src } = illustFor(report.archetype.id, report.analysis.elements.lacking)
  const illust = await loadImage(src)

  // 1차. 높이만 잰다
  canvas.width = W
  canvas.height = MIN_H
  ctx.textBaseline = 'alphabetic'
  const height = Math.max(MIN_H, Math.ceil(layout(ctx, report, illust, false)))

  // 2차. 실제로 그린다. width/height 를 바꾸면 컨텍스트가 초기화된다
  canvas.width = W
  canvas.height = height
  ctx.textBaseline = 'alphabetic'
  drawPaper(ctx, height)
  layout(ctx, report, illust, true)
}

export async function shareCardBlob(report: TeamReport): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  await drawShareCard(canvas, report)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

/** 파일명에 못 쓰는 글자와 공백을 없앤다 */
const cleanName = (s: string) => s.replace(/[\\/:*?"<>|\s]+/g, '-')

export function shareCardFileName(report: TeamReport): string {
  // 유형 이름에도 전부 공백이 들어 있다. 팀 이름만 씻으면 반만 씻는 셈이다
  return `팀사주-${cleanName(report.analysis.teamName)}-${cleanName(report.archetype.name)}.png`
}
