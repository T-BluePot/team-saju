import type { AppliedCorrection } from './types'

/**
 * 시간 보정. 문서 03-saju-spec.md 2장
 *
 * 사주 시주는 진태양시 기준이다. 한국은 동경 135도를 표준자오선으로 쓰는데
 * 실제 국토는 127.5도쯤에 있다. 그래서 시계가 태양보다 30분쯤 빠르다.
 *
 * 적용 순서: 입력시각 -> 서머타임이면 1시간 빼기 -> 표준자오선 보정 30분 빼기
 */

export const KOREA_LONGITUDE = 127.5
export const STANDARD_MERIDIAN = 135

/** (135 - 127.5) x 4분 = 30분 */
export const LONGITUDE_OFFSET_MINUTES = Math.round(
  (STANDARD_MERIDIAN - KOREA_LONGITUDE) * 4,
)

/** 서머타임 시행 기간. 시작일과 종료일 모두 포함 */
const DST_PERIODS: Array<[number, string, string]> = [
  [1948, '06-01', '09-13'],
  [1949, '04-03', '09-11'],
  [1950, '04-01', '09-10'],
  [1951, '05-06', '09-09'],
  [1955, '05-05', '09-09'],
  [1956, '05-20', '09-30'],
  [1957, '05-05', '09-22'],
  [1958, '05-04', '09-21'],
  [1959, '05-03', '09-20'],
  [1960, '05-01', '09-18'],
  [1987, '05-10', '10-11'],
  [1988, '05-08', '10-09'],
]

/**
 * 표준자오선이 동경 135도였던 기간. 이때만 경도 보정을 한다.
 * 1908-04-01 ~ 1912-01-01 과 1954-03-21 ~ 1961-08-10 은 UTC+8:30 이라 보정하지 않는다.
 */
const MERIDIAN_135_PERIODS: Array<[string, string]> = [
  ['1912-01-01', '1954-03-21'],
  ['1961-08-10', '9999-12-31'],
]

export type CorrectedTime = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  corrections: AppliedCorrection[]
}

function ymdToNumber(y: number, m: number, d: number): number {
  return y * 10000 + m * 100 + d
}

function parseMd(md: string): [number, number] {
  const [m, d] = md.split('-').map(Number)
  return [m, d]
}

function parseYmd(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number)
  return ymdToNumber(y, m, d)
}

export function isDaylightSaving(year: number, month: number, day: number): boolean {
  const period = DST_PERIODS.find(([y]) => y === year)
  if (!period) return false
  const [, startMd, endMd] = period
  const [sm, sd] = parseMd(startMd)
  const [em, ed] = parseMd(endMd)
  const target = month * 100 + day
  return target >= sm * 100 + sd && target <= em * 100 + ed
}

export function needsLongitudeCorrection(
  year: number,
  month: number,
  day: number,
): boolean {
  const target = ymdToNumber(year, month, day)
  return MERIDIAN_135_PERIODS.some(
    ([from, to]) => target >= parseYmd(from) && target < parseYmd(to),
  )
}

/**
 * 시계 시각을 진태양시로 바꾼다.
 * useTrueSolarTime 이 false 면 서머타임만 되돌리고 경도 보정은 하지 않는다.
 * 서머타임은 유파와 무관하게 "실제로 그 시각이 아니었던" 문제라 항상 되돌린다.
 */
export function correctTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  useTrueSolarTime: boolean,
): CorrectedTime {
  const corrections: AppliedCorrection[] = []
  let offsetMinutes = 0

  if (isDaylightSaving(year, month, day)) {
    offsetMinutes -= 60
    corrections.push({
      kind: 'dst',
      label: '서머타임 보정',
      detail: `${year}년은 일광절약시간 시행 기간이라 1시간을 뺐습니다`,
    })
  }

  if (useTrueSolarTime && needsLongitudeCorrection(year, month, day)) {
    offsetMinutes -= LONGITUDE_OFFSET_MINUTES
    corrections.push({
      kind: 'longitude',
      label: '진태양시 보정',
      detail: `표준자오선 동경 ${STANDARD_MERIDIAN}도와 한국 ${KOREA_LONGITUDE}도의 차이만큼 ${LONGITUDE_OFFSET_MINUTES}분을 뺐습니다`,
    })
  }

  // UTC 기준으로 계산해서 실행 환경의 시간대에 영향받지 않게 한다
  const ms = Date.UTC(year, month - 1, day, hour, minute) + offsetMinutes * 60_000
  const shifted = new Date(ms)

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    corrections,
  }
}
