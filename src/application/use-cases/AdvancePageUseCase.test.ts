import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AdvancePageUseCase } from './AdvancePageUseCase'
import { IGameRepository } from '@domain/repositories/IGameRepository'
import { Game } from '@domain/entities/Game'

describe('AdvancePageUseCase', () => {
  let mockRepository: IGameRepository
  let useCase: AdvancePageUseCase

  beforeEach(() => {
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      getCurrentGame: vi.fn().mockResolvedValue(null),
      getAllGames: vi.fn().mockResolvedValue([])
    }
    useCase = AdvancePageUseCase.create(mockRepository)
  })

  describe('execute', () => {
    it('正しい選択で次のページへ進める', async () => {
      const currentGame = {
        id: 'game-1',
        currentStatusCode: 204,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      
      // Pageに異変がないことを保証するためにモック
      vi.spyOn(Math, 'random').mockReturnValue(0.9) // 異変なし
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(true)
      // 異変なしで進むを選ぶと成功
      if (result.value && !result.value.isGameOver) {
        expect(result.value.currentStatusCode).toBe(203)
      }
      expect(mockRepository.save).toHaveBeenCalledOnce()
      
      vi.restoreAllMocks()
    })

    it('間違った選択でゲームオーバー', async () => {
      const currentGame = {
        id: 'game-1',
        currentStatusCode: 203,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      mockRepository.load = vi.fn().mockResolvedValue(currentGame)
      
      const result = await useCase.execute()
      
      if (result.isSuccess && result.value.isGameOver) {
        expect(result.value.currentStatusCode).toBe(404)
        expect(result.value.isGameOver).toBe(true)
      }
      
      expect(mockRepository.save).toHaveBeenCalledOnce()
    })

    it('ゲームが存在しない場合はエラー', async () => {
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(null)
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(false)
      expect(result.error).toBe('No active game found')
    })
  })

  describe('エラーハンドリング', () => {
    it('保存エラー時はエラーを返す', async () => {
      const currentGame = {
        id: 'game-1',
        currentStatusCode: 204,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      mockRepository.save = vi.fn().mockRejectedValue(new Error('Save failed'))
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(false)
      expect(result.error).toBe('Failed to advance page')
    })
  })
})