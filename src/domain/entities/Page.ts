import { StatusCode } from '../value-objects/StatusCode'
import { PageLevel } from '../value-objects/PageLevel'
import { Anomaly } from './Anomaly'

export type PlayerChoice = 'forward' | 'back'

export interface Page {
  readonly id: string
  readonly statusCode: StatusCode
  readonly level: PageLevel
  readonly anomalies: Anomaly[]
  readonly hasAnomaly: boolean
  shouldHaveAnomaly: () => boolean
  addAnomaly: (anomaly: Anomaly) => Page
  removeAnomaly: (anomalyId: string) => Page
  activateAnomalies: () => Page
  deactivateAnomalies: () => Page
  getActiveAnomalies: () => Anomaly[]
  generateCSS: () => string
  generateHTMLModifications: () => ReturnType<Anomaly['generateHTMLModification']>[]
  checkPlayerChoice: (choice: PlayerChoice) => boolean
  equals: (other: Page) => boolean
}

const generateId = (): string => {
  return `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const createPage = (
  statusCode: StatusCode,
  anomalies: Anomaly[],
  id?: string
): Page => {
  const pageId = id || generateId()
  const level = PageLevel.fromStatusCode(statusCode.value)
  const hasAnomaly = anomalies.length > 0
  
  const page: Page = {
    id: pageId,
    statusCode,
    level,
    anomalies,
    hasAnomaly,
    
    shouldHaveAnomaly: () => {
      return Math.random() < level.anomalyProbability
    },
    
    addAnomaly: (anomaly: Anomaly) => {
      return createPage(statusCode, [...anomalies, anomaly], pageId)
    },
    
    removeAnomaly: (anomalyId: string) => {
      return createPage(
        statusCode,
        anomalies.filter(a => a.id !== anomalyId),
        pageId
      )
    },
    
    activateAnomalies: () => {
      return createPage(
        statusCode,
        anomalies.map(a => a.activate()),
        pageId
      )
    },
    
    deactivateAnomalies: () => {
      return createPage(
        statusCode,
        anomalies.map(a => a.deactivate()),
        pageId
      )
    },
    
    getActiveAnomalies: () => {
      return anomalies.filter(a => a.isActive)
    },
    
    generateCSS: () => {
      return anomalies
        .filter(a => a.isActive)
        .map(a => a.generateCSSRule())
        .filter(css => css !== '')
        .join('\n')
    },
    
    generateHTMLModifications: () => {
      return anomalies
        .filter(a => a.isActive)
        .map(a => a.generateHTMLModification())
        .filter(mod => mod !== null)
    },
    
    checkPlayerChoice: (choice: PlayerChoice) => {
      if (hasAnomaly) {
        return choice === 'back'
      } else {
        return choice === 'forward'
      }
    },
    
    equals: (other: Page) => pageId === other.id
  }
  
  return page
}

const generateRandomAnomalies = (level: PageLevel): Anomaly[] => {
  const { min, max } = level.difficultyRange
  
  const numberOfAnomalies = Math.random() < 0.7 ? 1 : 2
  const anomalies: Anomaly[] = []
  
  for (let i = 0; i < numberOfAnomalies; i++) {
    const anomaly = Anomaly.randomByDifficultyRange(min, max)
    anomalies.push(anomaly)
  }
  
  return anomalies
}

export const Page = {
  create: (statusCode: StatusCode, anomalies: Anomaly[] = []): Page => {
    return createPage(statusCode, anomalies)
  },
  
  generateWithRandomAnomaly: (statusCode: StatusCode): Page => {
    const page = createPage(statusCode, [])
    
    if (page.shouldHaveAnomaly()) {
      const anomalies = generateRandomAnomalies(page.level)
      return createPage(statusCode, anomalies)
    }
    
    return page
  },
  
  initial: (): Page => {
    return createPage(StatusCode.initial(), [])
  }
}