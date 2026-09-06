import { CommonButton, CommonCard } from '../Common'

type Props = {
  onAgree: () => void
  onDecline: () => void
}

const ITEMS: Array<[string, string]> = [
  ['받는 것', '이름 또는 별칭, 생년월일, 성별. 태어난 시간은 선택'],
  ['쓰는 곳', '사주 계산과 팀 리포트를 만드는 데만'],
  ['남기는 곳', '없음. 서버로도 안 보내고 브라우저에도 안 남깁니다'],
  ['지우는 법', '새로고침하면 그냥 사라집니다'],
]

/**
 * 최초 1회 개인정보 동의. 문서 06-privacy.md
 * 다크패턴을 쓰지 않는다. 동의와 거부를 같은 크기로 나란히 둔다.
 *
 * 바깥 패널은 모바일에서 하단 시트로, 데스크톱에서 가운데 모달로 바뀌는
 * 전용 모서리 값(rounded-t-[28px] / rounded-[28px])을 쓴다. CommonCard는
 * 항상 rounded-2xl 이라 이 모양을 낼 수 없어서 배경/괘선만 직접 맞춘다.
 */
export function InputConsentModal({ onAgree, onDecline }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      style={{ background: 'color-mix(in srgb, #17140f 55%, transparent)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <CommonCard
        as="div"
        flush
        radius="rounded-t-[28px] sm:rounded-[28px]"
        className="flex max-h-[92vh] w-full max-w-md flex-col"
      >
        <div className="flex-1 overflow-y-auto px-7 pb-6 pt-8">
          <span
            className="seal animate-seal px-2 py-1 text-[11px]"
            style={{ transform: 'rotate(-4deg)' }}
          >
            告知
          </span>

          <h2 id="consent-title" className="serif mt-4 text-2xl font-extrabold">
            시작 전에 하나만
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            생년월일시는 개인정보라 어떻게 다루는지 먼저 말씀드립니다
          </p>

          <hr className="rule my-6" />

          <dl className="flex flex-col gap-4">
            {ITEMS.map(([term, desc]) => (
              <div key={term} className="flex gap-4">
                <dt
                  className="serif w-16 shrink-0 text-sm font-bold"
                  style={{ color: 'var(--accent)' }}
                >
                  {term}
                </dt>
                <dd className="flex-1 text-sm leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>

          <p
            className="mt-6 border-l-2 pl-3 text-xs leading-relaxed"
            style={{ borderColor: 'var(--accent)', color: 'var(--ink-soft)' }}
          >
            만 14세 이상만 이용할 수 있습니다. 재미로 보는 콘텐츠이고 채용이나 평가에
            쓰라고 만든 게 아닙니다. 동의를 안 하셔도 되는데, 생년월일이 없으면 계산
            자체가 안 됩니다.
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onDecline}
            className="block w-full py-4 text-center text-sm"
            style={{
              borderTop: '1px solid var(--rule)',
              color: 'var(--ink-soft)',
            }}
          >
            동의하지 않고 나가기
          </button>
          <CommonButton type="button" variant="primary" fullBleed serif onClick={onAgree}>
            동의하고 시작하기
          </CommonButton>
        </div>
      </CommonCard>
    </div>
  )
}
