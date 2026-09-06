import { AppHeader, AppNotice } from './components/Layout'
import { InputConsentModal } from './components/Input'
import { InputPage } from './pages/InputPage'
import { LandingPage } from './pages/LandingPage'
import { LoadingPage } from './pages/LoadingPage'
import { ResultPage } from './pages/ResultPage'
import { useTeamStore } from './store/teamStore'

export default function App() {
  const consented = useTeamStore((s) => s.consented)
  const isExample = useTeamStore((s) => s.isExample)
  const view = useTeamStore((s) => s.view)
  const agree = useTeamStore((s) => s.agree)
  const goLanding = useTeamStore((s) => s.goLanding)

  /**
   * 동의 모달을 띄울 때.
   *
   * 예시 리포트는 개인정보를 안 넣으니 예외로 둔다. 그거 말고는 랜딩 밖 어디서든 띄운다.
   * `view === 'input'` 으로만 좁혔더니 안전망이 사라졌다. 모달이 포커스를 안 가둬서
   * 뒤쪽 폼에 키보드로 들어가 입력하고 추가하는 게 되는데, 전에는 loading 과 result 에서도
   * 모달이 따라붙어 결국 처리해야 했다. 좁히니까 한 번 새면 그대로 빠져나갔다.
   */
  const needsConsent = !consented && !isExample && view !== 'landing'

  return (
    <div className="min-h-screen">
      <AppHeader />
      {/*
        모달이 떠 있는 동안 뒤쪽을 통째로 잠근다. 오버레이만으로는 키보드가 뚫고 들어간다.
        `addMember` 에 동의 검사가 없어서 그대로 입력이 되어버렸다.
      */}
      <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-8" inert={needsConsent}>
        {view === 'landing' && <LandingPage />}
        {view === 'input' && <InputPage />}
        {view === 'loading' && <LoadingPage />}
        {view === 'result' && <ResultPage />}
      </main>
      <AppNotice />
      {needsConsent && <InputConsentModal onAgree={agree} onDecline={goLanding} />}
    </div>
  )
}
