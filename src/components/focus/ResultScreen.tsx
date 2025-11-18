import { motion } from 'framer-motion'
import { useFocusStore } from '../../store/focusStore'
import Button from '../common/Button'
import Card from '../common/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function ResultScreen() {
  const { getStats, currentSession, showComparison } = useFocusStore()
  const stats = getStats()

  if (!stats || !currentSession) return null

  const pieData = [
    { name: '집중', value: stats.focusedMinutes },
    { name: '딴짓', value: stats.distractedMinutes },
  ]

  const COLORS = ['#3a3a3a', '#a89f91']

  // Timeline data for chart
  const timelineData = currentSession.checks.map((check, index) => ({
    interval: index + 1,
    value: check.status === 'focused' ? 1 : 0,
    status: check.status,
  }))

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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-muji-dark">세션 완료!</h1>
        </div>

        {/* Circular Progress */}
        <Card>
          <div className="text-center space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div>
              <p className="text-4xl font-bold text-muji-dark">{stats.focusPercentage}%</p>
              <p className="text-muji-mid">집중한 시간</p>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-muji-beige">
              <span className="text-muji-mid">총 시간</span>
              <span className="font-semibold text-muji-dark">{stats.totalMinutes}분</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-muji-beige">
              <span className="text-muji-mid">집중</span>
              <span className="font-semibold text-muji-focused">
                {stats.focusedMinutes}분 ({stats.focusPercentage}%)
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muji-mid">딴짓</span>
              <span className="font-semibold text-muji-distracted">
                {stats.distractedMinutes}분 ({100 - stats.focusPercentage}%)
              </span>
            </div>
          </div>
        </Card>

        {/* Timeline Chart */}
        <Card>
          <h3 className="text-sm font-medium text-muji-dark mb-3">시간대별 그래프</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={timelineData}>
              <XAxis
                dataKey="interval"
                tick={{ fontSize: 12, fill: '#6b6b6b' }}
                axisLine={{ stroke: '#e8e3db' }}
              />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white border-2 border-muji-beige rounded px-3 py-2 text-xs">
                        <p className="text-muji-dark">
                          체크 {data.interval}: {data.status === 'focused' ? '집중' : '딴짓'}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="stepAfter"
                dataKey="value"
                stroke="#3a3a3a"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={payload.status === 'focused' ? '#3a3a3a' : '#a89f91'}
                      stroke="white"
                      strokeWidth={2}
                    />
                  )
                }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-xs text-muji-mid mt-2">
            <span>시작</span>
            <span>중간</span>
            <span>끝</span>
          </div>
        </Card>

        {/* Next Button */}
        <Button onClick={showComparison} variant="primary" size="lg" fullWidth>
          다음
        </Button>
      </div>
    </motion.div>
  )
}
