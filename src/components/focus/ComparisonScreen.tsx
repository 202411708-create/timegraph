import { motion } from 'framer-motion'
import { useFocusStore } from '../../store/focusStore'
import Button from '../common/Button'
import Card from '../common/Card'
import MujiIcon from '../common/MujiIcon'

export default function ComparisonScreen() {
  const { getStats, getWasteTimeBlocks, getInsight, reset } = useFocusStore()
  const stats = getStats()
  const wasteBlocks = getWasteTimeBlocks()
  const insight = getInsight()

  if (!stats) return null

  const handleExport = () => {
    const data = {
      stats,
      wasteBlocks,
      insight,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focus-tracker-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

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
                    stats.difference > 0 ? 'text-orange-500' : 'text-green-600'
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

        {/* Waste Time Blocks */}
        {wasteBlocks.length > 0 && (
          <Card>
            <h3 className="font-semibold text-muji-dark mb-4">낭비 시간 TOP 3</h3>
            <div className="space-y-3">
              {wasteBlocks.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muji-bg rounded-lg"
                >
                  <span className="text-2xl font-bold text-muji-beige">{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muji-dark">
                      {formatTime(block.startTime)} ~ {formatTime(block.endTime)}
                    </p>
                    <p className="text-xs text-muji-mid mt-1">
                      {block.duration}분 동안 {block.intervalCount}회 연속
                    </p>
                  </div>
                  <MujiIcon name="x-circle" size={20} className="text-orange-400 mt-1" />
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Insight */}
        {insight && (
          <Card>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center p-4 bg-muji-bg rounded-lg"
            >
              <p className="text-muji-dark">{insight}</p>
            </motion.div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={reset} variant="primary" size="lg" fullWidth>
            새로 시작하기
          </Button>
          <Button onClick={handleExport} variant="secondary" size="md" fullWidth>
            결과 내보내기 (JSON)
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
