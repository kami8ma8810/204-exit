import { Game } from '@domain/entities/Game'
import { IGameRepository } from '@domain/repositories/IGameRepository'
import { GameStateDTO } from '../dto/GameStateDTO'

export type Result<T> = 
  | { isSuccess: true; value: T }
  | { isSuccess: false; error: string }

const createSuccessResult = <T>(value: T): Result<T> => ({
  isSuccess: true,
  value
})

const createErrorResult = <T>(error: string): Result<T> => ({
  isSuccess: false,
  error
})

const gameToDTO = (game: Game): GameStateDTO => {
  const statistics = game.getStatistics()
  const pageWithAnomaly = game.getCurrentPageWithAnomaly()
  
  return {
    id: game.id,
    currentStatusCode: game.currentPage.statusCode.value,
    currentLevel: game.currentPage.level.value,
    hasAnomaly: pageWithAnomaly.hasAnomaly,
    activeAnomalies: pageWithAnomaly.getActiveAnomalies().map(anomaly => ({
      id: anomaly.id,
      typeId: anomaly.type.id,
      isActive: anomaly.isActive
    })),
    progress: game.getProgress(),
    isGameOver: game.isGameOver,
    isCleared: game.isCleared,
    attempts: game.attempts,
    statistics: {
      totalMoves: statistics.totalMoves,
      correctMoves: statistics.correctMoves,
      accuracy: statistics.accuracy
    }
  }
}

export interface GoBackPageUseCase {
  execute: () => Promise<Result<GameStateDTO>>
}

const createGoBackPageUseCase = (repository: IGameRepository): GoBackPageUseCase => {
  return {
    execute: async () => {
      try {
        const currentGameData = await repository.getCurrentGame()
        
        if (!currentGameData) {
          return createErrorResult('No active game found')
        }
        
        const game = Game.load(
          currentGameData.id,
          currentGameData.currentStatusCode,
          currentGameData.history,
          currentGameData.attempts
        )
        
        const nextGame = game.makeChoice('back')
        
        await repository.save({
          ...nextGame,
          currentPage: nextGame.currentPage.deactivateAnomalies()
        })
        
        return createSuccessResult(gameToDTO(nextGame))
      } catch (error) {
        return createErrorResult('Failed to go back')
      }
    }
  }
}

export const GoBackPageUseCase = {
  create: (repository: IGameRepository): GoBackPageUseCase => {
    return createGoBackPageUseCase(repository)
  }
}