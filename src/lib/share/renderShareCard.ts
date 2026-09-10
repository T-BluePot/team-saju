import { ELEMENTS } from '../saju/constants'
import type { Element } from '../saju/types'
import { SOLO_LEAD, isSolo, needsBlock } from '../report/solo'
import type { TeamReport } from '../report/teamReport'
import { ELEMENT_HEX, ELEMENT_HEX_DEEP, illustFor } from '../ui/elementStyle'
import { shareCanvasCopy } from '../copy'

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
 *
 * 짜임은 시안을 따른다. 위쪽은 이 팀이 누구인지를 말하는 자리라 가운데 정렬이고,
 * 겹줄 아래는 데이터라 한 칸에 왼쪽 정렬이다. 두 구역이 같은 정렬이면
 * 어디까지가 정체이고 어디부터가 근거인지가 안 갈린다.
 */

const W = 1080

/** 한지 여백. 그 안에 종이 면을 한 장 더 깐다 */
const CARD_PAD = 36
const PANEL_PAD_X = 72
const PANEL_PAD_TOP = 76
const PANEL_PAD_BOTTOM = 60

const PANEL_X = CARD_PAD
const PANEL_W = W - CARD_PAD * 2
/** 글이 시작하는 자리와 그 폭 */
const X = PANEL_X + PANEL_PAD_X
const INNER = PANEL_W - PANEL_PAD_X * 2

/** 한지와 먹, 주사. index.css 의 토큰과 같은 값 */
const C = {
  paper: '#F7F3EA',
  paperDeep: '#EFE9DC',
  surface: '#FFFDF8',
  ink: '#17140F',
  inkSoft: '#6B6355',
  rule: '#DDD4C2',
  gold: '#BFA678',
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

/**
 * 회문 모서리 하나.
 *
 * 족자와 같은 무늬다. 화면에서는 SVG 를 배경으로 깔지만 캔버스에는 못 깔아서
 * 같은 좌표를 손으로 그린다. 원본이 23 단위라 원하는 크기로 나눠 배율을 잡는다.
 */
function drawFret(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  flipX: boolean,
  flipY: boolean,
) {
  const s = size / 23
  ctx.save()
  ctx.translate(x + (flipX ? size : 0), y + (flipY ? size : 0))
  ctx.scale(flipX ? -s : s, flipY ? -s : s)
  ctx.strokeStyle = C.gold
  ctx.lineWidth = 1
  ctx.lineJoin = 'miter'

  ctx.beginPath()
  ctx.moveTo(23, 0.5)
  ctx.lineTo(14.5, 0.5)
  ctx.lineTo(14.5, 21.5)
  ctx.lineTo(7.5, 21.5)
  ctx.lineTo(7.5, 0.5)
  ctx.lineTo(0.5, 0.5)
  ctx.lineTo(0.5, 7.5)
  ctx.moveTo(0.5, 14.5)
  ctx.lineTo(0.5, 23)
  ctx.moveTo(0.5, 7.5)
  ctx.lineTo(21.5, 7.5)
  ctx.lineTo(21.5, 14.5)
  ctx.lineTo(0.5, 14.5)
  ctx.stroke()
  ctx.restore()
}

/** 종이 면 위의 금선 액자. 모서리 넷과 그 사이를 잇는 줄 */
function drawFrame(ctx: CanvasRenderingContext2D, top: number, bottom: number) {
  const inset = 20
  const size = 52
  const l = PANEL_X + inset
  const r = PANEL_X + PANEL_W - inset
  const t = top + inset
  const b = bottom - inset

  drawFret(ctx, l, t, size, false, false)
  drawFret(ctx, r - size, t, size, true, false)
  drawFret(ctx, l, b - size, size, false, true)
  drawFret(ctx, r - size, b - size, size, true, true)

  ctx.fillStyle = C.gold
  ctx.fillRect(l + size, t, r - l - size * 2, 2)
  ctx.fillRect(l + size, b - 2, r - l - size * 2, 2)
  ctx.fillRect(l, t + size, 2, b - t - size * 2)
  ctx.fillRect(r - 2, t + size, 2, b - t - size * 2)
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
    const [x, y] = at(i, 1.3)
    ctx.fillStyle = ELEMENT_HEX_DEEP[el]
    ctx.font = serif(34, 700)
    ctx.fillText(el, x, y)
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(26, 500)
    ctx.fillText(`${percents[el]}%`, x, y + 36)
  })
  ctx.textAlign = 'left'
}

