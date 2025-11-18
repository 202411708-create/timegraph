import { AnimatePresence } from 'framer-motion'
import { useFocusStore } from './store/focusStore'
import IntroScreen from './components/focus/IntroScreen'
import ActiveTracker from './components/focus/ActiveTracker'
import ResultScreen from './components/focus/ResultScreen'
import ComparisonScreen from './components/focus/ComparisonScreen'

type AppScreen = 'intro' | 'active' | 'result' | 'comparison'

function App() {
  const { currentSession } = useFocusStore()

  const getScreen = (): AppScreen => {
    if (!currentSession) return 'intro'
    if (currentSession.isActive) return 'active'
    if (currentSession.endTime && !currentSession.showComparison) return 'result'
    return 'comparison'
  }

  const screen = getScreen()

  return (
    <div className="min-h-screen bg-muji-bg">
      <AnimatePresence mode="wait">
        {screen === 'intro' && <IntroScreen key="intro" />}
        {screen === 'active' && <ActiveTracker key="active" />}
        {screen === 'result' && <ResultScreen key="result" />}
        {screen === 'comparison' && <ComparisonScreen key="comparison" />}
      </AnimatePresence>
    </div>
  )
}

export default App
