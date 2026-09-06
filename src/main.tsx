import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 개발 모드에서 #demo 로 들어오면 표본 팀을 깔고 결과 화면으로 간다.
// PR 화면 캡쳐용이라 프로덕션 번들에는 안 들어간다.
if (import.meta.env.DEV) {
  void import('./devSeed').then((m) => m.applyDemoHash())
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