/** 점선 한 줄. 캔버스는 `setLineDash` 를 켜면 뒤에 그리는 것까지 물들어서 꼭 되돌린다 */
function dashed(ctx: CanvasRenderingContext2D, y: number) {
  ctx.save()
  ctx.strokeStyle = C.rule
  ctx.lineWidth = 2
  ctx.setLineDash([10, 10])
  ctx.beginPath()
  ctx.moveTo(X, y)
  ctx.lineTo(X + INNER, y)
  ctx.stroke()
  ctx.restore()
}

const RADAR_RADIUS = 186
/** 레이더 라벨이 반지름 밖으로 더 나가서 높이를 따로 잡는다 */
const RADAR_H = Math.round(RADAR_RADIUS * 1.3 * 2 + 70)

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
  const paint = (fn: () => void) => {
    if (draw) fn()
  }
  const mid = X + INNER / 2

  const panelTop = CARD_PAD
  let y = panelTop + PANEL_PAD_TOP

  /* ── 정체 구역. 가운데 정렬 ────────────────────────────── */

  // 인장과 팀 이름과 인원. 셋을 한 줄에 가운데로 모은다
  const who = solo ? shareCanvasCopy.solo : shareCanvasCopy.size(analysis.size)
  ctx.font = serif(36, 700)
  const teamW = ctx.measureText(analysis.teamName).width
  ctx.font = sans(24, 400)
  const sizeW = ctx.measureText(who).width + 36
  const topW = 56 + 18 + teamW + 18 + sizeW
  const topX = mid - topW / 2

  paint(() => {
    ctx.fillStyle = accentDeep
    roundRect(ctx, topX, y, 56, 56, 12)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = serif(30, 800)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(shareCanvasCopy.seal, topX + 28, y + 30)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = C.ink
    ctx.font = serif(36, 700)
    ctx.fillText(analysis.teamName, topX + 74, y + 41)

    ctx.fillStyle = C.paperDeep
    roundRect(ctx, topX + 74 + teamW + 18, y + 13, sizeW, 34, 17)
    ctx.fill()
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(24, 400)
    ctx.fillText(who, topX + 74 + teamW + 36, y + 38)
  })
  y += 56

  // 일러스트
  y += 40
  if (illust && illust.complete && illust.naturalWidth > 0) {
    const ratio = illust.naturalWidth / illust.naturalHeight
    const h = Math.min(270, INNER * 0.52 / ratio)
    const w = h * ratio
    paint(() => ctx.drawImage(illust, mid - w / 2, y, w, h))
    y += h
  }

  // 유형 이름. 혼자면 "이 기운으로 팀을 만들면" 을 위에 붙여서 화면과 화법을 맞춘다
  y += 44
  if (solo) {
    paint(() => {
      ctx.fillStyle = accentDeep
      ctx.font = serif(28, 700)
      ctx.textAlign = 'center'
      ctx.fillText(SOLO_LEAD, mid, y)
      ctx.textAlign = 'left'
    })
    y += 48
  }
  ctx.font = serif(64, 800)
  const nameLines = wrap(ctx, archetype.name, INNER)
  paint(() => {
    ctx.fillStyle = C.ink
    ctx.textAlign = 'center'
    nameLines.forEach((line, i) => ctx.fillText(line, mid, y + 50 + i * 78))
    ctx.textAlign = 'left'
  })
  y += 50 + (nameLines.length - 1) * 78

  y += 28
  ctx.font = serif(31, 400)
  const tagLines = wrap(ctx, archetype.tagline, INNER)
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.textAlign = 'center'
    tagLines.forEach((line, i) => ctx.fillText(line, mid, y + 24 + i * 44))
    ctx.textAlign = 'left'
  })
  y += 24 + (tagLines.length - 1) * 44

  // 겹줄 괘선. 여기서 정체가 끝나고 근거가 시작한다
  y += 48
  paint(() => {
    ctx.fillStyle = C.rule
    ctx.fillRect(X, y, INNER, 2)
    ctx.fillRect(X, y + 7, INNER, 2)
  })
  y += 9

  /* ── 데이터 구역. 한 칸에 왼쪽 정렬 ────────────────────── */

  y += 36
  paint(() =>
    drawRadar(ctx, analysis.elements.percents, mid, y + RADAR_H / 2, RADAR_RADIUS, accent),
  )
  y += RADAR_H

  // 넘치는 기운과 비어 있는 기운. 화면의 주목할 부분과 같은 짜임이다
  y += 36
  const rows = [
    { el: dominant.element, k: shareCanvasCopy.excess, pc: dominant.percent, body: dominant.meaning },
    { el: lacking.element, k: shareCanvasCopy.lacking, pc: lacking.percent, body: lacking.effect },
  ]
  for (const row of rows) {
    dashed(ctx, y)
    y += 28
    paint(() => {
      ctx.fillStyle = ELEMENT_HEX_DEEP[row.el]
      roundRect(ctx, X, y, 58, 58, 15)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = serif(31, 800)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(row.el, X + 29, y + 31)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'

      ctx.fillStyle = C.ink
      ctx.font = serif(32, 700)
      // 오행 이름은 도장이 이미 말한다. `화 넘치는 기운` 은 한 번 더 말하는 셈이다
      ctx.fillText(row.k, X + 78, y + 40)

      ctx.fillStyle = ELEMENT_HEX_DEEP[row.el]
      ctx.font = serif(44, 700)
      ctx.textAlign = 'right'
      ctx.fillText(`${row.pc}%`, X + INNER, y + 44)
      ctx.textAlign = 'left'
    })
    y += 58

    y += 20
    ctx.font = sans(27, 400)
    const lines = wrap(ctx, row.body, INNER - 78)
    paint(() => {
      ctx.fillStyle = C.inkSoft
      lines.forEach((line, i) => ctx.fillText(line, X + 78, y + 26 + i * 42))
    })
    y += 26 + (lines.length - 1) * 42 + 28
  }

  // 처방. 면을 깔아서 이 한 줄만 따로 집어 읽게 한다
  y += 8
  ctx.font = sans(29, 400)
  const rxLines = wrap(ctx, archetype.prescriptions[0], INNER - 64 - 60)
  const boxH = 28 + 44 + 16 + rxLines.length * 44 + 28
  const boxTop = y
  paint(() => {
    ctx.fillStyle = C.paperDeep
    roundRect(ctx, X, boxTop, INNER, boxH, 24)
    ctx.fill()

    ctx.fillStyle = accentDeep
    ctx.beginPath()
    ctx.arc(X + 32 + 22, boxTop + 28 + 22, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = serif(22, 700)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(shareCanvasCopy.prescriptionMark, X + 32 + 22, boxTop + 28 + 23)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = C.ink
    ctx.font = serif(28, 700)
    ctx.fillText(shareCanvasCopy.prescription, X + 32 + 60, boxTop + 28 + 30)

    ctx.fillStyle = C.ink
    ctx.font = sans(29, 400)
    rxLines.forEach((line, i) =>
      ctx.fillText(line, X + 32 + 60, boxTop + 28 + 44 + 16 + 30 + i * 44),
    )
  })
  y = boxTop + boxH

  // 어떤 사람이 오면 좋은지
  y += 44
  dashed(ctx, y)
  y += 40
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(26, 400)
    ctx.fillText(needs.heading, X, y + 22)
  })
  y += 22 + 16

  ctx.font = serif(36, 700)
  const needLines = wrap(ctx, needs.body, INNER)
  paint(() => {
    ctx.fillStyle = C.ink
    needLines.forEach((line, i) => ctx.fillText(line, X, y + 30 + i * 51))
  })
  y += 30 + (needLines.length - 1) * 51

  // 균형 점수
  y += 40
  dashed(ctx, y)
  y += 36
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(26, 400)
    ctx.fillText(shareCanvasCopy.balanceLabel, X, y + 34)

    ctx.textAlign = 'right'
    ctx.fillStyle = accentDeep
    ctx.font = serif(30, 700)
    ctx.fillText(shareCanvasCopy.balanceUnit, X + INNER, y + 34)
    const unitW = ctx.measureText(shareCanvasCopy.balanceUnit).width
    ctx.font = serif(46, 700)
    ctx.fillText(`${analysis.balance}`, X + INNER - unitW - 4, y + 34)
    ctx.textAlign = 'left'
  })
  y += 34

  // 조합 칩. 혼자면 조합이 없다. 0쌍 0쌍 0쌍은 알려주는 게 없어서 안 그린다
  if (!solo) {
    y += 22
    const chips = [
      [shareCanvasCopy.pairGenerating, analysis.pairCounts.generating],
      [shareCanvasCopy.pairSame, analysis.pairCounts.same],
      [shareCanvasCopy.pairTension, analysis.pairCounts.tension],
    ] as const
    paint(() => {
      ctx.font = sans(24, 400)
      let cx = X
      for (const [label, n] of chips) {
        const text = `${label} ${n}${shareCanvasCopy.pairUnit}`
        const w = ctx.measureText(text).width + 40
        ctx.strokeStyle = C.rule
        ctx.lineWidth = 2
        roundRect(ctx, cx, y, w, 46, 23)
        ctx.stroke()
        ctx.fillStyle = C.inkSoft
        ctx.fillText(text, cx + 20, y + 31)
        cx += w + 12
      }
    })
    y += 46
  }

  // 맺음
  y += 56
  paint(() => {
    ctx.fillStyle = C.rule
    ctx.fillRect(X, y, INNER, 1)
  })
  y += 36
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(23, 400)
    ctx.textAlign = 'center'
    ctx.fillText(shareCanvasCopy.note, mid, y + 22)

    ctx.font = serif(26, 700)
    const brandW = ctx.measureText(shareCanvasCopy.brand).width
    const bx = mid - (34 + 14 + brandW) / 2
    ctx.textAlign = 'left'
    ctx.fillStyle = accentDeep
    roundRect(ctx, bx, y + 44, 34, 34, 8)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = serif(20, 800)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(shareCanvasCopy.seal, bx + 17, y + 62)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = C.ink
    ctx.font = serif(26, 700)
    ctx.fillText(shareCanvasCopy.brand, bx + 48, y + 70)
  })
  y += 22 + 16 + 34

  return y + PANEL_PAD_BOTTOM
}

