import type { ReactNode } from 'react'
import { CommonScroll, CommonSeal } from '../Common'
import type { Archetype } from '../../lib/report/archetypes'
import { scrollCopy } from '../../lib/copy'
import { ELEMENT_LABEL } from '../../lib/saju/constants'
import { object } from '../../lib/text/josa'
import { ELEMENT_COLOR_DEEP, illustFor } from '../../lib/ui/elementStyle'

/**
 * 유형을 건 족자.
 *
 * 결과에서 펼쳐지고, 첫 화면에서는 한 장씩 넘겨본다. 둘이 같은 걸 본다.
 * 첫 화면에서 스쳐본 판이 결과에서 자기 유형으로 걸리는 게 이 화면의 맺음이다.
 * 그래서 판을 두 벌로 나누지 않는다.
 */
export type ArchetypeContentProps = {
  archetype: Archetype
  /** 어떤 사람이 오면 좋은지. 혼자일 때 말이 달라져서 밖에서 받는다 */
  needs: { heading: string; body: string }
  /** 유형 이름 위에 붙는 한 줄. 혼자일 때만 있다 */
  lead?: string
}

/**
 * 판에 걸리는 내용만. 판은 밖에서 씌운다.
 *
 * 첫 화면은 여섯 장을 한 판에 겹쳐 쌓아두고 한 장만 보여준다. 그래야 판이
 * 제일 긴 장에 맞춰 서고 넘길 때 봉이 안 뛴다. 판을 장마다 새로 씌우면
 * 그렇게 못 한다.
 */
export function ArchetypeContent({ archetype, needs, lead }: ArchetypeContentProps) {
  const illust = illustFor(archetype.id, archetype.lacking)

  return (
    <>
      {lead && (
        <p className="serif text-sm" style={{ color: 'var(--accent-deep)' }}>
          {lead}
        </p>
      )}

      <img src={illust.src} alt={illust.alt} className="h-42 w-auto object-contain" />
      <p className="serif text-2xl font-extrabold leading-tight tracking-tight">
        {archetype.name}
      </p>
      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
        {archetype.tagline}
      </p>

      <span aria-hidden="true" className="scroll-rule" />

      {/* 판이 길어지면 이 덩어리가 아래 봉 쪽으로 붙는다 */}
      <div className="mt-auto flex w-full flex-col items-center gap-3">
        <p className="text-11" style={{ color: 'var(--ink-soft)' }}>
          {needs.heading}
        </p>
        <p className="serif text-lg font-bold leading-relaxed">{needs.body}</p>

        {/* 왜 그 사람이냐를 한 줄로 받는다. 도장은 이 판이 팀사주 것이라는 표시다 */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-11" style={{ color: 'var(--ink-soft)' }}>
            <ScrollWhy lacking={archetype.lacking} />
          </span>
          <CommonSeal className="size-8 text-11">{scrollCopy.seal}</CommonSeal>
        </div>
      </div>
    </>
  )
}

export function ArchetypeScroll({
  unroll = false,
  overlay,
  ...content
}: ArchetypeContentProps & {
  unroll?: boolean
  overlay?: ReactNode
}) {
  return (
    <CommonScroll unroll={unroll} overlay={overlay}>
      <ArchetypeContent {...content} />
    </CommonScroll>
  )
}

function ScrollWhy({ lacking }: { lacking: Archetype['lacking'] }) {
  if (!lacking) return scrollCopy.whyBalanced

  const label = ELEMENT_LABEL[lacking]
  // 조사만 떼어 온다. 화면에는 한글 이름 대신 한자가 색으로 선다
  const josa = object(label).slice(label.length)

  return (
    <>
      {scrollCopy.whyHead}
      <span className="serif font-bold" style={{ color: ELEMENT_COLOR_DEEP[lacking] }}>
        {lacking}
      </span>
      {scrollCopy.whyTail(josa)}
    </>
  )
}
