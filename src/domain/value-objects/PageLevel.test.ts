import { describe, it, expect } from 'vitest'
import { PageLevel } from './PageLevel'

describe('PageLevel', () => {
  describe('fromStatusCode', () => {
    it('204はレベル1', () => {
      const level = PageLevel.fromStatusCode(204)
      expect(level.value).toBe(1)
      expect(level.displayName).toBe('Level 1')
    })

    it('203はレベル2', () => {
      const level = PageLevel.fromStatusCode(203)
      expect(level.value).toBe(2)
      expect(level.displayName).toBe('Level 2')
    })

    it('202はレベル3', () => {
      const level = PageLevel.fromStatusCode(202)
      expect(level.value).toBe(3)
      expect(level.displayName).toBe('Level 3')
    })

    it('201はレベル4', () => {
      const level = PageLevel.fromStatusCode(201)
      expect(level.value).toBe(4)
      expect(level.displayName).toBe('Level 4')
    })

    it('200はレベル5（最終）', () => {
      const level = PageLevel.fromStatusCode(200)
      expect(level.value).toBe(5)
      expect(level.displayName).toBe('Final Level')
    })

    it('404は特殊レベル', () => {
      const level = PageLevel.fromStatusCode(404)
      expect(level.value).toBe(0)
      expect(level.displayName).toBe('Game Over')
    })
  })

  describe('create', () => {
    it('有効なレベル値で作成できる', () => {
      const level = PageLevel.create(3)
      expect(level.value).toBe(3)
      expect(level.displayName).toBe('Level 3')
    })

    it('無効なレベル値はエラーを投げる', () => {
      expect(() => PageLevel.create(6)).toThrow('Invalid page level: 6')
      expect(() => PageLevel.create(-1)).toThrow('Invalid page level: -1')
    })
  })

  describe('properties', () => {
    it('最終レベルを判定できる', () => {
      const finalLevel = PageLevel.create(5)
      const normalLevel = PageLevel.create(3)
      
      expect(finalLevel.isFinal()).toBe(true)
      expect(normalLevel.isFinal()).toBe(false)
    })

    it('ゲームオーバーレベルを判定できる', () => {
      const gameOverLevel = PageLevel.create(0)
      const normalLevel = PageLevel.create(3)
      
      expect(gameOverLevel.isGameOver()).toBe(true)
      expect(normalLevel.isGameOver()).toBe(false)
    })

    it('異変出現確率を取得できる', () => {
      const level1 = PageLevel.create(1)
      const level3 = PageLevel.create(3)
      const level5 = PageLevel.create(5)
      
      expect(level1.anomalyProbability).toBe(0.3)
      expect(level3.anomalyProbability).toBe(0.5)
      expect(level5.anomalyProbability).toBe(0.7)
    })

    it('難易度範囲を取得できる', () => {
      const level1 = PageLevel.create(1)
      const level3 = PageLevel.create(3)
      const level5 = PageLevel.create(5)
      
      expect(level1.difficultyRange).toEqual({ min: 1, max: 2 })
      expect(level3.difficultyRange).toEqual({ min: 2, max: 4 })
      expect(level5.difficultyRange).toEqual({ min: 4, max: 5 })
    })
  })

  describe('equals', () => {
    it('同じレベル値は等しい', () => {
      const level1 = PageLevel.create(3)
      const level2 = PageLevel.create(3)
      expect(level1.equals(level2)).toBe(true)
    })

    it('異なるレベル値は等しくない', () => {
      const level1 = PageLevel.create(2)
      const level2 = PageLevel.create(3)
      expect(level1.equals(level2)).toBe(false)
    })
  })
})