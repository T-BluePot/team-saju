import { LoadingView } from '../components/Loading'
import { useTeamStore } from '../store/teamStore'

export function LoadingPage() {
  const charts = useTeamStore((s) => s.charts)
  const finishLoading = useTeamStore((s) => s.finishLoading)
  return <LoadingView charts={charts} onDone={finishLoading} />
}
