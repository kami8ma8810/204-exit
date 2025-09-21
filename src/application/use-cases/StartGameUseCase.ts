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

export interface StartGameUseCase {
  execute: () => Promise<Result<GameStateDTO>>
  executeWithContinue: () => Promise<Result<GameStateDTO>>
}

const createStartGameUseCase = (repository: IGameRepository): StartGameUseCase => {
  const startNewGame = async (): Promise<Game> => {
    const game = Game.create()
    
    await repository.save({
      ...game,
      currentPage: game.currentPage.deactivateAnomalies()
    })
    
    return game
  }

  const continueOrStartNewGame = async (): Promise<Game> => {
    const existingGame = await repository.getCurrentGame()
    
    if (existingGame) {
      return Game.load(
        existingGame.id,
        existingGame.currentStatusCode,
        existingGame.history,
        existingGame.attempts
      )
    }
    
    return startNewGame()
  }

  return {
    execute: async () => {
      try {
        const existingGame = await repository.getCurrentGame()
        if (existingGame) {
          await repository.delete(existingGame.id)
        }
        
        const game = await startNewGame()
        return createSuccessResult(gameToDTO(game))
      } catch (error) {
        return createErrorResult('Failed to start new game')
      }
    },

    executeWithContinue: async () => {
      try {
        const game = await continueOrStartNewGame()
        return createSuccessResult(gameToDTO(game))
      } catch (error) {
        return createErrorResult('Failed to load or start game')
      }
    }
  }
}

export const StartGameUseCase = {
  create: (repository: IGameRepository): StartGameUseCase => {
    return createStartGameUseCase(repository)
  }
}