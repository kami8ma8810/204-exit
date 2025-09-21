import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RestartGameUseCase } from './RestartGameUseCase'
import { IGameRepository } from '@domain/repositories/IGameRepository'

describe('RestartGameUseCase', () => {
  let mockRepository: IGameRepository
  let useCase: RestartGameUseCase

  beforeEach(() => {
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      getCurrentGame: vi.fn().mockResolvedValue(null),
      getAllGames: vi.fn().mockResolvedValue([])
    }
    useCase = RestartGameUseCase.create(mockRepository)
  })

  describe('execute', () => {
    it('ゲームをリスタートできる', async () => {
      const currentGame = {
        id: 'game-1',
        currentStatusCode: 404,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(true)
      expect(result.value?.currentStatusCode).toBe(204)
      expect(result.value?.isGameOver).toBe(false)
      expect(result.value?.attempts).toBe(2)
      expect(mockRepository.save).toHaveBeenCalledOnce()
    })

    it('ゲームが存在しない場合は新規作成', async () => {
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(null)
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(true)
      expect(result.value?.currentStatusCode).toBe(204)
      expect(result.value?.attempts).toBe(1)
      expect(mockRepository.save).toHaveBeenCalledOnce()
    })
  })

  describe('エラーハンドリング', () => {
    it('保存エラー時はエラーを返す', async () => {
      const currentGame = {
        id: 'game-1',
        currentStatusCode: 404,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(currentGame)
      mockRepository.save = vi.fn().mockRejectedValue(new Error('Save failed'))
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(false)
      expect(result.error).toBe('Failed to restart game')
    })
  })
})