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
