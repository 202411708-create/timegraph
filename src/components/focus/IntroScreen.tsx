import { motion } from 'framer-motion'
import { useState } from 'react'
import { useFocusStore } from '../../store/focusStore'
import Button from '../common/Button'
import Card from '../common/Card'
import MujiIcon from '../common/MujiIcon'

export default function IntroScreen() {
  const [expectedFocus, setExpectedFocus] = useState(70)
  const { startSession } = useFocusStore()

  const handleStart = () => {
    startSession(expectedFocus)
  }

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
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center"
          >
            <MujiIcon name="eye" size={64} className="text-muji-dark" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-muji-dark">하루 돌아보기</h1>
            <h2 className="text-xl text-muji-mid mt-1">집중도 추적기</h2>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-muji-dark mb-2 flex items-center gap-2">
              <MujiIcon name="target" size={20} />
              자기점검이란?
            </h3>
            <ul className="space-y-1 text-sm text-muji-mid">
              <li>• 스스로 기록하고 비교</li>
              <li>• 외부 기준 없이 자기 평가</li>
              <li>• 메타인지 향상</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-muji-dark mb-2 flex items-center gap-2">
              <MujiIcon name="clock" size={20} />
              어떻게 사용하나요?
            </h3>
            <ol className="space-y-1 text-sm text-muji-mid">
              <li>1. 2분마다 알림이 울려요</li>
              <li>2. 집중했는지 선택해요</li>
              <li>3. 세션 종료 후 결과를 봐요</li>
            </ol>
          </Card>

          {/* Slider */}
          <Card>
            <label className="block text-sm font-medium text-muji-dark mb-3">
              내가 예상하는 집중도: {expectedFocus}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={expectedFocus}
              onChange={(e) => setExpectedFocus(Number(e.target.value))}
              className="w-full h-2 bg-muji-beige rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3a3a3a 0%, #3a3a3a ${expectedFocus}%, #e8e3db ${expectedFocus}%, #e8e3db 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-muji-mid mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </Card>
        </div>

        {/* Start Button */}
        <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
          시작하기
        </Button>
      </div>
    </motion.div>
  )
}
