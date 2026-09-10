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

/**
 * 글 한 덩어리.
 *
 * 캔버스는 기준선으로 그리는데 여백은 상자로 재야 맞는다. 기준선에 바로 여백을
 * 더하면 글자 크기가 바뀔 때마다 위아래가 제각각 벌어진다. 실제로 그렇게 짰다가
 * 같은 값을 줬는데 자리마다 다르게 벌어졌다.
 *
 * 넘긴 `y` 는 상자의 위쪽이고 돌려주는 값은 아래쪽이다. 사이 간격은 부르는 쪽이
 * 더한다. CSS 의 `margin-top` 과 같은 셈이다.
 */
function block(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineH: number,
  draw: boolean,
  align: CanvasTextAlign = 'left',
): number {
  if (draw) {
    ctx.textAlign = align
    lines.forEach((line, i) => ctx.fillText(line, x, y + lineH * (i + 0.72)))
    ctx.textAlign = 'left'
  }
  return y + lineH * lines.length
}

/**
 * 알약 하나. 인원 배지와 조합 칩이 같은 모양이라 한 곳에서 그린다.
 *
 * 채우기와 테두리만 갈린다. 자리마다 따로 그렸더니 높이와 좌우 여백이 갈라졌다.
 * 그린 폭을 돌려줘서 부르는 쪽이 다음 칸 자리를 잡는다.
 */
function pill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  text: string,
  fill: string | null,
): number {
  const w = ctx.measureText(text).width + 40
  if (fill) {
    ctx.fillStyle = fill
    roundRect(ctx, x, y, w, h, h / 2)
    ctx.fill()
  } else {
    ctx.strokeStyle = C.rule
    ctx.lineWidth = 2
    roundRect(ctx, x, y, w, h, h / 2)
    ctx.stroke()
  }
  ctx.fillStyle = C.inkSoft
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + 20, y + h / 2 + 1)
  ctx.textBaseline = 'alphabetic'
  return w
}

