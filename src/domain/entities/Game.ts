import { StatusCode } from '../value-objects/StatusCode'
import { Page, PlayerChoice } from './Page'

export interface MoveResult {
  readonly isCorrect: boolean
  readonly from: StatusCode
  readonly to: StatusCode
  readonly choice: PlayerChoice
}

export interface GameStatistics {
  readonly totalMoves: number
  readonly correctMoves: number
  readonly incorrectMoves: number
  readonly accuracy: number
  readonly currentLevel: number
  readonly maxLevel: number
  readonly attempts: number
  readonly isCompleted: boolean
}

export interface Game {
  readonly id: string
  readonly currentPage: Page
  readonly history: MoveResult[]
  readonly isGameOver: boolean
  readonly isCleared: boolean
  readonly attempts: number
  makeChoice: (choice: PlayerChoice) => Game
  restart: () => Game
  getProgress: () => number
  getStatistics: () => GameStatistics
  getCurrentPageWithAnomaly: () => Page
  equals: (other: Game) => boolean
}

const generateId = (): string => {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const createGame = (
  id: string,
  currentPage: Page,
  history: MoveResult[],
  attempts: number
): Game => {
  const currentStatusCode = currentPage.statusCode
  const isGameOver = currentStatusCode.isGameOver()
  const isCleared = currentStatusCode.isGoal()
  
  const game: Game = {
    id,
    currentPage,
    history,
    isGameOver,
    isCleared,
    attempts,
    
    makeChoice: (choice: PlayerChoice) => {
      const isCorrect = currentPage.checkPlayerChoice(choice)
      
      let nextStatusCode: StatusCode
      if (!isCorrect) {
        nextStatusCode = StatusCode.gameOver()
      } else if (choice === 'forward') {
        nextStatusCode = currentStatusCode.advance()
      } else {
        nextStatusCode = currentStatusCode.goBack()
      }
      
      const nextPage = Page.generateWithRandomAnomaly(nextStatusCode)
      
      const moveResult: MoveResult = {
        isCorrect,
        from: currentStatusCode,
        to: nextStatusCode,
        choice
      }
      
      return createGame(id, nextPage, [...history, moveResult], attempts)
    },
    
    restart: () => {
      const initialPage = Page.generateWithRandomAnomaly(StatusCode.initial())
      return createGame(id, initialPage, [], attempts + 1)
    },
    
    getProgress: () => {
      const statusCodeValue = currentStatusCode.value
      const progressMap: Record<number, number> = {
        204: 0,
        203: 0.25,
        202: 0.5,
        201: 0.75,
        200: 1,
        404: 0
      }
      return progressMap[statusCodeValue] || 0
    },
    
    getStatistics: () => {
      const correctMoves = history.filter(m => m.isCorrect).length
      const incorrectMoves = history.filter(m => !m.isCorrect).length
      const totalMoves = history.length
      const accuracy = totalMoves > 0 ? correctMoves / totalMoves : 0
      
      const levelProgressMap: Record<number, number> = {
        204: 1,
        203: 2,
        202: 3,
        201: 4,
        200: 5,
        404: 0
      }
      
      const currentLevel = levelProgressMap[currentStatusCode.value] || 0
      const maxLevel = Math.max(
        ...history.map(m => levelProgressMap[m.to.value] || 0),
        currentLevel
      )
      
      return {
        totalMoves,
        correctMoves,
        incorrectMoves,
        accuracy,
        currentLevel,
        maxLevel,
        attempts,
        isCompleted: isCleared
      }
    },
    
    getCurrentPageWithAnomaly: () => {
      return currentPage.activateAnomalies()
    },
    
    equals: (other: Game) => id === other.id
  }
  
  return game
}

export const Game = {
  create: (): Game => {
    const id = generateId()
    const initialPage = Page.generateWithRandomAnomaly(StatusCode.initial())
    return createGame(id, initialPage, [], 1)
  },
  
  createWithId: (id: string): Game => {
    const initialPage = Page.generateWithRandomAnomaly(StatusCode.initial())
    return createGame(id, initialPage, [], 1)
  },
  
  load: (id: string, statusCodeValue: number, history: MoveResult[], attempts: number): Game => {
    const statusCode = StatusCode.create(statusCodeValue)
    const currentPage = Page.generateWithRandomAnomaly(statusCode)
    return createGame(id, currentPage, history, attempts)
  }
}