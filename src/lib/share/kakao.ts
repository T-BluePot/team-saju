import { KAKAO_JS_KEY, SITE_URL } from '../config'

/**
 * 카카오톡 공유.
 *
 * SDK 는 처음 누를 때 받는다. `index.html` 에 넣으면 카카오를 안 쓰는 사람도,
 * 공유를 안 누르는 사람도 85KB 를 같이 받는다. 첫 화면에 필요한 게 아니다.
 *
 * **피드 템플릿을 쓴다.** 썸네일은 팀마다 그리는 그림이 아니라 브랜드 한 장을
 * 고정으로 쓴다(`public/og.png`). 공유 카드는 브라우저에서 그 자리에서 그리는
 * 그림이라 밖에서 열 수 있는 주소가 없고, v1 은 아무것도 저장하지 않기로 해서
 * 서버에 올릴 수도 없다. 결과 페이지를 서버에 두게 되면 그때 팀별 그림으로 바꾼다.
 *
 * 팀마다 다른 건 제목과 설명이 말한다. 그림으로 보내고 싶으면
 * `이미지로 공유하기` 카드가 이미 그 일을 한다.
 */

const SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'
/** 받아서 직접 sha384 로 잰 값. CDN 이 바뀌면 로드가 실패하고 폴백으로 떨어진다 */
const SDK_INTEGRITY = 'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka'

/** 고정 썸네일. 카카오가 권하는 800x400 이다 */
const THUMB = { path: '/og.png', width: 800, height: 400 } as const

type Link = { mobileWebUrl: string; webUrl: string }

type KakaoSdk = {
  isInitialized: () => boolean
  init: (key: string) => void
  Share: {
    sendDefault: (payload: {
      objectType: 'feed'
      content: {
        title: string
        description: string
        imageUrl: string
        imageWidth: number
        imageHeight: number
        link: Link
      }
      buttons: Array<{ title: string; link: Link }>
    }) => void
  }
}

declare global {
  interface Window {
    Kakao?: KakaoSdk
  }
}

/**
 * 이 주소에서 카카오를 불러도 되나.
 *
 * 키는 번들에 박히는 공개 값이라 **진짜 제한은 카카오 개발자 콘솔의 사이트 도메인
 * 등록**이다. 여기서는 그 등록과 같은 목록을 코드에서 한 번 더 본다. 프리뷰 배포나
 * 남의 사이트에 이 번들이 올라갔을 때 버튼이 떠서 눌렀다가 카카오가 거절하는 걸 막는다.
 *
 * 콘솔 등록이 빠지면 키를 복사해 간 쪽은 이 가드를 안 거치니 제한이 없는 것과 같다.
 * 개발 서버는 localhost 만 연다. 콘솔에도 같은 주소를 등록해야 실제로 보내진다.
 */
function allowedHere(): boolean {
  if (typeof window === 'undefined') return false
  const { origin, hostname } = window.location
  if (origin === new URL(SITE_URL).origin) return true
  return import.meta.env.DEV && hostname === 'localhost'
}

/** 키가 있고 허락된 주소일 때만 버튼을 그린다 */
export function kakaoReady(): boolean {
  return KAKAO_JS_KEY.length > 0 && allowedHere()
}

let loading: Promise<KakaoSdk | null> | null = null

function loadSdk(): Promise<KakaoSdk | null> {
  if (window.Kakao) return Promise.resolve(window.Kakao)
  // 두 번 눌러도 스크립트는 한 번만 붙는다
  if (loading) return loading

  loading = new Promise<KakaoSdk | null>((resolve) => {
    const el = document.createElement('script')
    el.src = SDK_SRC
    el.integrity = SDK_INTEGRITY
    el.crossOrigin = 'anonymous'
    el.async = true
    el.onload = () => resolve(window.Kakao ?? null)
    el.onerror = () => resolve(null)
    document.head.appendChild(el)
  }).then((sdk) => {
    // 실패는 캐시하지 않는다. 네트워크가 돌아오면 다시 받아볼 수 있어야 한다
    if (!sdk) loading = null
    return sdk
  })

  return loading
}

/**
 * 피드 한 장을 보낸다.
 *
 * 보낼 수 없으면 `false` 를 돌려준다. 부르는 쪽이 링크 복사로 떨어뜨린다.
 * 여기서 문구를 만들지 않는다. 카피는 `lib/copy/share.ts` 가 들고 있다.
 *
 * `imageUrl` 은 카카오 서버가 직접 받아가는 주소라 상대 경로면 안 된다.
 * 로컬에서 눌러보면 `localhost` 를 카카오가 못 열어서 썸네일만 빈다.
 * 문구와 링크는 그대로 나가니 개발 중에 확인하는 데는 문제가 없다.
 */
export async function shareToKakao(
  title: string,
  description: string,
  button: string,
  url: string,
): Promise<boolean> {
  if (!kakaoReady()) return false

  const sdk = await loadSdk()
  if (!sdk) return false

  const link: Link = { mobileWebUrl: url, webUrl: url }

  try {
    if (!sdk.isInitialized()) sdk.init(KAKAO_JS_KEY)
    sdk.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: `${url}${THUMB.path}`,
        imageWidth: THUMB.width,
        imageHeight: THUMB.height,
        link,
      },
      buttons: [{ title: button, link }],
    })
    return true
  } catch {
    return false
  }
}
