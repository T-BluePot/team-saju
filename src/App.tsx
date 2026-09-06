import { AppHeader, AppNotice } from './components/Layout'
import { InputConsentModal } from './components/Input'
import { InputPage } from './pages/InputPage'
import { LandingPage } from './pages/LandingPage'
import { LoadingPage } from './pages/LoadingPage'
import { ResultPage } from './pages/ResultPage'
import { useTeamStore } from './store/teamStore'

export default function App() {
  const consented = useTeamStore((s) => s.consented)
  const view = useTeamStore((s) => s.view)
  const agree = useTeamStore((s) => s.agree)
  const goLanding = useTeamStore((s) => s.goLanding)

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
      {/*
        동의는 개인정보를 넣을 때 받는다. 예시 리포트를 보는 데 받을 이유가 없다.
        입력 화면 말고는 넣을 곳도 없으니 view 로 좁힌다.
      */}
      {!consented && view === 'input' && (
        <InputConsentModal onAgree={agree} onDecline={goLanding} />
      )}
    </div>
  )
}
