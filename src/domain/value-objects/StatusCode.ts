export type StatusCodeValue = 200 | 201 | 202 | 203 | 204 | 404

export type StatusCodeLabel = 
  | 'OK' 
  | 'Created' 
  | 'Accepted' 
  | 'Non-Authoritative Information' 
  | 'No Content' 
  | 'Not Found'

export interface StatusCode {
  readonly value: StatusCodeValue
  readonly label: StatusCodeLabel
  advance: () => StatusCode
  goBack: () => StatusCode
  isStart: () => boolean
  isGoal: () => boolean
  isGameOver: () => boolean
  equals: (other: StatusCode) => boolean
}

const statusCodeMap: Record<StatusCodeValue, StatusCodeLabel> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  404: 'Not Found'
}

const progressionOrder: StatusCodeValue[] = [204, 203, 202, 201, 200]

const isValidStatusCode = (value: number): value is StatusCodeValue => {
  return value in statusCodeMap
}

const findNextCode = (current: StatusCodeValue): StatusCodeValue => {
  const currentIndex = progressionOrder.indexOf(current)
  if (currentIndex === -1 || currentIndex === progressionOrder.length - 1) {
    return current
  }
  return progressionOrder[currentIndex + 1]
}

const findPreviousCode = (current: StatusCodeValue): StatusCodeValue => {
  const currentIndex = progressionOrder.indexOf(current)
  if (currentIndex <= 0) {
    return current
  }
  return progressionOrder[currentIndex - 1]
}

const createStatusCode = (value: StatusCodeValue): StatusCode => {
  const statusCode: StatusCode = {
    value,
    label: statusCodeMap[value],
    
    advance: () => {
      if (value === 404 || value === 200) {
        return statusCode
      }
      return createStatusCode(findNextCode(value))
    },
    
    goBack: () => {
      if (value === 404 || value === 204) {
        return statusCode
      }
      return createStatusCode(findPreviousCode(value))
    },
    
    isStart: () => value === 204,
    isGoal: () => value === 200,
    isGameOver: () => value === 404,
    
    equals: (other: StatusCode) => value === other.value
  }
  
  return statusCode
}

export const StatusCode = {
  create: (value: number): StatusCode => {
    if (!isValidStatusCode(value)) {
      throw new Error(`Invalid status code: ${value}`)
    }
    return createStatusCode(value)
  },
  
  initial: (): StatusCode => createStatusCode(204),
  goal: (): StatusCode => createStatusCode(200),
  gameOver: (): StatusCode => createStatusCode(404)
}