import { describe, it, expect, vi } from 'vitest'
import { Page } from './Page'
import { StatusCode } from '../value-objects/StatusCode'
import { PageLevel } from '../value-objects/PageLevel'
import { Anomaly } from './Anomaly'
import { AnomalyType } from '../value-objects/AnomalyType'

describe('Page', () => {
  describe('create', () => {
    it('ページインスタンスを作成できる', () => {
      const statusCode = StatusCode.create(204)
      const page = Page.create(statusCode)
      
      expect(page.id).toBeDefined()
      expect(page.statusCode.equals(statusCode)).toBe(true)
      expect(page.level.value).toBe(1)
      expect(page.anomalies).toEqual([])
      expect(page.hasAnomaly).toBe(false)
    })

    it('異変付きでページを作成できる', () => {
      const statusCode = StatusCode.create(203)
      const anomaly = Anomaly.random()
      const page = Page.create(statusCode, [anomaly])
      
      expect(page.anomalies.length).toBe(1)
      expect(page.hasAnomaly).toBe(true)
    })
  })

  describe('shouldHaveAnomaly', () => {
    it('確率に基づいて異変の有無を決定する', () => {
      const statusCode = StatusCode.create(204)
      const page = Page.create(statusCode)
      
      Math.random = vi.fn(() => 0.2)
      expect(page.shouldHaveAnomaly()).toBe(true)
      
      Math.random = vi.fn(() => 0.5)
      expect(page.shouldHaveAnomaly()).toBe(false)
    })
  })

  describe('generateWithRandomAnomaly', () => {
    it('ランダムな異変を持つページを生成できる', () => {
      const statusCode = StatusCode.create(203)
      Math.random = vi.fn(() => 0.2)
      
      const page = Page.generateWithRandomAnomaly(statusCode)
      
      expect(page.hasAnomaly).toBe(true)
      expect(page.anomalies.length).toBeGreaterThan(0)
    })

    it('確率的に異変なしのページを生成できる', () => {
      const statusCode = StatusCode.create(203)
      Math.random = vi.fn(() => 0.8)
      
      const page = Page.generateWithRandomAnomaly(statusCode)
      
      expect(page.hasAnomaly).toBe(false)
      expect(page.anomalies.length).toBe(0)
    })
  })

  describe('addAnomaly / removeAnomaly', () => {
    it('異変を追加できる', () => {
      const statusCode = StatusCode.create(204)
      const page = Page.create(statusCode)
      const anomaly = Anomaly.random()
      
      const updatedPage = page.addAnomaly(anomaly)
      
      expect(updatedPage.anomalies.length).toBe(1)
      expect(updatedPage.hasAnomaly).toBe(true)
    })

    it('異変を削除できる', () => {
      const statusCode = StatusCode.create(204)
      const anomaly = Anomaly.random()
      const page = Page.create(statusCode, [anomaly])
      
      const updatedPage = page.removeAnomaly(anomaly.id)
      
      expect(updatedPage.anomalies.length).toBe(0)
      expect(updatedPage.hasAnomaly).toBe(false)
    })
  })

  describe('activateAnomalies / deactivateAnomalies', () => {
    it('すべての異変を活性化できる', () => {
      const statusCode = StatusCode.create(204)
      const anomaly1 = Anomaly.random()
      const anomaly2 = Anomaly.random()
      const page = Page.create(statusCode, [anomaly1, anomaly2])
      
      const activatedPage = page.activateAnomalies()
      
      expect(activatedPage.anomalies.every(a => a.isActive)).toBe(true)
    })

    it('すべての異変を非活性化できる', () => {
      const statusCode = StatusCode.create(204)
      const anomaly1 = Anomaly.random().activate()
      const anomaly2 = Anomaly.random().activate()
      const page = Page.create(statusCode, [anomaly1, anomaly2])
      
      const deactivatedPage = page.deactivateAnomalies()
      
      expect(deactivatedPage.anomalies.every(a => !a.isActive)).toBe(true)
    })
  })

  describe('getActiveAnomalies', () => {
    it('活性化された異変のみを取得できる', () => {
      const statusCode = StatusCode.create(204)
      const anomaly1 = Anomaly.random().activate()
      const anomaly2 = Anomaly.random()
      const page = Page.create(statusCode, [anomaly1, anomaly2])
      
      const activeAnomalies = page.getActiveAnomalies()
      
      expect(activeAnomalies.length).toBe(1)
      expect(activeAnomalies[0].id).toBe(anomaly1.id)
    })
  })

  describe('generateCSS', () => {
    it('すべての活性化異変のCSSを生成できる', () => {
      const statusCode = StatusCode.create(204)
      const type1 = AnomalyType.create('padding-difference')
      const type2 = AnomalyType.create('color-difference')
      
      const anomaly1 = Anomaly.create(type1, {
        targetElement: '.button',
        anomalyValue: '11px'
      }).activate()
      
      const anomaly2 = Anomaly.create(type2, {
        targetElement: '.text',
        anomalyValue: '#FEFEFE'
      }).activate()
      
      const page = Page.create(statusCode, [anomaly1, anomaly2])
      const css = page.generateCSS()
      
      expect(css).toContain('.button')
      expect(css).toContain('padding')
      expect(css).toContain('.text')
      expect(css).toContain('color')
    })
  })

  describe('checkPlayerChoice', () => {
    it('異変ありで「戻る」を選択すると正解', () => {
      const statusCode = StatusCode.create(203)
      const anomaly = Anomaly.random()
      const page = Page.create(statusCode, [anomaly])
      
      expect(page.checkPlayerChoice('back')).toBe(true)
      expect(page.checkPlayerChoice('forward')).toBe(false)
    })

    it('異変なしで「進む」を選択すると正解', () => {
      const statusCode = StatusCode.create(203)
      const page = Page.create(statusCode, [])
      
      expect(page.checkPlayerChoice('forward')).toBe(true)
      expect(page.checkPlayerChoice('back')).toBe(false)
    })
  })

  describe('equals', () => {
    it('同じページオブジェクトから派生したページは同じIDを持つ', () => {
      const statusCode = StatusCode.create(204)
      const page1 = Page.create(statusCode)
      const anomaly = Anomaly.random()
      const page2 = page1.addAnomaly(anomaly).removeAnomaly(anomaly.id)
      
      expect(page1.equals(page2)).toBe(true)
    })

    it('異なるIDのページは等しくない', () => {
      const statusCode = StatusCode.create(204)
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(2000)
      
      const page1 = Page.create(statusCode)
      const page2 = Page.create(statusCode)
      
      expect(page1.equals(page2)).toBe(false)
      
      vi.restoreAllMocks()
    })
  })
})