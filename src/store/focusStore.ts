import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FocusSession, FocusCheck, FocusStats, WasteTimeBlock } from '../types'

interface AppStore {
  currentSession: FocusSession | null
  startSession: (expectedFocusRate: number) => void
  addCheck: (status: 'focused' | 'distracted') => void
  endSession: () => void
  getStats: () => FocusStats | null
  getWasteTimeBlocks: () => WasteTimeBlock[]
  getInsight: () => string
  showComparison: () => void
  reset: () => void
}

export const useFocusStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentSession: null,

      startSession: (expectedFocusRate: number) => {
        const session: FocusSession = {
          id: `session-${Date.now()}`,
          startTime: Date.now(),
          endTime: null,
          expectedFocusRate,
          intervalMinutes: 5,
          checks: [],
          isActive: true,
          showComparison: false,
        }
        set({ currentSession: session })
      },

      addCheck: (status: 'focused' | 'distracted') => {
        const { currentSession } = get()
        if (!currentSession) return

        const check: FocusCheck = {
          timestamp: Date.now(),
          status,
          intervalNumber: currentSession.checks.length + 1,
        }

        set({
          currentSession: {
            ...currentSession,
            checks: [...currentSession.checks, check],
          },
        })
      },

      endSession: () => {
        const { currentSession } = get()
        if (!currentSession) return

        set({
          currentSession: {
            ...currentSession,
            endTime: Date.now(),
            isActive: false,
          },
        })
      },

      getStats: (): FocusStats | null => {
        const { currentSession } = get()
        if (!currentSession || currentSession.checks.length === 0) return null

        const totalMinutes = currentSession.checks.length * currentSession.intervalMinutes
        const focusedChecks = currentSession.checks.filter((c) => c.status === 'focused').length
        const distractedChecks = currentSession.checks.filter((c) => c.status === 'distracted').length

        const focusedMinutes = focusedChecks * currentSession.intervalMinutes
        const distractedMinutes = distractedChecks * currentSession.intervalMinutes

        const focusPercentage = Math.round((focusedChecks / currentSession.checks.length) * 100)
        const expectedPercentage = currentSession.expectedFocusRate
        const difference = expectedPercentage - focusPercentage

        return {
          totalMinutes,
          focusedMinutes,
          distractedMinutes,
          focusPercentage,
          expectedPercentage,
          difference,
        }
      },

      getWasteTimeBlocks: (): WasteTimeBlock[] => {
        const { currentSession } = get()
        if (!currentSession) return []

        const blocks: WasteTimeBlock[] = []
        let currentBlock: WasteTimeBlock | null = null

        currentSession.checks.forEach((check) => {
          if (check.status === 'distracted') {
            if (!currentBlock) {
              currentBlock = {
                startTime: check.timestamp,
                endTime: check.timestamp,
                duration: currentSession.intervalMinutes,
                intervalCount: 1,
              }
            } else {
              currentBlock.endTime = check.timestamp
              currentBlock.duration += currentSession.intervalMinutes
              currentBlock.intervalCount += 1
            }
          } else {
            if (currentBlock) {
              blocks.push(currentBlock)
              currentBlock = null
            }
          }
        })

        if (currentBlock) blocks.push(currentBlock)

        return blocks.sort((a, b) => b.duration - a.duration).slice(0, 3)
      },

      getInsight: (): string => {
        const { currentSession } = get()
        const stats = get().getStats()
        if (!stats || !currentSession) return ''

        const checks = currentSession.checks
        const morningChecks = checks.filter((c) => {
          const hour = new Date(c.timestamp).getHours()
          return hour < 12
        })
        const afternoonChecks = checks.filter((c) => {
          const hour = new Date(c.timestamp).getHours()
          return hour >= 12
        })

        if (morningChecks.length > 0 && afternoonChecks.length > 0) {
          const morningFocus =
            morningChecks.filter((c) => c.status === 'focused').length / morningChecks.length
          const afternoonFocus =
            afternoonChecks.filter((c) => c.status === 'focused').length / afternoonChecks.length

          if (afternoonFocus < morningFocus - 0.2) {
            return '💡 오후 시간대에 집중력이 떨어지는 경향이 있어요'
          }
        }

        if (stats.focusPercentage >= 70) {
          return '🎉 훌륭해요! 높은 집중도를 유지했어요'
        }

        if (stats.difference > 20) {
          return '😅 예상보다 집중이 어려웠나봐요. 괜찮아요!'
        }

        if (stats.difference < -10) {
          return '🌟 예상보다 더 잘했어요! 계속 이렇게 해보세요'
        }

        return '😊 꾸준히 연습하면 더 나아질 거예요'
      },

      showComparison: () => {
        const { currentSession } = get()
        if (!currentSession) return

        set({
          currentSession: {
            ...currentSession,
            showComparison: true,
          },
        })
      },

      reset: () => {
        set({ currentSession: null })
      },
    }),
    {
      name: 'focus-tracker-storage',
    }
  )
)
