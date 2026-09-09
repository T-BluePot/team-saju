/**
 * 어디서나 쓰는 공통 프리미티브.
 *
 * 화면에서는 여기 있는 것만 쓴다. 카드 테두리나 버튼 색을 컴포넌트마다
 * 직접 적기 시작하면 금방 어긋난다.
 * 색은 전부 `src/index.css` 의 CSS 변수를 본다.
 */
export { CommonButton, type CommonButtonVariant } from './CommonButton'
export { CommonCard, CommonWell } from './CommonCard'
export { CommonChip } from './CommonChip'
export {
  CommonCheckLabel,
  CommonField,
  CommonFieldLabel,
  CommonFieldGroup,
  CommonPickCard,
  CommonSelect,
  CommonTextInput,
} from './CommonField'
export {
  CommonRule,
  CommonSeal,
  CommonSection,
  CommonSubHeading,
} from './CommonSection'
