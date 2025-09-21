import { describe, it, expect, vi } from 'vitest'
import { Game } from './Game'
import { StatusCode } from '../value-objects/StatusCode'

describe('Game', () => {
  describe('create', () => {
    it('ゲームインスタンスを作成できる', () => {
      const game = Game.create()
      
      expect(game.id).toBeDefined()
      expect(game.currentPage).toBeDefined()
      expect(game.currentPage.statusCode.value).toBe(204)
      expect(game.history.length).toBe(0)
      expect(game.isGameOver).toBe(false)
      expect(game.isCleared).toBe(false)
      expect(game.attempts).toBe(1)
    })

    it('カスタムIDでゲームを作成できる', () => {
      const game = Game.createWithId('custom-game-id')
      
      expect(game.id).toBe('custom-game-id')
    })
  })

  describe('makeChoice', () => {
    it('正しい選択で次のページへ進める', () => {
      const game = Game.create()
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(true)
      
      const nextGame = game.makeChoice('forward')
      
      expect(nextGame.currentPage.statusCode.value).toBe(203)
      expect(nextGame.history.length).toBe(1)
      expect(nextGame.isGameOver).toBe(false)
    })

    it('間違った選択でゲームオーバー', () => {
      const game = Game.create()
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(false)
      
      const nextGame = game.makeChoice('forward')
      
      expect(nextGame.currentPage.statusCode.value).toBe(404)
      expect(nextGame.isGameOver).toBe(true)
    })

    it('200に到達するとクリア', () => {
      let game = Game.create()
      
      const statusCodes = [203, 202, 201, 200]
      statusCodes.forEach(code => {
        vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(true)
        game = game.makeChoice('forward')
      })
      
      expect(game.currentPage.statusCode.value).toBe(200)
      expect(game.isCleared).toBe(true)
    })

    it('戻るを選択して前のステータスコードへ', () => {
      let game = Game.create()
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(true)
      game = game.makeChoice('forward')
      
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(true)
      const backGame = game.makeChoice('back')
      
      expect(backGame.currentPage.statusCode.value).toBe(204)
    })
  })

  describe('restart', () => {
    it('ゲームをリスタートできる', () => {
      let game = Game.create()
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(false)
      game = game.makeChoice('forward')
      
      expect(game.isGameOver).toBe(true)
      expect(game.attempts).toBe(1)
      
      const restarted = game.restart()
      
      expect(restarted.id).toBe(game.id)
      expect(restarted.currentPage.statusCode.value).toBe(204)
      expect(restarted.isGameOver).toBe(false)
      expect(restarted.attempts).toBe(2)
      expect(restarted.history.length).toBe(0)
    })
  })

  describe('getProgress', () => {
    it('進行度を取得できる', () => {
      const game = Game.create()
      expect(game.getProgress()).toBe(0)
      
      let nextGame = game
      vi.spyOn(nextGame.currentPage, 'checkPlayerChoice').mockReturnValue(true)
      nextGame = nextGame.makeChoice('forward')
      expect(nextGame.getProgress()).toBe(0.25)
      
      vi.spyOn(nextGame.currentPage, 'checkPlayerChoice').mockReturnValue(true)
      nextGame = nextGame.makeChoice('forward')
      expect(nextGame.getProgress()).toBe(0.5)
    })
  })

  describe('getStatistics', () => {
    it('ゲーム統計を取得できる', () => {
      let game = Game.create()
      
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(true)
      game = game.makeChoice('forward')
      
      vi.spyOn(game.currentPage, 'checkPlayerChoice').mockReturnValue(false)
      game = game.makeChoice('forward')
      
      const stats = game.getStatistics()
      
      expect(stats.totalMoves).toBe(2)
      expect(stats.correctMoves).toBe(1)
      expect(stats.incorrectMoves).toBe(1)
      expect(stats.accuracy).toBe(0.5)
      expect(stats.currentLevel).toBe(0)
      expect(stats.maxLevel).toBe(2)
      expect(stats.attempts).toBe(1)
      expect(stats.isCompleted).toBe(false)
    })
  })

  describe('getCurrentPageWithAnomaly', () => {
    it('異変が活性化されたページを取得できる', () => {
      const game = Game.create()
      const pageWithAnomaly = game.getCurrentPageWithAnomaly()
      
      if (pageWithAnomaly.hasAnomaly) {
        expect(pageWithAnomaly.getActiveAnomalies().length).toBeGreaterThan(0)
      }
    })
  })

  describe('equals', () => {
    it('同じIDのゲームは等しい', () => {
      const game1 = Game.createWithId('game-1')
      const game2 = game1.makeChoice('forward')
      
      expect(game1.equals(game2)).toBe(true)
    })

    it('異なるIDのゲームは等しくない', () => {
      const game1 = Game.create()
      const game2 = Game.create()
      
      expect(game1.equals(game2)).toBe(false)
    })
  })
})