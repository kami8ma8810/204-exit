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

export interface RestartGameUseCase {
  execute: () => Promise<Result<GameStateDTO>>
}

const createRestartGameUseCase = (repository: IGameRepository): RestartGameUseCase => {
  return {
    execute: async () => {
      try {
        const currentGameData = await repository.getCurrentGame()
        
        if (!currentGameData) {
          const newGame = Game.create()
          await repository.save({
            ...newGame,
            currentPage: newGame.currentPage.deactivateAnomalies()
          })
          return createSuccessResult(gameToDTO(newGame))
        }
        
        const game = Game.load(
          currentGameData.id,
          currentGameData.currentStatusCode,
          currentGameData.history,
          currentGameData.attempts
        )
        
        const restartedGame = game.restart()
        
        await repository.save({
          ...restartedGame,
          currentPage: restartedGame.currentPage.deactivateAnomalies()
        })
        
        return createSuccessResult(gameToDTO(restartedGame))
      } catch (error) {
        return createErrorResult('Failed to restart game')
      }
    }
  }
}

export const RestartGameUseCase = {
  create: (repository: IGameRepository): RestartGameUseCase => {
    return createRestartGameUseCase(repository)
  }
}