/** 도장 하나. 인장도 오행 표식도 처방 딱지도 같은 규칙으로 그린다 */
function seal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number,
  bg: string,
  glyph: string,
  fontSize: number,
) {
  ctx.fillStyle = bg
  if (radius >= size / 2) {
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    roundRect(ctx, x, y, size, size, radius)
    ctx.fill()
  }
  ctx.fillStyle = '#fff'
  ctx.font = serif(fontSize, 800)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(glyph, x + size / 2, y + size / 2 + 1)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
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

  let y = CARD_PAD + PANEL_PAD_TOP

  /* ── 정체 구역. 가운데 정렬 ────────────────────────────── */

  // 인장과 팀 이름과 인원. 셋을 한 줄에 가운데로 모은다
  const who = solo ? shareCanvasCopy.solo : shareCanvasCopy.size(analysis.size)
  ctx.font = serif(36, 700)
  const teamW = ctx.measureText(analysis.teamName).width
  ctx.font = sans(24, 400)
  const pillW = ctx.measureText(who).width + 40
  const topX = mid - (56 + 18 + teamW + 18 + pillW) / 2
  const topY = y

  paint(() => {
    seal(ctx, topX, topY, 56, 12, accentDeep, shareCanvasCopy.seal, 30)

    ctx.fillStyle = C.ink
    ctx.font = serif(36, 700)
    ctx.fillText(analysis.teamName, topX + 74, topY + 41)

    ctx.font = sans(24, 400)
    pill(ctx, topX + 74 + teamW + 18, topY + 11, 34, who, C.paperDeep)
  })
  y += 56

  // 일러스트
  if (illust && illust.complete && illust.naturalWidth > 0) {
    y += 40
    const ratio = illust.naturalWidth / illust.naturalHeight
    const h = Math.min(270, (INNER * 0.52) / ratio)
    const w = h * ratio
    const top = y
    paint(() => ctx.drawImage(illust, mid - w / 2, top, w, h))
    y += h
  }

  // 유형 이름. 혼자면 "이 기운으로 팀을 만들면" 을 위에 붙여서 화면과 화법을 맞춘다
  if (solo) {
    y += 40
    ctx.font = serif(28, 700)
    paint(() => {
      ctx.fillStyle = accentDeep
    })
    y = block(ctx, [SOLO_LEAD], mid, y, 40, draw, 'center') + 4
  } else {
    y += 44
  }

  ctx.font = serif(64, 800)
  paint(() => {
    ctx.fillStyle = C.ink
  })
  y = block(ctx, wrap(ctx, archetype.name, INNER), mid, y, 78, draw, 'center')

  y += 20
  ctx.font = serif(31, 400)
  paint(() => {
    ctx.fillStyle = C.inkSoft
  })
  y = block(ctx, wrap(ctx, archetype.tagline, INNER), mid, y, 44, draw, 'center')

  // 겹줄 괘선. 여기서 정체가 끝나고 근거가 시작한다
  y += 48
  const ruleY = y
  paint(() => {
    ctx.fillStyle = C.rule
    ctx.fillRect(X, ruleY, INNER, 2)
    ctx.fillRect(X, ruleY + 7, INNER, 2)
  })
  y += 9

  /* ── 데이터 구역. 한 칸에 왼쪽 정렬 ────────────────────── */

  y += 36
  const radarTop = y
  paint(() =>
    drawRadar(ctx, analysis.elements.percents, mid, radarTop + RADAR_H / 2, RADAR_RADIUS, accent),
  )
  y += RADAR_H

  // 넘치는 기운과 비어 있는 기운. 화면의 주목할 부분과 같은 짜임이다
  y += 36
  const rows = [
    {
      el: dominant.element,
      k: shareCanvasCopy.excess,
      pc: dominant.percent,
      body: dominant.meaning,
    },
    { el: lacking.element, k: shareCanvasCopy.lacking, pc: lacking.percent, body: lacking.effect },
  ]
  rows.forEach((row, i) => {
    if (i > 0) y += 28
    dashed(ctx, y)
    y += 28

    const headTop = y
    paint(() => {
      seal(ctx, X, headTop, 58, 15, ELEMENT_HEX_DEEP[row.el], row.el, 31)

      // 오행 이름은 도장이 이미 말한다. `화 넘치는 기운` 은 한 번 더 말하는 셈이다
      ctx.fillStyle = C.ink
      ctx.font = serif(32, 700)
      ctx.fillText(row.k, X + 78, headTop + 40)

      ctx.fillStyle = ELEMENT_HEX_DEEP[row.el]
      ctx.font = serif(44, 700)
      ctx.textAlign = 'right'
      ctx.fillText(`${row.pc}%`, X + INNER, headTop + 44)
      ctx.textAlign = 'left'
    })
    y += 58

    y += 20
    ctx.font = sans(27, 400)
    paint(() => {
      ctx.fillStyle = C.inkSoft
    })
    y = block(ctx, wrap(ctx, row.body, INNER - 78), X + 78, y, 42, draw)
  })

  // 처방. 면을 깔아서 이 한 줄만 따로 집어 읽게 한다
  y += 36
  const RX_PAD = 32
  ctx.font = sans(29, 400)
  const rxLines = wrap(ctx, archetype.prescriptions[0], INNER - RX_PAD * 2 - 60)
  const boxTop = y
  const boxH = RX_PAD + 44 + 16 + rxLines.length * 44 + RX_PAD

  paint(() => {
    ctx.fillStyle = C.paperDeep
    roundRect(ctx, X, boxTop, INNER, boxH, 24)
    ctx.fill()
    seal(
      ctx,
      X + RX_PAD,
      boxTop + RX_PAD + 11,
      44,
      22,
      accentDeep,
      shareCanvasCopy.prescriptionMark,
      22,
    )
  })

  ctx.font = serif(28, 700)
  paint(() => {
    ctx.fillStyle = C.ink
  })
  block(ctx, [shareCanvasCopy.prescription], X + RX_PAD + 60, boxTop + RX_PAD, 44, draw)

  ctx.font = sans(29, 400)
  block(ctx, rxLines, X + RX_PAD + 60, boxTop + RX_PAD + 44 + 16, 44, draw)
  y = boxTop + boxH

  // 어떤 사람이 오면 좋은지
  y += 44
  dashed(ctx, y)
  y += 40
  ctx.font = sans(26, 400)
  paint(() => {
    ctx.fillStyle = C.inkSoft
  })
  y = block(ctx, [needs.heading], X, y, 36, draw)

  y += 12
  ctx.font = serif(36, 700)
  paint(() => {
    ctx.fillStyle = C.ink
  })
  y = block(ctx, wrap(ctx, needs.body, INNER), X, y, 51, draw)

  // 균형 점수
  y += 40
  dashed(ctx, y)
  y += 36
  const scoreTop = y
  paint(() => {
    ctx.fillStyle = C.inkSoft
    ctx.font = sans(26, 400)
    ctx.fillText(shareCanvasCopy.balanceLabel, X, scoreTop + 40)

    ctx.textAlign = 'right'
    ctx.fillStyle = accentDeep
    ctx.font = serif(30, 700)
    ctx.fillText(shareCanvasCopy.balanceUnit, X + INNER, scoreTop + 40)
    const unitW = ctx.measureText(shareCanvasCopy.balanceUnit).width
    ctx.font = serif(46, 700)
    ctx.fillText(`${analysis.balance}`, X + INNER - unitW - 6, scoreTop + 40)
    ctx.textAlign = 'left'
  })
  y += 52

  // 조합 칩. 혼자면 조합이 없다. 0쌍 0쌍 0쌍은 알려주는 게 없어서 안 그린다
  if (!solo) {
    y += 22
    const chipTop = y
    const chips = [
      [shareCanvasCopy.pairGenerating, analysis.pairCounts.generating],
      [shareCanvasCopy.pairSame, analysis.pairCounts.same],
      [shareCanvasCopy.pairTension, analysis.pairCounts.tension],
    ] as const
    paint(() => {
      ctx.font = sans(24, 400)
      let cx = X
      for (const [label, n] of chips) {
        cx += pill(ctx, cx, chipTop, 46, `${label} ${n}${shareCanvasCopy.pairUnit}`, null) + 12
      }
    })
    y += 46
  }

  // 맺음
  y += 56
  const signY = y
  paint(() => {
    ctx.fillStyle = C.rule
    ctx.fillRect(X, signY, INNER, 1)
  })
  y += 36

  ctx.font = sans(23, 400)
  paint(() => {
    ctx.fillStyle = C.inkSoft
  })
  y = block(ctx, [shareCanvasCopy.note], mid, y, 32, draw, 'center')

  y += 16
  const brandTop = y
  paint(() => {
    ctx.font = serif(26, 700)
    const brandW = ctx.measureText(shareCanvasCopy.brand).width
    const bx = mid - (34 + 14 + brandW) / 2

    seal(ctx, bx, brandTop, 34, 8, accentDeep, shareCanvasCopy.seal, 20)

    ctx.fillStyle = C.ink
    ctx.font = serif(26, 700)
    ctx.fillText(shareCanvasCopy.brand, bx + 48, brandTop + 26)
  })
  y += 34

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
