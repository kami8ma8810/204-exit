import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StartGameUseCase } from './StartGameUseCase'
import { IGameRepository } from '@domain/repositories/IGameRepository'

describe('StartGameUseCase', () => {
  let mockRepository: IGameRepository
  let useCase: StartGameUseCase

  beforeEach(() => {
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      load: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      getCurrentGame: vi.fn().mockResolvedValue(null),
      getAllGames: vi.fn().mockResolvedValue([])
    }
    useCase = StartGameUseCase.create(mockRepository)
  })

  describe('execute', () => {
    it('新しいゲームを開始できる', async () => {
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(true)
      expect(result.value).toBeDefined()
      expect(result.value?.currentStatusCode).toBe(204)
      expect(result.value?.currentLevel).toBe(1)
      expect(result.value?.isGameOver).toBe(false)
      expect(result.value?.isCleared).toBe(false)
      expect(result.value?.attempts).toBe(1)
      expect(mockRepository.save).toHaveBeenCalledOnce()
    })

    it('既存のゲームがある場合は削除してから新規作成', async () => {
      const existingGame = {
        id: 'existing-game',
        currentStatusCode: 203,
        history: [],
        attempts: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(existingGame)
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(true)
      expect(mockRepository.delete).toHaveBeenCalledWith('existing-game')
      expect(mockRepository.save).toHaveBeenCalledOnce()
    })
  })

  describe('executeWithContinue', () => {
    it('既存のゲームを継続できる', async () => {
      const existingGame = {
        id: 'existing-game',
        currentStatusCode: 203,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(existingGame)
      
      const result = await useCase.executeWithContinue()
      
      expect(result.isSuccess).toBe(true)
      expect(result.value?.id).toBe('existing-game')
      expect(result.value?.currentStatusCode).toBe(203)
      expect(result.value?.attempts).toBe(1)
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('既存のゲームがない場合は新規作成', async () => {
      mockRepository.getCurrentGame = vi.fn().mockResolvedValue(null)
      
      const result = await useCase.executeWithContinue()
      
      expect(result.isSuccess).toBe(true)
      expect(result.value?.currentStatusCode).toBe(204)
      expect(result.value?.attempts).toBe(1)
      expect(mockRepository.save).toHaveBeenCalledOnce()
    })
  })

  describe('エラーハンドリング', () => {
    it('保存エラー時はエラーを返す', async () => {
      mockRepository.save = vi.fn().mockRejectedValue(new Error('Save failed'))
      
      const result = await useCase.execute()
      
      expect(result.isSuccess).toBe(false)
      expect(result.error).toBe('Failed to start new game')
    })
  })
})