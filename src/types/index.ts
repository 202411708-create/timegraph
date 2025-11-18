export interface FocusCheck {
  timestamp: number
  status: 'focused' | 'distracted'
  intervalNumber: number
}

export interface FocusSession {
  id: string
  startTime: number
  endTime: number | null
  expectedFocusRate: number
  intervalMinutes: number
  checks: FocusCheck[]
  isActive: boolean
  showComparison?: boolean
}

export interface FocusStats {
  totalMinutes: number
  focusedMinutes: number
  distractedMinutes: number
  focusPercentage: number
  expectedPercentage: number
  difference: number
}

export interface WasteTimeBlock {
  startTime: number
  endTime: number
  duration: number
  intervalCount: number
}
