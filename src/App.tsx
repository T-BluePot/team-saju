import { useEffect } from 'react'

import { AppHeader, AppNotice } from './components/Layout'
import { InputPage } from './pages/InputPage'
import { LandingPage } from './pages/LandingPage'
import { LoadingPage } from './pages/LoadingPage'
import { ResultPage } from './pages/ResultPage'
import { useTeamStore } from './store/teamStore'

/**
 * 동의를 가로막는 전면 모달은 없다.
 *
 * 전에는 입력 화면에 들어서면 모달이 떴다. 화면을 한 겹 더 쌓는 구조라
 * 뒤쪽을 `inert` 로 잠그고 모달이 새는 경로를 따로 막아야 했다.
 * 지금은 랜딩의 체크박스가 유일한 관문이고, 동의 없이 입력 화면에 서는 상태 자체를
 * `teamStore` 의 `entryView` 가 막는다. 잠글 뒤쪽이 없다.
 */
export default function App() {
  const view = useTeamStore((s) => s.view)

  /**
   * 화면이 바뀌면 맨 위로 올린다.
   *
   * 예시 리포트에서 동의 없이 "내 팀으로 해보기" 를 누르면 랜딩으로 돌아오는데,
   * 스크롤이 그대로라 첫 화면이 중간부터 보였다. 왜 되돌아왔는지도 모르는 판에
   * 화면까지 반쯤 잘려 있으면 길을 잃는다.
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-8">
        {view === 'landing' && <LandingPage />}
        {view === 'input' && <InputPage />}
        {view === 'loading' && <LoadingPage />}
        {view === 'result' && <ResultPage />}
      </main>
      <AppNotice />
    </div>
  )
}
