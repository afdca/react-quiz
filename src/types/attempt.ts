export interface IAttempt {
  selectedChoicesMatrix: Record<number, number[]>
  flaggedQuestions: number[]
  startTime: number
  allottedTime: number
  remainingTime: number
}
