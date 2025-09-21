import { StatusCodeValue } from './StatusCode'

export type PageLevelValue = 0 | 1 | 2 | 3 | 4 | 5

export interface DifficultyRange {
  readonly min: number
  readonly max: number
}

export interface PageLevel {
  readonly value: PageLevelValue
  readonly displayName: string
  readonly anomalyProbability: number
  readonly difficultyRange: DifficultyRange
  isFinal: () => boolean
  isGameOver: () => boolean
  equals: (other: PageLevel) => boolean
}

const statusCodeToLevelMap: Record<StatusCodeValue, PageLevelValue> = {
  204: 1,
  203: 2,
  202: 3,
  201: 4,
  200: 5,
  404: 0
}

const levelProperties: Record<PageLevelValue, {
  displayName: string
  anomalyProbability: number
  difficultyRange: DifficultyRange
}> = {
  0: {
    displayName: 'Game Over',
    anomalyProbability: 0,
    difficultyRange: { min: 0, max: 0 }
  },
  1: {
    displayName: 'Level 1',
    anomalyProbability: 0.3,
    difficultyRange: { min: 1, max: 2 }
  },
  2: {
    displayName: 'Level 2',
    anomalyProbability: 0.4,
    difficultyRange: { min: 1, max: 3 }
  },
  3: {
    displayName: 'Level 3',
    anomalyProbability: 0.5,
    difficultyRange: { min: 2, max: 4 }
  },
  4: {
    displayName: 'Level 4',
    anomalyProbability: 0.6,
    difficultyRange: { min: 3, max: 5 }
  },
  5: {
    displayName: 'Final Level',
    anomalyProbability: 0.7,
    difficultyRange: { min: 4, max: 5 }
  }
}

const isValidPageLevel = (value: number): value is PageLevelValue => {
  return value >= 0 && value <= 5
}

const createPageLevel = (value: PageLevelValue): PageLevel => {
  const properties = levelProperties[value]
  
  const pageLevel: PageLevel = {
    value,
    displayName: properties.displayName,
    anomalyProbability: properties.anomalyProbability,
    difficultyRange: properties.difficultyRange,
    
    isFinal: () => value === 5,
    isGameOver: () => value === 0,
    equals: (other: PageLevel) => value === other.value
  }
  
  return pageLevel
}

export const PageLevel = {
  fromStatusCode: (statusCode: StatusCodeValue): PageLevel => {
    const levelValue = statusCodeToLevelMap[statusCode]
    return createPageLevel(levelValue)
  },
  
  create: (value: number): PageLevel => {
    if (!isValidPageLevel(value)) {
      throw new Error(`Invalid page level: ${value}`)
    }
    return createPageLevel(value)
  },
  
  initial: (): PageLevel => createPageLevel(1),
  final: (): PageLevel => createPageLevel(5),
  gameOver: (): PageLevel => createPageLevel(0)
}