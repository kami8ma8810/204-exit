import { Game, MoveResult } from '../entities/Game'

export interface GameSaveData {
  readonly id: string
  readonly currentStatusCode: number
  readonly history: MoveResult[]
  readonly attempts: number
  readonly createdAt: string
  readonly updatedAt: string
}

export interface IGameRepository {
  save: (game: Game) => Promise<void>
  load: (id: string) => Promise<GameSaveData | null>
  delete: (id: string) => Promise<void>
  getCurrentGame: () => Promise<GameSaveData | null>
  getAllGames: () => Promise<GameSaveData[]>
}