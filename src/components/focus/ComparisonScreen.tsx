import { motion } from 'framer-motion'
import { useFocusStore } from '../../store/focusStore'
import Button from '../common/Button'
import Card from '../common/Card'
import MujiIcon from '../common/MujiIcon'

export default function ComparisonScreen() {
  const { getStats, currentSession, getInsight, hideComparison, reset } = useFocusStore()
  const stats = getStats()
  const insight = getInsight()

  if (!stats || !currentSession) return null

  // Parse insight to get icon and text
  const [insightIcon, insightText] = insight ? insight.split('|') : ['eye', '']

  const getDifferenceMessage = () => {
    const diff = stats.difference
    if (Math.abs(diff) < 5) {
      return '예상과 거의 비슷해요'
    } else if (diff > 0) {
      return '예상보다 조금 낮아요'
    } else {
      return '예상보다 더 잘했어요!'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen flex items-center justify-center p-4 py-8"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-muji-dark">예상 vs 실제</h1>
        </div>

        {/* Comparison Bars */}
        <Card>
          <div className="space-y-4">
            {/* Expected */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muji-mid">예상</span>
                <span className="font-semibold text-muji-dark">{stats.expectedPercentage}%</span>
              </div>
              <div className="w-full bg-muji-beige rounded-full h-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.expectedPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-muji-mid rounded-full flex items-center justify-end pr-2"
                >
                  {stats.expectedPercentage > 15 && (
                    <span className="text-white text-xs font-semibold">
                      {stats.expectedPercentage}%
                    </span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Actual */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muji-mid">실제</span>
                <span className="font-semibold text-muji-dark">{stats.focusPercentage}%</span>
              </div>
              <div className="w-full bg-muji-beige rounded-full h-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.focusPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-muji-dark rounded-full flex items-center justify-end pr-2"
                >
                  {stats.focusPercentage > 15 && (
                    <span className="text-white text-xs font-semibold">
                      {stats.focusPercentage}%
                    </span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Difference */}
            <div className="pt-4 border-t border-muji-beige">
              <p className="text-center">
                <span className="text-sm text-muji-mid">차이: </span>
                <span
                  className={`font-semibold ${
                    stats.difference > 0 ? 'text-muji-distracted' : 'text-muji-focused'
                  }`}
                >
                  {stats.difference > 0 ? '-' : '+'}
                  {Math.abs(stats.difference)}%
                </span>
              </p>
              <p className="text-center text-muji-mid mt-1">{getDifferenceMessage()}</p>
            </div>
          </div>
        </Card>

        {/* Timeline Graph */}
        <Card>
          <h3 className="text-sm font-medium text-muji-dark mb-3 flex items-center gap-2">
            <MujiIcon name="chart" size={16} />
            회차별 집중도
          </h3>
          <div className="flex items-end justify-between h-32 gap-1">
            {currentSession.checks.map((check, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: check.status === 'focused' ? '100%' : '40%' }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                className={`flex-1 rounded-t ${
                  check.status === 'focused' ? 'bg-muji-focused' : 'bg-muji-distracted'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-muji-mid">
              <div className="w-3 h-3 bg-muji-focused rounded" />
              <span>집중</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muji-mid">
              <div className="w-3 h-3 bg-muji-distracted rounded" />
              <span>딴짓</span>
            </div>
          </div>
        </Card>

        {/* Insight */}
        {insightText && (
          <Card>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-3 p-4 bg-muji-bg rounded-lg"
            >
              <MujiIcon
                name={insightIcon as 'eye' | 'eye-off' | 'clock' | 'chart' | 'bell' | 'target' | 'check-circle' | 'x-circle'}
                size={24}
                className="text-muji-dark flex-shrink-0"
              />
              <p className="text-muji-dark">{insightText}</p>
            </motion.div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={reset} variant="primary" size="lg" fullWidth>
            새로 시작하기
          </Button>
          <Button onClick={hideComparison} variant="secondary" size="md" fullWidth>
            이전
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
