export type AnomalyCategory = 'visual' | 'structural'

export type AnomalyTypeId = 
  | 'padding-difference'
  | 'margin-difference'
  | 'color-difference'
  | 'font-weight-difference'
  | 'border-radius-difference'
  | 'line-height-difference'
  | 'letter-spacing-difference'
  | 'opacity-difference'
  | 'element-order-swap'
  | 'text-character-difference'
  | 'icon-direction-flip'
  | 'shadow-direction-difference'
  | 'transform-rotation-difference'
  | 'border-position-difference'
  | 'z-index-order-difference'

export interface AnomalyTypeData {
  readonly id: AnomalyTypeId
  readonly category: AnomalyCategory
  readonly name: string
  readonly difficulty: number
  readonly description: string
}

export interface AnomalyType extends AnomalyTypeData {
  equals: (other: AnomalyType) => boolean
}

const anomalyTypeDefinitions: Record<AnomalyTypeId, Omit<AnomalyTypeData, 'id'>> = {
  'padding-difference': {
    category: 'visual',
    name: 'Padding Difference',
    difficulty: 3,
    description: '1pxのpadding差異'
  },
  'margin-difference': {
    category: 'visual',
    name: 'Margin Difference',
    difficulty: 3,
    description: '1pxのmargin差異'
  },
  'color-difference': {
    category: 'visual',
    name: 'Color Difference',
    difficulty: 5,
    description: '#FFFFFFと#FEFEFEの微妙な色の違い'
  },
  'font-weight-difference': {
    category: 'visual',
    name: 'Font Weight Difference',
    difficulty: 2,
    description: 'font-weight 400と500の違い'
  },
  'border-radius-difference': {
    category: 'visual',
    name: 'Border Radius Difference',
    difficulty: 3,
    description: 'border-radius 4pxと5pxの違い'
  },
  'line-height-difference': {
    category: 'visual',
    name: 'Line Height Difference',
    difficulty: 4,
    description: 'line-height 1.5と1.55の違い'
  },
  'letter-spacing-difference': {
    category: 'visual',
    name: 'Letter Spacing Difference',
    difficulty: 4,
    description: 'letter-spacing 0.01emの違い'
  },
  'opacity-difference': {
    category: 'visual',
    name: 'Opacity Difference',
    difficulty: 5,
    description: 'opacity 1.0と0.99の違い'
  },
  'element-order-swap': {
    category: 'structural',
    name: 'Element Order Swap',
    difficulty: 1,
    description: '要素の順序入れ替え'
  },
  'text-character-difference': {
    category: 'structural',
    name: 'Text Character Difference',
    difficulty: 2,
    description: 'テキストの1文字違い'
  },
  'icon-direction-flip': {
    category: 'structural',
    name: 'Icon Direction Flip',
    difficulty: 1,
    description: 'アイコンの向き反転'
  },
  'shadow-direction-difference': {
    category: 'structural',
    name: 'Shadow Direction Difference',
    difficulty: 2,
    description: 'box-shadowの向き違い'
  },
  'transform-rotation-difference': {
    category: 'structural',
    name: 'Transform Rotation Difference',
    difficulty: 4,
    description: '0.5度の微小回転'
  },
  'border-position-difference': {
    category: 'structural',
    name: 'Border Position Difference',
    difficulty: 2,
    description: 'borderの位置違い'
  },
  'z-index-order-difference': {
    category: 'structural',
    name: 'Z-Index Order Difference',
    difficulty: 3,
    description: 'z-indexの順序違い'
  }
}

const isValidAnomalyType = (id: string): id is AnomalyTypeId => {
  return id in anomalyTypeDefinitions
}

const createAnomalyType = (id: AnomalyTypeId): AnomalyType => {
  const definition = anomalyTypeDefinitions[id]
  
  const anomalyType: AnomalyType = {
    id,
    ...definition,
    equals: (other: AnomalyType) => id === other.id
  }
  
  return anomalyType
}

const getAllAnomalyTypes = (): AnomalyType[] => {
  return Object.keys(anomalyTypeDefinitions).map(id => 
    createAnomalyType(id as AnomalyTypeId)
  )
}

const filterByCategory = (types: AnomalyType[], category: AnomalyCategory): AnomalyType[] => {
  return types.filter(type => type.category === category)
}

const filterByDifficulty = (types: AnomalyType[], difficulty: number): AnomalyType[] => {
  return types.filter(type => type.difficulty === difficulty)
}

const filterByDifficultyRange = (types: AnomalyType[], min: number, max: number): AnomalyType[] => {
  return types.filter(type => type.difficulty >= min && type.difficulty <= max)
}

const selectRandom = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const AnomalyType = {
  create: (id: AnomalyTypeId): AnomalyType => {
    if (!isValidAnomalyType(id)) {
      throw new Error(`Invalid anomaly type: ${id}`)
    }
    return createAnomalyType(id)
  },
  
  getAllTypes: (): AnomalyType[] => getAllAnomalyTypes(),
  
  getByCategory: (category: AnomalyCategory): AnomalyType[] => {
    return filterByCategory(getAllAnomalyTypes(), category)
  },
  
  getByDifficulty: (difficulty: number): AnomalyType[] => {
    return filterByDifficulty(getAllAnomalyTypes(), difficulty)
  },
  
  getByDifficultyRange: (min: number, max: number): AnomalyType[] => {
    return filterByDifficultyRange(getAllAnomalyTypes(), min, max)
  },
  
  random: (): AnomalyType => {
    return selectRandom(getAllAnomalyTypes())
  },
  
  randomByCategory: (category: AnomalyCategory): AnomalyType => {
    const types = filterByCategory(getAllAnomalyTypes(), category)
    return selectRandom(types)
  }
}