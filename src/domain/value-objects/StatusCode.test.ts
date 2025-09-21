import { describe, it, expect } from 'vitest'
import { StatusCode } from './StatusCode'

describe('StatusCode', () => {
  describe('create', () => {
    it('204ステータスコードを作成できる', () => {
      const statusCode = StatusCode.create(204)
      expect(statusCode.value).toBe(204)
      expect(statusCode.label).toBe('No Content')
    })

    it('203ステータスコードを作成できる', () => {
      const statusCode = StatusCode.create(203)
      expect(statusCode.value).toBe(203)
      expect(statusCode.label).toBe('Non-Authoritative Information')
    })

    it('202ステータスコードを作成できる', () => {
      const statusCode = StatusCode.create(202)
      expect(statusCode.value).toBe(202)
      expect(statusCode.label).toBe('Accepted')
    })

    it('201ステータスコードを作成できる', () => {
      const statusCode = StatusCode.create(201)
      expect(statusCode.value).toBe(201)
      expect(statusCode.label).toBe('Created')
    })

    it('200ステータスコードを作成できる', () => {
      const statusCode = StatusCode.create(200)
      expect(statusCode.value).toBe(200)
      expect(statusCode.label).toBe('OK')
    })

    it('404ステータスコードを作成できる', () => {
      const statusCode = StatusCode.create(404)
      expect(statusCode.value).toBe(404)
      expect(statusCode.label).toBe('Not Found')
    })

    it('無効なステータスコードはエラーを投げる', () => {
      expect(() => StatusCode.create(500)).toThrow('Invalid status code: 500')
    })
  })

  describe('次のステータスコードへ進む', () => {
    it('204から203へ進める', () => {
      const current = StatusCode.create(204)
      const next = current.advance()
      expect(next.value).toBe(203)
    })

    it('203から202へ進める', () => {
      const current = StatusCode.create(203)
      const next = current.advance()
      expect(next.value).toBe(202)
    })

    it('202から201へ進める', () => {
      const current = StatusCode.create(202)
      const next = current.advance()
      expect(next.value).toBe(201)
    })

    it('201から200へ進める', () => {
      const current = StatusCode.create(201)
      const next = current.advance()
      expect(next.value).toBe(200)
    })

    it('200からは進めない（クリア状態）', () => {
      const current = StatusCode.create(200)
      const next = current.advance()
      expect(next.value).toBe(200)
    })

    it('404からは進めない', () => {
      const current = StatusCode.create(404)
      const next = current.advance()
      expect(next.value).toBe(404)
    })
  })

  describe('前のステータスコードへ戻る', () => {
    it('203から204へ戻れる', () => {
      const current = StatusCode.create(203)
      const previous = current.goBack()
      expect(previous.value).toBe(204)
    })

    it('202から203へ戻れる', () => {
      const current = StatusCode.create(202)
      const previous = current.goBack()
      expect(previous.value).toBe(203)
    })

    it('201から202へ戻れる', () => {
      const current = StatusCode.create(201)
      const previous = current.goBack()
      expect(previous.value).toBe(202)
    })

    it('200から201へ戻れる', () => {
      const current = StatusCode.create(200)
      const previous = current.goBack()
      expect(previous.value).toBe(201)
    })

    it('204からは戻れない（スタート状態）', () => {
      const current = StatusCode.create(204)
      const previous = current.goBack()
      expect(previous.value).toBe(204)
    })

    it('404からは戻れない', () => {
      const current = StatusCode.create(404)
      const previous = current.goBack()
      expect(previous.value).toBe(404)
    })
  })

  describe('状態判定', () => {
    it('204はスタート状態である', () => {
      const statusCode = StatusCode.create(204)
      expect(statusCode.isStart()).toBe(true)
      expect(statusCode.isGoal()).toBe(false)
      expect(statusCode.isGameOver()).toBe(false)
    })

    it('200はゴール状態である', () => {
      const statusCode = StatusCode.create(200)
      expect(statusCode.isStart()).toBe(false)
      expect(statusCode.isGoal()).toBe(true)
      expect(statusCode.isGameOver()).toBe(false)
    })

    it('404はゲームオーバー状態である', () => {
      const statusCode = StatusCode.create(404)
      expect(statusCode.isStart()).toBe(false)
      expect(statusCode.isGoal()).toBe(false)
      expect(statusCode.isGameOver()).toBe(true)
    })
  })

  describe('等価性', () => {
    it('同じ値のStatusCodeは等しい', () => {
      const code1 = StatusCode.create(204)
      const code2 = StatusCode.create(204)
      expect(code1.equals(code2)).toBe(true)
    })

    it('異なる値のStatusCodeは等しくない', () => {
      const code1 = StatusCode.create(204)
      const code2 = StatusCode.create(203)
      expect(code1.equals(code2)).toBe(false)
    })
  })
})