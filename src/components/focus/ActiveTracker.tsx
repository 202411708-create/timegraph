import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFocusStore } from '../../store/focusStore'
import Button from '../common/Button'
import Card from '../common/Card'
import MujiIcon from '../common/MujiIcon'
import CheckPrompt from './CheckPrompt'

export default function ActiveTracker() {
  const { currentSession, endSession, addCheck } = useFocusStore()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const [nextCheckSeconds, setNextCheckSeconds] = useState(120) // 2 minutes = 120 seconds

  // Update elapsed time
  useEffect(() => {
    if (!currentSession?.isActive) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSession])

  // Check for 2-minute intervals
  useEffect(() => {
    if (!currentSession?.isActive) return

    const intervalSeconds = currentSession.intervalMinutes * 60
    const timeUntilNextCheck = intervalSeconds - (elapsedSeconds % intervalSeconds)
    setNextCheckSeconds(timeUntilNextCheck)

    if (elapsedSeconds > 0 && elapsedSeconds % intervalSeconds === 0) {
      setShowPrompt(true)
    }
  }, [elapsedSeconds, currentSession])

  // Auto-submit as "distracted" after 60 seconds
  useEffect(() => {
    if (!showPrompt) return

    const timeout = setTimeout(() => {
      addCheck('distracted')
      setShowPrompt(false)
    }, 60000)

    return () => clearTimeout(timeout)
  }, [showPrompt, addCheck])

  if (!currentSession) return null

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = currentSession.checks.length > 0 ? (currentSession.checks.length / 12) * 100 : 0
  const lastTenChecks = currentSession.checks.slice(-10)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <Card>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-muji-dark">세션 진행 중</h2>
            <div className="space-y-1">
              <p className="text-3xl font-mono text-muji-dark">{formatTime(elapsedSeconds)}</p>
              <p className="text-sm text-muji-mid">
                체크 횟수: {currentSession.checks.length}
              </p>
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muji-mid mb-1">
              <span>진행률</span>
              <span>{Math.min(100, Math.round(progressPercentage))}%</span>
            </div>
            <div className="w-full bg-muji-beige rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progressPercentage)}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-muji-dark rounded-full"
              />
            </div>
          </div>
        </Card>

        {/* Mini Graph */}
        {lastTenChecks.length > 0 && (
          <Card>
            <h3 className="text-sm font-medium text-muji-dark mb-3 flex items-center gap-2">
              <MujiIcon name="chart" size={16} />
              최근 체크
            </h3>
            <div className="flex items-end justify-between h-24 gap-1">
              {lastTenChecks.map((check, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: check.status === 'focused' ? '100%' : '40%' }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex-1 rounded-t ${
                    check.status === 'focused' ? 'bg-green-500' : 'bg-orange-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-muji-mid">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>집중</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muji-mid">
                <div className="w-3 h-3 bg-orange-400 rounded" />
                <span>딴짓</span>
              </div>
            </div>
          </Card>
        )}

        {/* Timer */}
        <Card>
          <div className="text-center">
            <p className="text-sm text-muji-mid mb-1">다음 알림까지</p>
            <p className="text-2xl font-mono text-muji-dark">
              {formatTime(nextCheckSeconds)}
            </p>
          </div>
        </Card>

        {/* End Button */}
        <Button onClick={endSession} variant="secondary" size="lg" fullWidth>
          종료하기
        </Button>
      </div>

      {/* Check Prompt Modal */}
      <CheckPrompt
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        checkNumber={currentSession.checks.length + 1}
      />
    </motion.div>
  )
}