/**
 * 종이 면과 금선 액자.
 *
 * 높이를 알아야 그릴 수 있는데 글보다 먼저 깔려야 한다. 나중에 `destination-over`
 * 로 뒤에 넣어보려다 한지가 이미 불투명하게 깔려 있어서 통째로 가려졌다.
 * 그래서 재는 판을 한 번 돌린 뒤 그 높이로 여기서 먼저 깐다.
 */
function drawPanel(ctx: CanvasRenderingContext2D, panelBottom: number) {
  const h = panelBottom - CARD_PAD
  ctx.fillStyle = C.surface
  ctx.fillRect(PANEL_X, CARD_PAD, PANEL_W, h)
  ctx.strokeStyle = C.rule
  ctx.lineWidth = 2
  ctx.strokeRect(PANEL_X + 1, CARD_PAD + 1, PANEL_W - 2, h - 2)
  drawFrame(ctx, CARD_PAD, panelBottom)
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
  canvas.height = 1400
  ctx.textBaseline = 'alphabetic'
  const panelBottom = Math.ceil(layout(ctx, report, illust, false))
  const height = panelBottom + CARD_PAD

  // 2차. 실제로 그린다. width/height 를 바꾸면 컨텍스트가 초기화된다
  canvas.width = W
  canvas.height = height
  ctx.textBaseline = 'alphabetic'
  drawPaper(ctx, height)
  drawPanel(ctx, panelBottom)
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
  return shareCanvasCopy.fileName(
    cleanName(report.analysis.teamName),
    cleanName(report.archetype.name),
  )
}
