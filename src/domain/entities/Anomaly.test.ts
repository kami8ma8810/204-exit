import { describe, it, expect } from 'vitest'
import { Anomaly } from './Anomaly'
import { AnomalyType } from '../value-objects/AnomalyType'

describe('Anomaly', () => {
  describe('create', () => {
    it('異変インスタンスを作成できる', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly = Anomaly.create(type, { 
        targetElement: '.button',
        originalValue: '10px',
        anomalyValue: '11px'
      })
      
      expect(anomaly.id).toBeDefined()
      expect(anomaly.type.equals(type)).toBe(true)
      expect(anomaly.config.targetElement).toBe('.button')
      expect(anomaly.config.originalValue).toBe('10px')
      expect(anomaly.config.anomalyValue).toBe('11px')
      expect(anomaly.isActive).toBe(false)
    })

    it('IDは一意である', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly1 = Anomaly.create(type, {})
      const anomaly2 = Anomaly.create(type, {})
      
      expect(anomaly1.id).not.toBe(anomaly2.id)
    })
  })

  describe('activate/deactivate', () => {
    it('異変を活性化できる', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly = Anomaly.create(type, {})
      
      const activated = anomaly.activate()
      expect(activated.isActive).toBe(true)
      expect(activated.id).toBe(anomaly.id)
    })

    it('異変を非活性化できる', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly = Anomaly.create(type, {})
      const activated = anomaly.activate()
      
      const deactivated = activated.deactivate()
      expect(deactivated.isActive).toBe(false)
      expect(deactivated.id).toBe(anomaly.id)
    })
  })

  describe('generateCSSRule', () => {
    it('padding差異のCSSルールを生成できる', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly = Anomaly.create(type, {
        targetElement: '.button',
        originalValue: '10px',
        anomalyValue: '11px'
      }).activate()
      
      const css = anomaly.generateCSSRule()
      expect(css).toContain('.button')
      expect(css).toContain('padding')
      expect(css).toContain('11px')
    })

    it('color差異のCSSルールを生成できる', () => {
      const type = AnomalyType.create('color-difference')
      const anomaly = Anomaly.create(type, {
        targetElement: '.text',
        originalValue: '#FFFFFF',
        anomalyValue: '#FEFEFE'
      }).activate()
      
      const css = anomaly.generateCSSRule()
      expect(css).toContain('.text')
      expect(css).toContain('color')
      expect(css).toContain('#FEFEFE')
    })

    it('活性化されていない場合は空文字を返す', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly = Anomaly.create(type, {
        targetElement: '.button',
        anomalyValue: '11px'
      })
      
      const css = anomaly.generateCSSRule()
      expect(css).toBe('')
    })
  })

  describe('generateHTMLModification', () => {
    it('要素順序入れ替えの指示を生成できる', () => {
      const type = AnomalyType.create('element-order-swap')
      const anomaly = Anomaly.create(type, {
        targetElement: '.container',
        swapIndices: [0, 1]
      }).activate()
      
      const modification = anomaly.generateHTMLModification()
      expect(modification).toBeDefined()
      expect(modification!.type).toBe('swap')
      expect(modification!.target).toBe('.container')
      expect(modification!.indices).toEqual([0, 1])
    })

    it('テキスト変更の指示を生成できる', () => {
      const type = AnomalyType.create('text-character-difference')
      const anomaly = Anomaly.create(type, {
        targetElement: '.title',
        originalText: 'Hello',
        anomalyText: 'Hallo'
      }).activate()
      
      const modification = anomaly.generateHTMLModification()
      expect(modification).toBeDefined()
      expect(modification!.type).toBe('text')
      expect(modification!.target).toBe('.title')
      expect(modification!.newText).toBe('Hallo')
    })
  })

  describe('equals', () => {
    it('同じIDの異変は等しい', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly1 = Anomaly.create(type, {})
      const anomaly2 = Object.assign({}, anomaly1)
      
      expect(anomaly1.equals(anomaly2)).toBe(true)
    })

    it('異なるIDの異変は等しくない', () => {
      const type = AnomalyType.create('padding-difference')
      const anomaly1 = Anomaly.create(type, {})
      const anomaly2 = Anomaly.create(type, {})
      
      expect(anomaly1.equals(anomaly2)).toBe(false)
    })
  })

  describe('random', () => {
    it('ランダムな異変を生成できる', () => {
      const anomaly = Anomaly.random()
      
      expect(anomaly.id).toBeDefined()
      expect(anomaly.type).toBeDefined()
      expect(anomaly.config).toBeDefined()
    })

    it('カテゴリ指定でランダムな異変を生成できる', () => {
      const visualAnomaly = Anomaly.randomByCategory('visual')
      expect(visualAnomaly.type.category).toBe('visual')
      
      const structuralAnomaly = Anomaly.randomByCategory('structural')
      expect(structuralAnomaly.type.category).toBe('structural')
    })

    it('難易度指定でランダムな異変を生成できる', () => {
      const easyAnomaly = Anomaly.randomByDifficulty(1)
      expect(easyAnomaly.type.difficulty).toBe(1)
    })
  })
})