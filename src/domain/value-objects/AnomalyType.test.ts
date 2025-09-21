import { describe, it, expect } from 'vitest'
import { AnomalyType, AnomalyCategory } from './AnomalyType'

describe('AnomalyType', () => {
  describe('create', () => {
    it('視覚的異変タイプを作成できる', () => {
      const anomaly = AnomalyType.create('padding-difference')
      expect(anomaly.id).toBe('padding-difference')
      expect(anomaly.category).toBe('visual')
      expect(anomaly.name).toBe('Padding Difference')
      expect(anomaly.difficulty).toBeGreaterThanOrEqual(1)
      expect(anomaly.difficulty).toBeLessThanOrEqual(5)
    })

    it('構造的異変タイプを作成できる', () => {
      const anomaly = AnomalyType.create('element-order-swap')
      expect(anomaly.id).toBe('element-order-swap')
      expect(anomaly.category).toBe('structural')
      expect(anomaly.name).toBe('Element Order Swap')
    })

    it('無効な異変タイプはエラーを投げる', () => {
      expect(() => AnomalyType.create('invalid-type' as any)).toThrow('Invalid anomaly type: invalid-type')
    })
  })

  describe('getAllTypes', () => {
    it('すべての異変タイプを取得できる', () => {
      const allTypes = AnomalyType.getAllTypes()
      expect(allTypes.length).toBeGreaterThanOrEqual(15)
      expect(allTypes.every(type => type.id && type.category && type.name)).toBe(true)
    })
  })

  describe('getByCategory', () => {
    it('視覚的異変のみを取得できる', () => {
      const visualTypes = AnomalyType.getByCategory('visual')
      expect(visualTypes.length).toBeGreaterThanOrEqual(8)
      expect(visualTypes.every(type => type.category === 'visual')).toBe(true)
    })

    it('構造的異変のみを取得できる', () => {
      const structuralTypes = AnomalyType.getByCategory('structural')
      expect(structuralTypes.length).toBeGreaterThanOrEqual(7)
      expect(structuralTypes.every(type => type.category === 'structural')).toBe(true)
    })
  })

  describe('getByDifficulty', () => {
    it('指定難易度の異変タイプを取得できる', () => {
      const easyTypes = AnomalyType.getByDifficulty(1)
      expect(easyTypes.every(type => type.difficulty === 1)).toBe(true)
    })

    it('難易度範囲で異変タイプを取得できる', () => {
      const mediumTypes = AnomalyType.getByDifficultyRange(2, 4)
      expect(mediumTypes.every(type => 
        type.difficulty >= 2 && type.difficulty <= 4
      )).toBe(true)
    })
  })

  describe('random', () => {
    it('ランダムな異変タイプを取得できる', () => {
      const anomaly = AnomalyType.random()
      expect(anomaly.id).toBeDefined()
      expect(anomaly.category).toBeDefined()
      expect(anomaly.name).toBeDefined()
    })

    it('カテゴリ指定でランダムな異変タイプを取得できる', () => {
      const visualAnomaly = AnomalyType.randomByCategory('visual')
      expect(visualAnomaly.category).toBe('visual')
    })
  })

  describe('equals', () => {
    it('同じIDの異変タイプは等しい', () => {
      const anomaly1 = AnomalyType.create('padding-difference')
      const anomaly2 = AnomalyType.create('padding-difference')
      expect(anomaly1.equals(anomaly2)).toBe(true)
    })

    it('異なるIDの異変タイプは等しくない', () => {
      const anomaly1 = AnomalyType.create('padding-difference')
      const anomaly2 = AnomalyType.create('margin-difference')
      expect(anomaly1.equals(anomaly2)).toBe(false)
    })
  })
})