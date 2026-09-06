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
      {!consented && view !== 'landing' && <InputConsentModal onAgree={agree} />}
    </div>
  )
}
