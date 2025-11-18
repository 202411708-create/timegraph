import { motion, AnimatePresence } from 'framer-motion'
import { useFocusStore } from '../../store/focusStore'
import Button from '../common/Button'
import MujiIcon from '../common/MujiIcon'

interface CheckPromptProps {
  isOpen: boolean
  onClose: () => void
  checkNumber: number
}

export default function CheckPrompt({ isOpen, onClose, checkNumber }: CheckPromptProps) {
  const { addCheck } = useFocusStore()

  const handleChoice = (status: 'focused' | 'distracted') => {
    addCheck(status)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="text-center space-y-6">
              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="flex justify-center"
              >
                <MujiIcon name="bell" size={48} className="text-muji-dark" />
              </motion.div>

              {/* Question */}
              <div>
                <h2 className="text-2xl font-bold text-muji-dark">지금 집중하고 있나요?</h2>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleChoice('focused')}
                  variant="success"
                  size="lg"
                  fullWidth
                  className="flex items-center justify-center gap-3"
                >
                  <MujiIcon name="check-circle" size={24} />
                  <span>집중함</span>
                </Button>

                <Button
                  onClick={() => handleChoice('distracted')}
                  variant="warning"
                  size="lg"
                  fullWidth
                  className="flex items-center justify-center gap-3"
                >
                  <MujiIcon name="x-circle" size={24} />
                  <span>딴짓함</span>
                </Button>
              </div>

              {/* Check number */}
              <p className="text-sm text-muji-mid">체크 {checkNumber}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
