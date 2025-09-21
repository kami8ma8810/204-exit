import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GoBackPageUseCase } from './GoBackPageUseCase'
import { IGameRepository } from '@domain/repositories/IGameRepository'

describe('GoBackPageUseCase', () => {
  let mockRepository: IGameRepository
  let useCase: GoBackPageUseCase

  beforeEach(() => {
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      getCurrentGame: vi.fn().mockResolvedValue(null),
      getAllGames: vi.fn().mockResolvedValue([])
    }
    useCase = GoBackPageUseCase.create(mockRepository)
  })

  describe('execute', () => {
    it('前のページへ戻れる', async () => {
      const currentGame = {
        id: 'game-1',
        currentStatusCode: 203,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect([204, 404].includes(result.value.currentStatusCode)).toBe(true)
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
        currentStatusCode: 203,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      mockRepository.save = vi.fn().mockRejectedValue(new Error('Save failed'))
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(false)
      expect(result.error).toBe('Failed to go back')
    })
  })
})