import { AnomalyType, AnomalyTypeId, AnomalyCategory } from '../value-objects/AnomalyType'

export interface AnomalyConfig {
  targetElement?: string
  originalValue?: string
  anomalyValue?: string
  originalText?: string
  anomalyText?: string
  swapIndices?: number[]
  [key: string]: unknown
}

export interface HTMLModification {
  type: 'swap' | 'text' | 'attribute'
  target: string
  indices?: number[]
  newText?: string
  attribute?: string
  value?: string
}

export interface Anomaly {
  readonly id: string
  readonly type: AnomalyType
  readonly config: AnomalyConfig
  readonly isActive: boolean
  activate: () => Anomaly
  deactivate: () => Anomaly
  generateCSSRule: () => string
  generateHTMLModification: () => HTMLModification | null
  equals: (other: Anomaly) => boolean
}

const generateId = (): string => {
  return `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const generateCSSProperty = (typeId: AnomalyTypeId): string => {
  const cssPropertyMap: Partial<Record<AnomalyTypeId, string>> = {
    'padding-difference': 'padding',
    'margin-difference': 'margin',
    'color-difference': 'color',
    'font-weight-difference': 'font-weight',
    'border-radius-difference': 'border-radius',
    'line-height-difference': 'line-height',
    'letter-spacing-difference': 'letter-spacing',
    'opacity-difference': 'opacity',
    'shadow-direction-difference': 'box-shadow',
    'transform-rotation-difference': 'transform',
    'border-position-difference': 'border',
    'z-index-order-difference': 'z-index'
  }
  
  return cssPropertyMap[typeId] || ''
}

const generateDefaultConfig = (typeId: AnomalyTypeId): AnomalyConfig => {
  const defaultConfigs: Partial<Record<AnomalyTypeId, AnomalyConfig>> = {
    'padding-difference': {
      targetElement: '.content',
      originalValue: '20px',
      anomalyValue: '21px'
    },
    'margin-difference': {
      targetElement: '.container',
      originalValue: '15px',
      anomalyValue: '16px'
    },
    'color-difference': {
      targetElement: '.text',
      originalValue: '#FFFFFF',
      anomalyValue: '#FEFEFE'
    },
    'font-weight-difference': {
      targetElement: '.heading',
      originalValue: '400',
      anomalyValue: '500'
    },
    'border-radius-difference': {
      targetElement: '.card',
      originalValue: '4px',
      anomalyValue: '5px'
    },
    'line-height-difference': {
      targetElement: '.paragraph',
      originalValue: '1.5',
      anomalyValue: '1.55'
    },
    'letter-spacing-difference': {
      targetElement: '.title',
      originalValue: '0',
      anomalyValue: '0.01em'
    },
    'opacity-difference': {
      targetElement: '.overlay',
      originalValue: '1',
      anomalyValue: '0.99'
    },
    'element-order-swap': {
      targetElement: '.list',
      swapIndices: [0, 1]
    },
    'text-character-difference': {
      targetElement: '.label',
      originalText: 'Continue',
      anomalyText: 'Continua'
    },
    'icon-direction-flip': {
      targetElement: '.icon',
      originalValue: 'rotate(0deg)',
      anomalyValue: 'rotate(180deg)'
    },
    'shadow-direction-difference': {
      targetElement: '.box',
      originalValue: '2px 2px 4px rgba(0,0,0,0.1)',
      anomalyValue: '-2px 2px 4px rgba(0,0,0,0.1)'
    },
    'transform-rotation-difference': {
      targetElement: '.element',
      originalValue: 'rotate(0deg)',
      anomalyValue: 'rotate(0.5deg)'
    },
    'border-position-difference': {
      targetElement: '.frame',
      originalValue: 'border-top',
      anomalyValue: 'border-bottom'
    },
    'z-index-order-difference': {
      targetElement: '.layer',
      originalValue: '1',
      anomalyValue: '2'
    }
  }
  
  return defaultConfigs[typeId] || {}
}

const createAnomaly = (
  type: AnomalyType,
  config: AnomalyConfig,
  id?: string,
  isActive: boolean = false
): Anomaly => {
  const anomalyId = id || generateId()
  
  const anomaly: Anomaly = {
    id: anomalyId,
    type,
    config,
    isActive,
    
    activate: () => createAnomaly(type, config, anomalyId, true),
    
    deactivate: () => createAnomaly(type, config, anomalyId, false),
    
    generateCSSRule: () => {
      if (!isActive || !config.targetElement || !config.anomalyValue) {
        return ''
      }
      
      const property = generateCSSProperty(type.id)
      if (!property) return ''
      
      return `${config.targetElement} { ${property}: ${config.anomalyValue} !important; }`
    },
    
    generateHTMLModification: () => {
      if (!isActive || !config.targetElement) {
        return null
      }
      
      if (type.id === 'element-order-swap' && config.swapIndices) {
        return {
          type: 'swap',
          target: config.targetElement,
          indices: config.swapIndices
        }
      }
      
      if (type.id === 'text-character-difference' && config.anomalyText) {
        return {
          type: 'text',
          target: config.targetElement,
          newText: config.anomalyText
        }
      }
      
      if (type.id === 'icon-direction-flip' && config.anomalyValue) {
        return {
          type: 'attribute',
          target: config.targetElement,
          attribute: 'style',
          value: `transform: ${config.anomalyValue}`
        }
      }
      
      return null
    },
    
    equals: (other: Anomaly) => anomalyId === other.id
  }
  
  return anomaly
}

export const Anomaly = {
  create: (type: AnomalyType, config: AnomalyConfig): Anomaly => {
    return createAnomaly(type, config)
  },
  
  random: (): Anomaly => {
    const type = AnomalyType.random()
    const config = generateDefaultConfig(type.id)
    return createAnomaly(type, config)
  },
  
  randomByCategory: (category: AnomalyCategory): Anomaly => {
    const type = AnomalyType.randomByCategory(category)
    const config = generateDefaultConfig(type.id)
    return createAnomaly(type, config)
  },
  
  randomByDifficulty: (difficulty: number): Anomaly => {
    const types = AnomalyType.getByDifficulty(difficulty)
    if (types.length === 0) {
      return Anomaly.random()
    }
    const type = types[Math.floor(Math.random() * types.length)]
    const config = generateDefaultConfig(type.id)
    return createAnomaly(type, config)
  },
  
  randomByDifficultyRange: (min: number, max: number): Anomaly => {
    const types = AnomalyType.getByDifficultyRange(min, max)
    if (types.length === 0) {
      return Anomaly.random()
    }
    const type = types[Math.floor(Math.random() * types.length)]
    const config = generateDefaultConfig(type.id)
    return createAnomaly(type, config)
  }
}