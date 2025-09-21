import { StatusCodeValue } from '@domain/value-objects/StatusCode'
import { AnomalyTypeId } from '@domain/value-objects/AnomalyType'

export interface GameStateDTO {
  readonly id: string
  readonly currentStatusCode: StatusCodeValue
  readonly currentLevel: number
  readonly hasAnomaly: boolean
  readonly activeAnomalies: Array<{
    id: string
    typeId: AnomalyTypeId
    isActive: boolean
  }>
  readonly progress: number
  readonly isGameOver: boolean
  readonly isCleared: boolean
  readonly attempts: number
  readonly statistics: {
    totalMoves: number
    correctMoves: number
    accuracy: number
  }
}